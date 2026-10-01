import { memo } from 'react';
import { useGame } from '../../context/GameContext';
import type { PkScope, SpeechCardData, SpeechPhase } from '../../types/game';
import { InfoActionSection } from './sections/InfoActionSection';
import { ClaimedIdentitySection } from './sections/ClaimedIdentitySection';
import { StanceSection } from './sections/StanceSection';
import { SuggestionSection } from './sections/SuggestionSection';
import { NotesSection } from './sections/NotesSection';
import { PlayerStatusSection } from './sections/PlayerStatusSection';

interface PlayerSpeechCardProps {
  day: number;
  phase: SpeechPhase;
  playerNum: number;
  card: SpeechCardData;
  pk?: { scope: PkScope; roundIndex: number };
}

const summarize = (card: SpeechCardData): string | null => {
  const parts: string[] = [];
  if (card.seerCheck)
    parts.push(`验${card.seerCheck.target}号${card.seerCheck.result}`);
  if (card.silverWater) parts.push(`报${card.silverWater.target}号银水`);
  if (card.poison) parts.push(`报${card.poison.target}号中毒`);
  if (card.claimedIdentity?.length) parts.push(card.claimedIdentity.join('/'));
  if (card.badgeFlow?.length) parts.push(`警徽流:${card.badgeFlow.join('→')}`);
  card.claims?.forEach((c) =>
    parts.push(
      `${c.kind}${c.targets?.length ? c.targets.join('→') + '号' : c.target ? c.target + '号' : ''}${c.detail ? ':' + c.detail : ''}`,
    ),
  );
  if (card.stances?.length) parts.push(`${card.stances.length}条立场`);
  if (card.suggestions?.length) parts.push(`${card.suggestions.length}条建议`);
  if (card.notes) parts.push(card.notes);
  return parts.length > 0 ? parts.join(' · ') : null;
};

export const PlayerSpeechCard = memo(
  ({ day, phase, playerNum, card, pk }: PlayerSpeechCardProps) => {
    const { dispatch, state } = useGame();
    const isMe = String(playerNum) === String(state.mySeat);
    const isSelected = state.currentPlayer === playerNum;

    const onPatch = (patch: Partial<SpeechCardData>) => {
      if (pk) {
        dispatch({
          type: 'UPDATE_PK_SPEECH',
          day,
          scope: pk.scope,
          roundIndex: pk.roundIndex,
          player: playerNum,
          patch,
        });
        return;
      }
      dispatch({
        type: 'UPDATE_SPEECH_CARD',
        day,
        phase,
        player: playerNum,
        patch,
      });
    };

    const summary = summarize(card);
    const hasContent = summary !== null;

    return (
      <div
        data-speaker={playerNum}
        onClick={() => dispatch({ type: 'SELECT_PLAYER', num: playerNum })}
        className={`rounded-lg border bg-white shadow-2xs ${
          isSelected
            ? 'border-indigo-500 ring-2 ring-indigo-400'
            : isMe
              ? 'border-amber-300 ring-1 ring-amber-300'
              : 'border-slate-200'
        }`}
      >
        <div className="flex w-full items-center justify-between gap-2 px-2.5 py-1.5 text-left">
          <div className="flex min-w-0 items-center gap-1.5">
            <span
              className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                isMe
                  ? 'bg-amber-500 text-white'
                  : 'bg-indigo-100 text-indigo-700'
              }`}
            >
              {playerNum}
            </span>
            <span
              className={`truncate text-[11px] ${
                hasContent ? 'text-slate-600' : 'text-slate-400 italic'
              }`}
            >
              {summary ?? '暂无记录'}
            </span>
          </div>
        </div>

        <div className="space-y-2.5 border-t border-slate-100 px-2.5 py-2.5">
          <InfoActionSection
            playerNum={playerNum}
            card={card}
            onPatch={onPatch}
          />
          <ClaimedIdentitySection card={card} onPatch={onPatch} />
          <StanceSection playerNum={playerNum} card={card} onPatch={onPatch} />
          <SuggestionSection
            playerNum={playerNum}
            card={card}
            onPatch={onPatch}
          />
          <NotesSection card={card} onPatch={onPatch} />
          <PlayerStatusSection playerNum={playerNum} />
        </div>
      </div>
    );
  },
);

PlayerSpeechCard.displayName = 'PlayerSpeechCard';
