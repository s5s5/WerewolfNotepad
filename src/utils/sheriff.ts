import type { GameState } from '../types/game';

export interface BadgeState {
  sheriff?: number;
  torn: boolean;
}

/** 推导第 day 天（含当天警徽处理）之后的警徽归属，只读推导不存储 */
export const getBadgeStateAt = (state: GameState, day: number): BadgeState => {
  let sheriff: number | undefined;
  let torn = false;
  for (let d = 1; d <= day; d++) {
    const data = state.days[d];
    if (!data) continue;
    const result = data.sheriff?.result;
    if (d === 1 && result?.type === 'elected') sheriff = result.player;
    const badge = data.badgeAction;
    if (badge?.action === '移交' && badge.transferTo) {
      sheriff = badge.transferTo;
      torn = false;
    } else if (badge?.action === '撕警徽') {
      sheriff = undefined;
      torn = true;
    }
  }
  return { sheriff, torn };
};

export const getSheriffAt = (
  state: GameState,
  day: number,
): number | undefined => getBadgeStateAt(state, day).sheriff;
