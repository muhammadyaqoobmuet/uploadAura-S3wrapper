"""
Writer Clone Multi-Agent System
================================
LangGraph implementation of the pipeline described in writer_clone_guideline.txt

Pattern: orchestrator-worker (chunk -> parallel rewriters) fused with
evaluator-optimizer (score -> revise loop), followed by a stitcher and a
final QA pass.

Requires:
    pip install langgraph langchain-anthropic --break-system-packages

Usage:
    export ANTHROPIC_API_KEY=your_key
    python writer_clone_agent.py --essays essay1.txt essay2.txt essay3.txt \
                                 --draft ai_draft.txt --out final_essay.txt
"""

import argparse
import json
import operator
from typing import Annotated, TypedDict

from langchain_anthropic import ChatAnthropic
from langgraph.graph import StateGraph, START, END
from langgraph.constants import Send

MODEL_NAME = "claude-sonnet-4-6"
MAX_REVISION_ROUNDS = 3
SCORE_THRESHOLD = 8  # out of 10

llm = ChatAnthropic(model=MODEL_NAME, max_tokens=4000, temperature=0.4)


# ---------------------------------------------------------------------------
# State schemas
# ---------------------------------------------------------------------------
class ChunkResult(TypedDict):
    index: int
    original: str
    rewritten: str
    score: int
    feedback: str
    rounds: int


class WorkerState(TypedDict):
    index: int
    chunk: str
    style_profile: str


class GraphState(TypedDict):
    essays: list[str]          # user's own writing samples
    draft: str                 # AI-written draft to convert
    style_profile: str         # extracted style profile (structured text)
    chunks: list[str]
    chunk_results: Annotated[list[ChunkResult], operator.add]
    final_essay: str
    original_word_count: int
    final_word_count: int


# ---------------------------------------------------------------------------
# Node: extract style profile from the user's own essays
# ---------------------------------------------------------------------------
def extract_style_profile(state: GraphState) -> dict:
    samples = "\n\n---ESSAY---\n\n".join(state["essays"])
    prompt = f"""Analyze the following writing samples from one author and produce a
structured Style Profile covering: sentence structure and length variation, vocabulary
and word choice (including words the author repeats and words they clearly avoid),
transitions and flow, punctuation habits, paragraph shape, opening/closing patterns,
tone and first-person presence, and a list of generic AI-sounding patterns the author
never uses. Be concrete and checkable, not vague adjectives.

WRITING SAMPLES:
{samples}

Output the Style Profile as a structured bullet list under clear headings."""
    result = llm.invoke(prompt)
    return {"style_profile": result.content}


# ---------------------------------------------------------------------------
# Node: chunk the AI draft into logical sections
# ---------------------------------------------------------------------------
def chunk_draft(state: GraphState) -> dict:
    prompt = f"""Split the following essay into logical sections (introduction, each
main point/argument, conclusion). Return ONLY a JSON array of strings, one string per
section, preserving the full original text of each section with nothing dropped.

ESSAY:
{state['draft']}"""
    result = llm.invoke(prompt)
    text = result.content.strip()
    if text.startswith("```"):
        text = text.strip("`")
        text = text.split("\n", 1)[1] if "\n" in text else text
    chunks = json.loads(text)
    word_count = len(state["draft"].split())
    return {"chunks": chunks, "original_word_count": word_count}


# ---------------------------------------------------------------------------
# Fan-out: dispatch one worker per chunk (orchestrator-worker pattern)
# ---------------------------------------------------------------------------
def dispatch_workers(state: GraphState):
    return [
        Send("rewrite_worker", {
            "index": i,
            "chunk": chunk,
            "style_profile": state["style_profile"],
        })
        for i, chunk in enumerate(state["chunks"])
    ]


# ---------------------------------------------------------------------------
# Worker node: rewrite one chunk, then self-evaluate/revise (evaluator-optimizer)
# ---------------------------------------------------------------------------
def rewrite_worker(worker_state: WorkerState) -> dict:
    index = worker_state["index"]
    chunk = worker_state["chunk"]
    style_profile = worker_state["style_profile"]
    original_words = len(chunk.split())

    rewrite_prompt = f"""Rewrite the following section to match this Style Profile.
Preserve every fact, claim, and example -- do not shorten or summarize. Match the
word count within 10% of the original section ({original_words} words). Do not use
generic AI phrasing the Style Profile flags as avoided.

STYLE PROFILE:
{style_profile}

SECTION TO REWRITE:
{chunk}"""

    rewritten = llm.invoke(rewrite_prompt).content
    feedback = ""
    score = 0

    for round_num in range(1, MAX_REVISION_ROUNDS + 1):
        eval_prompt = f"""Score this rewrite from 1-10 on how well it matches the
Style Profile AND whether its word count is within 10% of {original_words} words.
Return ONLY JSON: {{"score": <int>, "feedback": "<specific issues to fix>"}}.

STYLE PROFILE:
{style_profile}

REWRITE:
{rewritten}"""
        eval_result = llm.invoke(eval_prompt).content.strip()
        if eval_result.startswith("```"):
            eval_result = eval_result.strip("`")
            eval_result = eval_result.split("\n", 1)[1] if "\n" in eval_result else eval_result
        parsed = json.loads(eval_result)
        score = parsed["score"]
        feedback = parsed["feedback"]

        if score >= SCORE_THRESHOLD:
            break

        revise_prompt = f"""Revise this rewrite to fix the following issues, while
still matching the Style Profile and keeping the word count near {original_words}
words. Do not drop any content.

ISSUES TO FIX:
{feedback}

CURRENT REWRITE:
{rewritten}"""
        rewritten = llm.invoke(revise_prompt).content

    return {
        "chunk_results": [{
            "index": index,
            "original": chunk,
            "rewritten": rewritten,
            "score": score,
            "feedback": feedback,
            "rounds": round_num,
        }]
    }


# ---------------------------------------------------------------------------
# Node: stitch all rewritten chunks into one coherent essay
# ---------------------------------------------------------------------------
def stitch(state: GraphState) -> dict:
    ordered = sorted(state["chunk_results"], key=lambda c: c["index"])
    joined = "\n\n".join(c["rewritten"] for c in ordered)

    prompt = f"""These sections were rewritten independently and need to read as one
coherent essay in a single consistent voice. Fix transition seams between sections
and any voice drift. Do not shorten or drop content.

SECTIONS (in order):
{joined}"""
    stitched = llm.invoke(prompt).content
    return {"final_essay": stitched}


# ---------------------------------------------------------------------------
# Node: final QA pass -- hunt remaining AI-tell phrases
# ---------------------------------------------------------------------------
def final_qa(state: GraphState) -> dict:
    prompt = f"""Read this full essay and remove any remaining generic AI-sounding
phrases (e.g. "in today's fast-paced world", "it is important to note", overuse of
"moreover/furthermore", generic motivational closings, excessive hedging, perfectly
uniform sentence lengths). Keep every point and example intact -- only adjust phrasing.

ESSAY:
{state['final_essay']}"""
    polished = llm.invoke(prompt).content
    return {
        "final_essay": polished,
        "final_word_count": len(polished.split()),
    }


# ---------------------------------------------------------------------------
# Build the graph
# ---------------------------------------------------------------------------
def build_graph():
    graph = StateGraph(GraphState)
    graph.add_node("extract_style_profile", extract_style_profile)
    graph.add_node("chunk_draft", chunk_draft)
    graph.add_node("rewrite_worker", rewrite_worker)
    graph.add_node("stitch", stitch)
    graph.add_node("final_qa", final_qa)

    graph.add_edge(START, "extract_style_profile")
    graph.add_edge("extract_style_profile", "chunk_draft")
    graph.add_conditional_edges("chunk_draft", dispatch_workers, ["rewrite_worker"])
    graph.add_edge("rewrite_worker", "stitch")
    graph.add_edge("stitch", "final_qa")
    graph.add_edge("final_qa", END)

    return graph.compile()


# ---------------------------------------------------------------------------
# CLI entry point
# ---------------------------------------------------------------------------
def main():
    parser = argparse.ArgumentParser(description="Writer clone multi-agent pipeline")
    parser.add_argument("--essays", nargs="+", required=True, help="Paths to your writing samples")
    parser.add_argument("--draft", required=True, help="Path to the AI-written draft")
    parser.add_argument("--out", default="final_essay.txt", help="Output file path")
    args = parser.parse_args()

    essays = [open(p, encoding="utf-8").read() for p in args.essays]
    draft = open(args.draft, encoding="utf-8").read()

    app = build_graph()
    result = app.invoke({"essays": essays, "draft": draft})

    with open(args.out, "w", encoding="utf-8") as f:
        f.write(result["final_essay"])

    print(f"Original word count: {result['original_word_count']}")
    print(f"Final word count:    {result['final_word_count']}")
    print(f"Saved to {args.out}")


if __name__ == "__main__":
    main()
