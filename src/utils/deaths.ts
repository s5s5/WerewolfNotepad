import type { GameState } from '../types/game';

export const getNightDead = (state: GameState, day: number): number[] => {
  const nd = state.days[day]?.nightDeath;
  return nd?.type === 'deaths' ? nd.players : [];
};

export const getDeadBefore = (state: GameState, day: number): number[] => {
  const dead = new Set<number>();
  for (let d = 1; d < day; d++) {
    getNightDead(state, d).forEach((p) => dead.add(p));
    state.days[d]?.dayDeaths?.forEach((p) => dead.add(p));
  }
  return [...dead];
};
