import { useState } from 'react';
import { COMMON_REASONS } from '../../constants/cardOptions';

interface ReasonPickerProps {
  value: string;
  onChange: (next: string) => void;
}

export const ReasonPicker = ({ value, onChange }: ReasonPickerProps) => {
  const [customInput, setCustomInput] = useState(value);

  const toggleReason = (reason: string) => {
    onChange(value === reason ? '' : reason);
    setCustomInput(value === reason ? '' : reason);
  };

  return (
    <div className="mt-1.5">
      <span className="mb-1 block text-[10px] font-bold text-slate-500">
        原因（可选）
      </span>
      <div className="mb-1 flex flex-wrap gap-1">
        {COMMON_REASONS.map((reason) => (
          <button
            key={reason}
            type="button"
            onClick={() => toggleReason(reason)}
            className={`rounded border px-1.5 py-0.5 text-[10px] ${
              value === reason
                ? 'border-indigo-600 bg-indigo-600 text-white'
                : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:bg-indigo-50'
            }`}
          >
            {reason}
          </button>
        ))}
      </div>
      <input
        type="text"
        value={customInput}
        onChange={(e) => {
          setCustomInput(e.target.value);
          onChange(e.target.value);
        }}
        placeholder="自行输入原因"
        className="w-full rounded border border-slate-200 px-1.5 py-1 text-[11px] text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none"
      />
    </div>
  );
};
