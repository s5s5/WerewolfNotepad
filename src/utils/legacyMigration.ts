// 旧存档兼容迁移。确认没有旧存档后可整体删除本文件，并去掉 useGameState 中对 migrateDays 的调用。
import type { DayData, PkRoundData, SpeechCardData } from '../types/game';

const NOTE_STANCES = ['聊情绪', '快速过麦'];

const migrateCard = (card: SpeechCardData): SpeechCardData => {
  const { withdrew, ...rest } = card as SpeechCardData & {
    withdrew?: boolean;
  };
  const stances = rest.stances ?? [];
  const moved = stances.filter((s) => NOTE_STANCES.includes(s.type));
  const hasWithdrawStance = stances.some((s) => s.type === '退水');
  if (!withdrew && !hasWithdrawStance && moved.length === 0) return card;
  const claims = [...(rest.claims ?? [])];
  if (withdrew || hasWithdrawStance)
    claims.push({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      kind: '退水',
    });
  const notes = [
    rest.notes,
    ...moved.map((s) => s.type).filter((t) => !rest.notes?.includes(t)),
  ]
    .filter(Boolean)
    .join(' ');
  return {
    ...rest,
    stances: stances.filter(
      (s) => s.type !== '退水' && !NOTE_STANCES.includes(s.type),
    ),
    claims,
    notes: notes || undefined,
  };
};

const migrateCards = (
  m: Record<number, SpeechCardData> | undefined,
): Record<number, SpeechCardData> | undefined =>
  m &&
  Object.fromEntries(
    Object.entries(m).map(([k, c]) => [Number(k), migrateCard(c)]),
  );

const migratePk = (rounds: PkRoundData[] | undefined) =>
  rounds?.map((r) => ({ ...r, speeches: migrateCards(r.speeches) ?? {} }));

export const migrateDays = (
  days: Record<number, DayData>,
): Record<number, DayData> => {
  const out: Record<number, DayData> = {};
  Object.entries(days).forEach(([k, d]) => {
    const { firstNightDeathSpeech, exitSpeech, ...rest } = d;
    const next: DayData = { ...rest };
    if (firstNightDeathSpeech) {
      next.firstNightDeathSpeeches = {
        [firstNightDeathSpeech.player]: firstNightDeathSpeech.card,
        ...rest.firstNightDeathSpeeches,
      };
    }
    if (exitSpeech) {
      next.exitSpeeches = {
        [exitSpeech.player]: exitSpeech.card,
        ...rest.exitSpeeches,
      };
    }
    if (next.sheriff) {
      next.sheriff = {
        ...next.sheriff,
        speeches: migrateCards(next.sheriff.speeches) ?? {},
        pkRounds: migratePk(next.sheriff.pkRounds),
      };
    }
    if (next.daytime) {
      next.daytime = {
        ...next.daytime,
        speeches: migrateCards(next.daytime.speeches) ?? {},
      };
    }
    next.pkRounds = migratePk(next.pkRounds);
    next.firstNightDeathSpeeches = migrateCards(next.firstNightDeathSpeeches);
    next.exitSpeeches = migrateCards(next.exitSpeeches);
    out[Number(k)] = next;
  });
  return out;
};
