import { useState } from 'react';
import { COMMON_PHRASES } from '../../../constants/cardOptions';
import type { SpeechCardData } from '../../../types/game';

interface Props {
  card: SpeechCardData;
  onPatch: (patch: Partial<SpeechCardData>) => void;
}

export const NotesSection = ({ card, onPatch }: Props) => {
  const [value, setValue] = useState(card.notes || '');

  const addPhrase = (phrase: string) => {
    if (value.includes(phrase)) return;
    const sep = value && !/[；;]\s*$/.test(value) ? '；' : '';
    const next = `${value}${sep}${phrase}；`;
    setValue(next);
    onPatch({ notes: next });
  };

  return (
    <div>
      <span className="mb-1 block text-[10px] font-bold text-slate-500">
        自定义备注
      </span>
      <div className="mb-1 flex flex-wrap gap-1">
        {COMMON_PHRASES.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => addPhrase(p)}
            className="rounded border border-slate-300 bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700 hover:bg-slate-200"
          >
            {p}
          </button>
        ))}
      </div>
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
