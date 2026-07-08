"use client";

import { useCallback } from "react";
import { playSound } from "@/lib/sound-engine";
import type { SoundAsset } from "@/lib/sound-types";

/**
 * Returns a stable `play()` function for one-shot audio feedback.
 * Silently ignores errors (e.g. AudioContext not yet unlocked).
 *
 * @param asset   - SoundAsset from @soundcn (click-001, switch-on, etc.)
 * @param volume  - Default 0 – 1. Defaults to 0.7.
 */
export function useSound(asset: SoundAsset, volume = 0.7) {
  return useCallback(
    (overrideVolume?: number) => {
      playSound(asset.dataUri, { volume: overrideVolume ?? volume }).catch(
        () => {
          // Ignore — AudioContext may not be unlocked yet or browser blocked.
        },
      );
    },
    [asset.dataUri, volume],
  );
}
