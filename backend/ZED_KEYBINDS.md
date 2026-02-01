# ⌨️ Zed Editor — Keyboard Hacks (Linux, No Vim)

> Your setup: **vim_mode OFF** · Project panel on the **RIGHT dock** · Tab bar hidden · Dank Mono 20px

---

## 🗂️ File & Project Navigation

| Keys                   | Action                                                             |
| ---------------------- | ------------------------------------------------------------------ |
| `Ctrl+P` or `Ctrl+E`   | 🔍 **Open file finder** (fuzzy search — fastest way to jump files) |
| `Ctrl+Shift+P` or `F1` | 🎛️ **Command palette** (search any Zed action by name)             |
| `Ctrl+T`               | 📦 **Go to symbol** in entire project                              |
| `Ctrl+Shift+O`         | 🧭 **Go to symbol** in current file (outline)                      |
| `Ctrl+G`               | 📍 **Go to line** number                                           |
| `Ctrl+R`               | 📂 **Open recent projects**                                        |
| `Ctrl+O`               | 📁 Open file by path                                               |

---

## 🏃 Cursor Movement

| Keys                  | Action                                                        |
| --------------------- | ------------------------------------------------------------- |
| `Ctrl+Home`           | ⬆️ **Go to top of file**                                      |
| `Ctrl+End`            | ⬇️ **Go to bottom of file**                                   |
| `Ctrl+←`              | ◀️ Jump to **previous word start**                            |
| `Ctrl+→`              | ▶️ Jump to **next word end**                                  |
| `Ctrl+Alt+←`          | ◀️ Jump to **previous sub-word** (camelCase/snake_case aware) |
| `Ctrl+Alt+→`          | ▶️ Jump to **next sub-word**                                  |
| `Home`                | ↖️ Start of line (smart — stops at indent first)              |
| `End`                 | ↗️ End of line                                                |
| `Ctrl+M` or `Ctrl+\|` | 🔀 Jump to **matching bracket**                               |
| `PageUp` / `PageDown` | Scroll page up/down                                           |

---

## 🖱️ Multi-Cursor & Selection

| Keys              | Action                                                       |
| ----------------- | ------------------------------------------------------------ |
| `Ctrl+D`          | ➕ **Select next occurrence** of current word (multi-cursor) |
| `Ctrl+Shift+L`    | ✅ **Select ALL occurrences** of current selection           |
| `Shift+Alt+↑`     | ⬆️ **Add cursor above**                                      |
| `Shift+Alt+↓`     | ⬇️ **Add cursor below**                                      |
| `Ctrl+A`          | Select all text                                              |
| `Ctrl+L`          | Select entire current line                                   |
| `Ctrl+Shift+←`    | Select to previous word start                                |
| `Ctrl+Shift+→`    | Select to next word end                                      |
| `Ctrl+Shift+Home` | Select to top of file                                        |
| `Ctrl+Shift+End`  | Select to bottom of file                                     |
| `Shift+Home`      | Select to beginning of line                                  |
| `Shift+End`       | Select to end of line                                        |
| `Alt+Shift+→`     | 🌳 **Expand selection** (smart syntax node)                  |
| `Alt+Shift+←`     | 🌱 **Shrink selection** (smart syntax node)                  |

---

## ✏️ Editing

| Keys                       | Action                                 |
| -------------------------- | -------------------------------------- |
| `Alt+↑`                    | 🔼 **Move line up**                    |
| `Alt+↓`                    | 🔽 **Move line down**                  |
| `Ctrl+Alt+Shift+↑`         | 📋 **Duplicate line up**               |
| `Ctrl+Alt+Shift+↓`         | 📋 **Duplicate line down**             |
| `Ctrl+Shift+K`             | 🗑️ **Delete entire line**              |
| `Ctrl+Shift+J`             | 🔗 **Join lines** (merge into one)     |
| `Ctrl+/`                   | 💬 **Toggle line comment**             |
| `Shift+Alt+A`              | 📝 **Toggle block comment**            |
| `Ctrl+Shift+I`             | 🎨 **Format file** (prettier/LSP)      |
| `Alt+Shift+O`              | 📦 Organize imports                    |
| `Ctrl+[`                   | ← Outdent                              |
| `Ctrl+]`                   | → Indent                               |
| `Ctrl+Z`                   | ↩️ Undo                                |
| `Ctrl+Shift+Z` or `Ctrl+Y` | ↪️ Redo                                |
| `Ctrl+Backspace`           | Delete word before cursor              |
| `Ctrl+Delete`              | Delete word after cursor               |
| `Ctrl+Enter`               | New line below (without moving cursor) |
| `Ctrl+Shift+Enter`         | New line above                         |

---

## 🔍 Search & Replace

| Keys                 | Action                                  |
| -------------------- | --------------------------------------- |
| `Ctrl+F`             | 🔍 **Find in current file**             |
| `Ctrl+H`             | 🔁 **Find & replace** in current file   |
| `Ctrl+Shift+F`       | 🌐 **Find in entire project**           |
| `Ctrl+Shift+H`       | 🌐 **Find & replace** in entire project |
| `F3` or `Ctrl+Alt+G` | ⏩ Next match                           |
| `Shift+F3`           | ⏪ Previous match                       |
| `Alt+Enter`          | Select **all matches** (in search bar)  |
| `Alt+C`              | Toggle case sensitivity                 |
| `Alt+W`              | Toggle whole word match                 |
| `Alt+R`              | Toggle regex mode                       |

---

## 🧩 Panels & Sidebar (Your Layout)

> Your project panel is on the **RIGHT dock**. Use these to toggle it.

| Keys           | Action                                                   |
| -------------- | -------------------------------------------------------- |
| `Ctrl+Alt+B`   | 🗂️ **Toggle RIGHT dock** ← your project panel lives here |
| `Ctrl+Shift+E` | 📁 **Focus / open project panel** (right dock)           |
| `Ctrl+B`       | Toggle **left dock**                                     |
| `Ctrl+J`       | Toggle **bottom dock**                                   |
| `Ctrl+Alt+Y`   | 👁️ Toggle **ALL docks** at once                          |
| `Ctrl+\`` `    | 💻 **Toggle terminal**                                   |
| `Ctrl+Shift+B` | 🧭 **Toggle outline panel**                              |
| `Ctrl+Shift+G` | 🌿 Toggle **git panel**                                  |
| `Ctrl+Shift+M` | ⚠️ Toggle **diagnostics/errors panel**                   |
| `Ctrl+Shift+X` | 🧩 Toggle **extensions**                                 |
| `Ctrl+Shift+C` | 👥 Toggle **collab panel**                               |

---

## 🤖 AI / Agent

| Keys                 | Action                                          |
| -------------------- | ----------------------------------------------- |
| `Ctrl+?`             | 🧠 **Toggle AI agent panel**                    |
| `Ctrl+Enter`         | ✨ **Inline AI assist** (in editor or terminal) |
| `Ctrl+>`             | ➕ **Add selection to AI thread**               |
| `Ctrl+Shift+R`       | 🔍 Open **agent diff view**                     |
| `Alt+Y`              | ✅ Accept agent suggestion (Keep)               |
| `Ctrl+Alt+Y`         | ✅ Keep change                                  |
| `Ctrl+Alt+Z`         | ❌ Reject change                                |
| `Shift+Alt+Y`        | ✅ Keep ALL agent changes                       |
| `Shift+Alt+Z`        | ❌ Reject ALL agent changes                     |
| `Ctrl+Alt+K`         | 🧠 Toggle **thinking mode**                     |
| `Ctrl+;`             | 📎 Open add context menu (in AI input)          |
| `Alt+Tab` or `Alt+L` | 🔄 Cycle through favorite AI models             |

---

## 🗃️ Tabs & Panes

| Keys              | Action                                  |
| ----------------- | --------------------------------------- |
| `Ctrl+W`          | ✖️ **Close active tab**                 |
| `Ctrl+Shift+T`    | ♻️ **Reopen closed tab**                |
| `Ctrl+Tab`        | 🔄 **Tab switcher** (recent order)      |
| `Ctrl+PageUp`     | ◀️ Previous tab                         |
| `Ctrl+PageDown`   | ▶️ Next tab                             |
| `Alt+1` … `Alt+9` | 📌 Switch to pane 1–9                   |
| `Alt+0`           | 📌 Go to last pane/tab                  |
| `Ctrl+\`          | 🪟 **Split editor right**               |
| `Ctrl+K →`        | Navigate to right pane                  |
| `Ctrl+K ←`        | Navigate to left pane                   |
| `Ctrl+K ↑`        | Navigate to pane above                  |
| `Ctrl+K ↓`        | Navigate to pane below                  |
| `Ctrl+K Ctrl+→`   | Move focus to right pane                |
| `Ctrl+K Ctrl+←`   | Move focus to left pane                 |
| `Ctrl+Alt+−`      | ↩️ Go **back** in navigation history    |
| `Ctrl+Alt+_`      | ↪️ Go **forward** in navigation history |

---

## 🧠 Code Intelligence (LSP)

| Keys            | Action                                       |
| --------------- | -------------------------------------------- |
| `F12`           | 🔎 **Go to definition**                      |
| `Ctrl+F12`      | 🔎 Go to **type definition**                 |
| `Shift+F12`     | 🔎 Go to **implementation**                  |
| `Alt+Shift+F12` | 🔎 **Find all references**                   |
| `Alt+F12`       | Open definition in **split**                 |
| `F2`            | ✏️ **Rename symbol**                         |
| `Ctrl+.`        | 💡 **Code actions** (quick fixes, refactors) |
| `Ctrl+K Ctrl+I` | 📖 **Hover** (show docs/types)               |
| `Ctrl+I`        | 📋 Show signature help                       |
| `Ctrl+Space`    | 🔡 Trigger **completions**                   |
| `F8`            | ⚡ Jump to **next diagnostic/error**         |
| `Shift+F8`      | ⚡ Jump to **previous diagnostic**           |

---

## 🌿 Git

| Keys            | Action                              |
| --------------- | ----------------------------------- |
| `Alt+.`         | ➡️ Go to **next git hunk** (change) |
| `Alt+,`         | ⬅️ Go to **previous git hunk**      |
| `Ctrl+Shift+G`  | 🌿 Focus git panel                  |
| `Alt+G B`       | 👤 Git **blame** on line            |
| `Ctrl+Alt+Y`    | Toggle staged                       |
| `Ctrl+K Ctrl+R` | 🔄 Git restore (revert hunk)        |

---

## 🔀 Code Folding

| Keys                  | Action            |
| --------------------- | ----------------- |
| `Ctrl+{`              | Fold block        |
| `Ctrl+}`              | Unfold lines      |
| `Ctrl+K Ctrl+L`       | Toggle fold       |
| `Ctrl+K Ctrl+0`       | Fold all          |
| `Ctrl+K Ctrl+J`       | Unfold all        |
| `Ctrl+K Ctrl+1` … `9` | Fold to level 1–9 |

---

## ⚙️ Settings & Zed

| Keys            | Action                        |
| --------------- | ----------------------------- |
| `Ctrl+,`        | ⚙️ **Open settings UI**       |
| `Ctrl+Alt+,`    | 📄 Open **settings.json**     |
| `Ctrl+K Ctrl+S` | ⌨️ Open **keymap editor**     |
| `Ctrl+K Ctrl+T` | 🎨 **Theme selector**         |
| `Ctrl+Shift+N`  | 🪟 New window                 |
| `Ctrl+N`        | 📄 New file                   |
| `Ctrl+S`        | 💾 Save                       |
| `Ctrl+Shift+S`  | 💾 Save as                    |
| `Ctrl+Alt+S`    | 💾 Save all                   |
| `Ctrl+=`        | 🔠 Increase font size         |
| `Ctrl+-`        | 🔡 Decrease font size         |
| `Ctrl+0`        | 🔤 Reset font size            |
| `Ctrl+Shift+W`  | ✖️ Close window               |
| `Shift+Escape`  | 🔍 Zoom / toggle focused mode |

---

## 💡 Power Tips for Your Setup

| Tip                                      | How                                                           |
| ---------------------------------------- | ------------------------------------------------------------- |
| **Jump to any file instantly**           | `Ctrl+P` → start typing filename — no need to use the sidebar |
| **Open your project panel (right side)** | `Ctrl+Alt+B` or `Ctrl+Shift+E`                                |
| **Multi-cursor on all occurrences**      | Select word → `Ctrl+Shift+L` → type to change all at once     |
| **Move line without cut/paste**          | `Alt+↑` or `Alt+↓`                                            |
| **Smart selection expansion**            | `Alt+Shift+→` keeps expanding to parent syntax nodes          |
| **Jump word by word**                    | Hold `Ctrl` + `←`/`→` arrows                                  |
| **Jump sub-word (camelCase)**            | Hold `Ctrl+Alt` + `←`/`→` arrows                              |
| **Close all panels at once**             | `Ctrl+Alt+Y`                                                  |
| **Inline AI anywhere**                   | `Ctrl+Enter` in the editor — no need to open the side panel   |
| **Navigate back after go-to-def**        | `Ctrl+Alt+−` to jump back in history                          |

---

_Generated from your `~/.config/zed/settings.json` + Zed Linux default keymap · June 2026_
