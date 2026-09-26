import type {
  GameState,
  MentionScene,
  PlayerMention,
  SpeechCardData,
} from '../types/game';

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
  card.badgeFlow?.forEach((target) => push(target, '警徽流'));
  card.stances?.forEach((s) =>
    s.targets?.forEach((target) => push(target, s.type, s.reason)),
  );
  card.suggestions?.forEach((s) =>
    s.targets?.forEach((target) => push(target, s.type, s.reason)),
  );
  if (card.withdrew) push(speaker, '退水');
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

export const collectAllMentions = (state: GameState): PlayerMention[] => {
  const mentions: PlayerMention[] = [];

  Object.entries(state.days).forEach(([dayStr, dayData]) => {
    const day = Number(dayStr);

    if (dayData.firstNightDeathSpeech) {
      const { player, card } = dayData.firstNightDeathSpeech;
      collectFromCard(
        day,
        'firstNightDeath',
        player,
        card,
        undefined,
        mentions,
      );
    }

    if (dayData.nightDeath?.type === 'deaths') {
      dayData.nightDeath.players.forEach((target) => {
        mentions.push({ day, scene: 'nightDeath', target, action: '夜晚死亡' });
      });
    }

    if (dayData.sheriff) {
      dayData.sheriff.candidates.forEach((target) => {
        mentions.push({ day, scene: 'candidacy', target, action: '上警' });
      });
      Object.entries(dayData.sheriff.speeches).forEach(([speaker, card]) => {
        collectFromCard(
          day,
          'sheriff',
          Number(speaker),
          card,
          undefined,
          mentions,
        );
      });
      collectVotes(
        day,
        'sheriffVote',
        dayData.sheriff.voteRecords,
        undefined,
        mentions,
      );
      dayData.sheriff.pkRounds?.forEach((round, idx) => {
        Object.entries(round.speeches).forEach(([speaker, card]) => {
          collectFromCard(
            day,
            'sheriffPk',
            Number(speaker),
            card,
            idx + 1,
            mentions,
          );
        });
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
        action: '警徽移交',
      });
    }

    Object.entries(dayData.daytime.speeches).forEach(([speaker, card]) => {
      collectFromCard(
        day,
        'daytime',
        Number(speaker),
        card,
        undefined,
        mentions,
      );
    });

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
      Object.entries(round.speeches).forEach(([speaker, card]) => {
        collectFromCard(day, 'dayPk', Number(speaker), card, idx + 1, mentions);
      });
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

    if (dayData.exitSpeech) {
      const { player, card } = dayData.exitSpeech;
      collectFromCard(day, 'exitSpeech', player, card, undefined, mentions);
    }
  });

  return mentions;
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
};
