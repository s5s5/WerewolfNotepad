import { PLAYER_COUNT } from '../constants/roles';
import type { SpeechOrderConfig } from '../types/game';

/** 根据首位发言人与方向，计算实际发言顺序（仅影响渲染顺序） */
export const computeSpeechOrder = (
  config: SpeechOrderConfig | undefined,
  eligiblePlayers?: number[],
): number[] => {
  const pool = eligiblePlayers
    ? [...eligiblePlayers].sort((a, b) => a - b)
    : Array.from({ length: PLAYER_COUNT }, (_, i) => i + 1);

  if (!config) return pool;

  const { firstSpeaker, direction } = config;
  const startIdx = pool.indexOf(firstSpeaker);
  if (startIdx === -1) return pool;

  const ordered =
    direction === '正序'
      ? [...pool.slice(startIdx), ...pool.slice(0, startIdx)]
      : [
          ...pool.slice(0, startIdx + 1).reverse(),
          ...pool.slice(startIdx + 1).reverse(),
        ];

  return ordered;
};
