import { memo, useState } from 'react';
import { useGame } from '../../context/GameContext';
import type { SpeechCardData, SpeechPhase } from '../../types/game';
import { SeerInfoSection } from './sections/SeerInfoSection';
import { ClaimedIdentitySection } from './sections/ClaimedIdentitySection';
import { BadgeFlowSection } from './sections/BadgeFlowSection';
import { WithdrawSection } from './sections/WithdrawSection';
import { StanceSection } from './sections/StanceSection';
import { SuggestionSection } from './sections/SuggestionSection';
import { NotesSection } from './sections/NotesSection';
import { PlayerStatusSection } from './sections/PlayerStatusSection';

interface PlayerSpeechCardProps {
  day: number;
  phase: SpeechPhase;
  playerNum: number;
  card: SpeechCardData;
}

const summarize = (card: SpeechCardData): string => {
  const parts: string[] = [];
  if (card.seerCheck) parts.push(`验${card.seerCheck.target}号${card.seerCheck.result}`);
  if (card.silverWater) parts.push(`报${card.silverWater.target}号银水`);
  if (card.claimedIdentity?.length) parts.push(card.claimedIdentity.join('/'));
  if (card.badgeFlow?.length) parts.push(`警徽流:${card.badgeFlow.join('→')}`);
  if (card.withdrew) parts.push('已退水');
  if (card.stances?.length) parts.push(`${card.stances.length}条立场`);
  if (card.suggestions?.length) parts.push(`${card.suggestions.length}条建议`);
  if (card.notes) parts.push(card.notes);
  return parts.length > 0 ? parts.join(' · ') : '暂无记录，点击展开填写';
};

export const PlayerSpeechCard = memo(
  ({ day, phase, playerNum, card }: PlayerSpeechCardProps) => {
    const { dispatch, state } = useGame();
    const [expanded, setExpanded] = useState(false);
    const isMe = String(playerNum) === String(state.mySeat);

    const onPatch = (patch: Partial<SpeechCardData>) => {
      dispatch({ type: 'UPDATE_SPEECH_CARD', day, phase, player: playerNum, patch });
    };

    const hasContent =
      !!card.seerCheck ||
      !!card.silverWater ||
      (card.claimedIdentity?.length ?? 0) > 0 ||
      (card.badgeFlow?.length ?? 0) > 0 ||
      !!card.withdrew ||
      (card.stances?.length ?? 0) > 0 ||
      (card.suggestions?.length ?? 0) > 0 ||
      !!card.notes;

    return (
      <div
        className={`rounded-lg border bg-white shadow-2xs ${
          isMe ? 'border-amber-300 ring-1 ring-amber-300' : 'border-slate-200'
        }`}
      >
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex w-full items-center justify-between gap-2 px-2.5 py-1.5 text-left"
        >
          <div className="flex min-w-0 items-center gap-1.5">
            <span
              className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                isMe ? 'bg-amber-500 text-white' : 'bg-indigo-100 text-indigo-700'
              }`}
            >
              {playerNum}
            </span>
            <span
              className={`truncate text-[11px] ${
                hasContent ? 'text-slate-600' : 'italic text-slate-400'
              }`}
            >
              {summarize(card)}
            </span>
          </div>
          <span className="flex-shrink-0 text-[10px] text-slate-400">
            {expanded ? '收起' : '展开'}
          </span>
        </button>

        {expanded && (
          <div className="space-y-2.5 border-t border-slate-100 px-2.5 py-2.5">
            <SeerInfoSection playerNum={playerNum} card={card} onPatch={onPatch} />
            <ClaimedIdentitySection card={card} onPatch={onPatch} />
            <BadgeFlowSection card={card} onPatch={onPatch} />
            <WithdrawSection phase={phase} card={card} onPatch={onPatch} />
            <StanceSection playerNum={playerNum} card={card} onPatch={onPatch} />
            <SuggestionSection playerNum={playerNum} card={card} onPatch={onPatch} />
            <NotesSection card={card} onPatch={onPatch} />
            <PlayerStatusSection playerNum={playerNum} />
          </div>
        )}
      </div>
    );
  },
);

PlayerSpeechCard.displayName = 'PlayerSpeechCard';
