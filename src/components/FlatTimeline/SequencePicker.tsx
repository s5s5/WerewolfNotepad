import { PLAYER_COUNT } from '../../constants/roles';

interface Props {
  value: number[];
  onChange: (next: number[]) => void;
  excludePlayer?: number;
}

export const SequencePicker = ({ value, onChange, excludePlayer }: Props) => (
  <div>
    <div className="mb-1 flex items-center justify-between text-[11px] text-slate-600">
      <span className="font-bold">
        {value.length > 0 ? value.join('→') : '依次点击号码（可重复）'}
      </span>
      <span className="flex gap-2">
        <button
          type="button"
          disabled={value.length === 0}
          onClick={() => onChange(value.slice(0, -1))}
          className="text-slate-500 hover:text-indigo-600 disabled:opacity-40"
        >
          撤销上一个
        </button>
        <button
          type="button"
          disabled={value.length === 0}
          onClick={() => onChange([])}
          className="text-slate-500 hover:text-rose-600 disabled:opacity-40"
        >
          清空
        </button>
      </span>
    </div>
    <div className="grid grid-cols-6 gap-1">
      {Array.from({ length: PLAYER_COUNT }, (_, i) => i + 1)
        .filter((n) => n !== excludePlayer)
        .map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange([...value, n])}
            className="rounded border border-slate-200 bg-white py-1 text-[10px] font-bold text-slate-600 hover:border-indigo-300 hover:bg-indigo-50"
          >
            {n}
          </button>
        ))}
    </div>
  </div>
);
