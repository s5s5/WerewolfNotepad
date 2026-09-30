import { getSheriffAt } from './sheriff';
import type {
  GameState,
  MentionScene,
  PlayerMention,
  SpeechCardData,
} from '../types/game';

const joinTargets = (targets: number[], arrow: boolean) =>
  targets.join(arrow ? '→' : '、');

const targetsAction = (type: string, targets: number[]) =>
  `${type} ${joinTargets(targets, type.includes('决斗'))}`;

const collectFromCard = (
  day: number,
  scene: MentionScene,
  speaker: number,
  card: SpeechCardData,
  round: number | undefined,
  out: PlayerMention[],
) => {
  const push = (target: number, action: string, reason?: string) => {
    out.push({ day, scene, round, speaker, target, action, reason });
  };

  if (card.seerCheck)
    push(card.seerCheck.target, card.seerCheck.result, card.seerCheck.reason);
  if (card.silverWater)
    push(card.silverWater.target, '银水', card.silverWater.reason);
  if (card.poison) push(card.poison.target, '毒', card.poison.reason);
  card.claims?.forEach((c) => {
    if (c.targets?.length) {
      const text = `${c.kind} ${c.targets.join('→')}`;
      new Set(c.targets).forEach((t) => push(t, text));
    } else if (c.target !== undefined)
      push(c.target, c.detail ? `${c.kind}:${c.detail}` : c.kind);
    else push(speaker, c.kind);
  });
  if (card.badgeFlow?.length) {
    const text = `警徽流 ${joinTargets(card.badgeFlow, true)}`;
    card.badgeFlow.forEach((target) => push(target, text));
  }
  [...(card.stances ?? []), ...(card.suggestions ?? [])].forEach((s) => {
    if (!s.targets?.length) return;
    const text = targetsAction(s.type, s.targets);
    s.targets.forEach((target) => push(target, text, s.reason));
  });
};

const collectVotes = (
  day: number,
  scene: MentionScene,
  records: { target: number; voters: number[] }[] | undefined,
  round: number | undefined,
  out: PlayerMention[],
) => {
  records?.forEach(({ target, voters }) => {
    voters.forEach((voter) => {
      out.push({ day, scene, round, speaker: voter, target, action: '投票' });
    });
  });
};

interface CardVisit {
  day: number;
  scene: MentionScene;
  speaker: number;
  card: SpeechCardData;
  round?: number;
}

const forEachCard = (state: GameState, visit: (v: CardVisit) => void) => {
  Object.entries(state.days).forEach(([dayStr, dayData]) => {
    const day = Number(dayStr);
    const each = (
      scene: MentionScene,
      speeches: Record<number, SpeechCardData>,
      round?: number,
    ) =>
      Object.entries(speeches).forEach(([speaker, card]) =>
        visit({ day, scene, speaker: Number(speaker), card, round }),
      );

    if (dayData.firstNightDeathSpeeches) {
      each('firstNightDeath', dayData.firstNightDeathSpeeches);
    }
    if (dayData.sheriff) {
      each('sheriff', dayData.sheriff.speeches);
      dayData.sheriff.pkRounds?.forEach((r, idx) =>
        each('sheriffPk', r.speeches, idx + 1),
      );
    }
    each('daytime', dayData.daytime.speeches);
    dayData.pkRounds?.forEach((r, idx) => each('dayPk', r.speeches, idx + 1));
    if (dayData.exitSpeeches) each('exitSpeech', dayData.exitSpeeches);
  });
};

const SCENE_ORDER: MentionScene[] = [
  'nightDeath',
  'firstNightDeath',
  'candidacy',
  'sheriff',
  'sheriffVote',
  'sheriffPk',
  'badge',
  'daytime',
  'dayVote',
  'dayPk',
  'pkVote',
  'dayDeath',
  'exitSpeech',
];

const compareChrono = (
  a: { day: number; scene: MentionScene; round?: number; speaker?: number },
  b: { day: number; scene: MentionScene; round?: number; speaker?: number },
) =>
  a.day - b.day ||
  SCENE_ORDER.indexOf(a.scene) - SCENE_ORDER.indexOf(b.scene) ||
  (a.round || 0) - (b.round || 0) ||
  (a.speaker || 0) - (b.speaker || 0);

export const collectAllMentions = (state: GameState): PlayerMention[] => {
  const mentions: PlayerMention[] = [];

  forEachCard(state, ({ day, scene, speaker, card, round }) =>
    collectFromCard(day, scene, speaker, card, round, mentions),
  );

  Object.entries(state.days).forEach(([dayStr, dayData]) => {
    const day = Number(dayStr);

    if (dayData.nightDeath?.type === 'deaths') {
      dayData.nightDeath.players.forEach((target) => {
        mentions.push({ day, scene: 'nightDeath', target, action: '夜晚死亡' });
      });
    }

    dayData.dayDeaths?.forEach((target) => {
      mentions.push({ day, scene: 'dayDeath', target, action: '白天倒牌' });
    });

    if (dayData.sheriff) {
      dayData.sheriff.candidates.forEach((target) => {
        mentions.push({ day, scene: 'candidacy', target, action: '上警' });
      });
      collectVotes(
        day,
        'sheriffVote',
        dayData.sheriff.voteRecords,
        undefined,
        mentions,
      );
      dayData.sheriff.pkRounds?.forEach((round, idx) => {
        collectVotes(day, 'pkVote', round.voteRecords, idx + 1, mentions);
        if (round.result?.type === 'exiled') {
          mentions.push({
            day,
            scene: 'pkVote',
            round: idx + 1,
            target: round.result.player,
            action: round.result.skillTrigger
              ? `PK出局（${round.result.skillTrigger}）`
              : 'PK出局',
          });
        }
      });
      if (dayData.sheriff.result?.type === 'elected') {
        mentions.push({
          day,
          scene: 'badge',
          target: dayData.sheriff.result.player,
          action: '当选警长',
        });
      }
    }

    if (
      dayData.badgeAction?.action === '移交' &&
      dayData.badgeAction.transferTo
    ) {
      mentions.push({
        day,
        scene: 'badge',
        target: dayData.badgeAction.transferTo,
        action: '获得警徽',
      });
    } else if (dayData.badgeAction?.action === '撕警徽') {
      const target = getSheriffAt(state, day - 1);
      if (target)
        mentions.push({ day, scene: 'badge', target, action: '撕警徽' });
    }

    collectVotes(day, 'dayVote', dayData.dayVote?.records, undefined, mentions);
    if (dayData.dayVote?.result?.type === 'exiled') {
      mentions.push({
        day,
        scene: 'dayVote',
        target: dayData.dayVote.result.player,
        action: dayData.dayVote.result.skillTrigger
          ? `投票出局（${dayData.dayVote.result.skillTrigger}）`
          : '投票出局',
      });
    }

    dayData.pkRounds?.forEach((round, idx) => {
      collectVotes(day, 'pkVote', round.voteRecords, idx + 1, mentions);
      if (round.result?.type === 'exiled') {
        mentions.push({
          day,
          scene: 'pkVote',
          round: idx + 1,
          target: round.result.player,
          action: round.result.skillTrigger
            ? `PK出局（${round.result.skillTrigger}）`
            : 'PK出局',
        });
      }
    });
  });

  return mentions.sort(compareChrono);
};

export interface VoteLine {
  day: number;
  scene: MentionScene;
  round?: number;
  voter: number;
  target: number;
}

export const collectVoteLines = (state: GameState): VoteLine[] =>
  collectAllMentions(state)
    .filter((m) => m.action === '投票' && m.speaker !== undefined)
    .map((m) => ({
      day: m.day,
      scene: m.scene,
      round: m.round,
      voter: m.speaker as number,
      target: m.target,
    }));

export interface SpeechEntry {
  day: number;
  scene: MentionScene;
  round?: number;
  speaker: number;
  lines: string[];
}

const withTargets = (type: string, targets?: number[], reason?: string) =>
  `${targets?.length ? targetsAction(type, targets) : type}${
    reason ? `（${reason}）` : ''
  }`;

export const describeCard = (card: SpeechCardData): string[] => {
  const lines: string[] = [];
  const r = (x?: string) => (x ? `（${x}）` : '');
  if (card.claimedIdentity?.length)
    lines.push(`声称：${card.claimedIdentity.join('/')}`);
  if (card.seerCheck)
    lines.push(
      `验 ${card.seerCheck.target}号 ${card.seerCheck.result}${r(card.seerCheck.reason)}`,
    );
  if (card.silverWater)
    lines.push(
      `报 ${card.silverWater.target}号 银水${r(card.silverWater.reason)}`,
    );
  if (card.poison)
    lines.push(`报 ${card.poison.target}号 中毒${r(card.poison.reason)}`);
  card.claims?.forEach((c) =>
    lines.push(
      `${c.kind}${c.targets?.length ? ` ${c.targets.join('→')}号` : c.target ? ` ${c.target}号` : ''}${c.detail ? `：${c.detail}` : ''}`,
    ),
  );
  if (card.badgeFlow?.length) lines.push(`警徽流 ${card.badgeFlow.join('→')}`);
  card.stances?.forEach((s) =>
    lines.push(withTargets(s.type, s.targets, s.reason)),
  );
  card.suggestions?.forEach((s) =>
    lines.push(withTargets(s.type, s.targets, s.reason)),
  );
  if (card.notes) lines.push(`备注：${card.notes}`);
  return lines;
};

export const collectSpeeches = (state: GameState): SpeechEntry[] => {
  const out: SpeechEntry[] = [];
  forEachCard(state, ({ day, scene, speaker, card, round }) => {
    const lines = describeCard(card);
    if (lines.length > 0) out.push({ day, scene, round, speaker, lines });
  });
  return out.sort(compareChrono);
};

export const SCENE_LABELS: Record<MentionScene, string> = {
  sheriff: '警长竞选发言',
  sheriffPk: '警长PK',
  daytime: '白天发言',
  dayPk: '白天PK',
  firstNightDeath: '首夜死者遗言',
  exitSpeech: '出局遗言',
  candidacy: '上警',
  sheriffVote: '警长投票',
  dayVote: '放逐投票',
  pkVote: 'PK投票/结果',
  badge: '警徽',
  nightDeath: '夜晚死亡',
  dayDeath: '白天倒牌',
};
