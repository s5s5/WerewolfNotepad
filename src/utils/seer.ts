import { getBoard } from '../constants/boards';
import { getSeerClaimLabel } from '../constants/cardOptions';
import { compareChrono, forEachCard } from './mentions';
import type { GameState, MentionScene, SeerCheckAction } from '../types/game';

export interface SeerClaimCheck extends SeerCheckAction {
  day: number;
  scene: MentionScene;
  round?: number;
}

export interface SeerClaim {
  player: number;
  firstDay: number;
  firstScene: MentionScene;
  checks: SeerClaimCheck[];
  badgeFlow?: number[];
}

/** 只读推导：任一发言卡的 claimedIdentity 含“跳预言家”即视为跳预言家 */
export const collectSeerClaims = (state: GameState): SeerClaim[] => {
  const label = getSeerClaimLabel(getBoard(state.boardId));
  const visits: Parameters<Parameters<typeof forEachCard>[1]>[0][] = [];
  forEachCard(state, (v) => visits.push(v));
  visits.sort(compareChrono);

  const claimers = new Set(
    visits
      .filter((v) => v.card.claimedIdentity?.includes(label))
      .map((v) => v.speaker),
  );

  const map = new Map<number, SeerClaim>();
  visits.forEach(({ day, scene, round, speaker, card }) => {
    if (!claimers.has(speaker)) return;
    let claim = map.get(speaker);
    if (!claim) {
      if (!card.claimedIdentity?.includes(label)) return;
      claim = {
        player: speaker,
        firstDay: day,
        firstScene: scene,
        checks: [],
      };
      map.set(speaker, claim);
    }
    if (card.seerCheck)
      claim.checks.push({ ...card.seerCheck, day, scene, round });
    if (card.badgeFlow?.length) claim.badgeFlow = card.badgeFlow;
  });

  return [...map.values()];
};

export const getSeerClaimers = (state: GameState): number[] =>
  collectSeerClaims(state).map((c) => c.player);
