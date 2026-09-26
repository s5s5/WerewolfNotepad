import { PLAYER_COUNT } from '../../constants/roles';

interface NumberPickerProps {
  value: number[];
  onChange: (next: number[]) => void;
  mode: 'single' | 'multi';
  excludePlayer?: number;
  size?: 'xs' | 'sm';
}

export const NumberPicker = ({
  value,
  onChange,
  mode,
  excludePlayer,
  size = 'xs',
}: NumberPickerProps) => {
  const toggle = (n: number) => {
    if (mode === 'single') {
      onChange(value.includes(n) ? [] : [n]);
      return;
    }
    onChange(
      value.includes(n) ? value.filter((v) => v !== n) : [...value, n].sort((a, b) => a - b),
    );
  };

  const btnSize = size === 'xs' ? 'py-1 text-[10px]' : 'py-1.5 text-xs';

  return (
    <div className="grid grid-cols-6 gap-1">
      {Array.from({ length: PLAYER_COUNT }, (_, i) => i + 1)
        .filter((n) => n !== excludePlayer)
        .map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => toggle(n)}
            className={`rounded border font-bold transition ${btnSize} ${
              value.includes(n)
                ? 'border-indigo-600 bg-indigo-600 text-white'
                : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:bg-indigo-50'
            }`}
          >
            {n}
          </button>
        ))}
    </div>
  );
};
