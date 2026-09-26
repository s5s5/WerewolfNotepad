import { useState } from 'react';
import type { DayData } from '../../types/game';

interface Props {
  exitSpeech: DayData['exitSpeech'];
  candidatePlayer?: number;
  onSet: (player: number, notes: string) => void;
}

export const ExitSpeechSection = ({
  exitSpeech,
  candidatePlayer,
  onSet,
}: Props) => {
  const [notes, setNotes] = useState(exitSpeech?.notes || '');

  const player = exitSpeech?.player ?? candidatePlayer;
  if (!player) return null;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-2.5">
      <span className="mb-1.5 block text-[11px] font-bold text-slate-600">
        {player}号 出局遗言
      </span>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        onBlur={() => onSet(player, notes)}
        rows={2}
        placeholder="记录遗言要点"
        className="w-full rounded border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
      />
    </div>
  );
};
