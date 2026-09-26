import { useState } from 'react';
import type { SpeechCardData } from '../../../types/game';

interface Props {
  card: SpeechCardData;
  onPatch: (patch: Partial<SpeechCardData>) => void;
}

export const NotesSection = ({ card, onPatch }: Props) => {
  const [value, setValue] = useState(card.notes || '');

  return (
    <div>
      <span className="mb-1 block text-[10px] font-bold text-slate-500">
        自定义备注
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => onPatch({ notes: value })}
        placeholder="自由文字补充，不参与自动统计"
        className="w-full rounded border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
      />
    </div>
  );
};
