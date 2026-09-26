import { useState } from 'react';
import {
  SUGGESTION_OPTIONS,
  type ActionOption,
} from '../../../constants/cardOptions';
import { NumberPicker } from '../NumberPicker';
import { ReasonPicker } from '../ReasonPicker';
import type { SpeechCardData, SuggestionAction } from '../../../types/game';

interface Props {
  playerNum: number;
  card: SpeechCardData;
  onPatch: (patch: Partial<SpeechCardData>) => void;
}

export const SuggestionSection = ({ playerNum, card, onPatch }: Props) => {
  const suggestions = card.suggestions || [];
  const [pendingOpt, setPendingOpt] = useState<ActionOption | null>(null);
  const [pendingTargets, setPendingTargets] = useState<number[]>([]);
  const [pendingReason, setPendingReason] = useState('');

  const removeSuggestion = (idx: number) => {
    onPatch({ suggestions: suggestions.filter((_, i) => i !== idx) });
  };

  const selectOption = (opt: ActionOption) => {
    if (!opt.needsTarget) {
      onPatch({ suggestions: [...suggestions, { type: opt.label }] });
      return;
    }
    setPendingOpt(opt);
    setPendingTargets([]);
    setPendingReason('');
  };

  const confirmTargeted = () => {
    if (!pendingOpt || pendingTargets.length === 0) return;
    onPatch({
      suggestions: [
        ...suggestions,
        {
          type: pendingOpt.label,
          targets: pendingTargets,
          reason: pendingReason.trim() || undefined,
        },
      ],
    });
    setPendingOpt(null);
    setPendingTargets([]);
    setPendingReason('');
  };

  const describe = (s: SuggestionAction) => {
    const base =
      s.targets && s.targets.length > 0
        ? `${s.type} ${s.targets.map((t) => `${t}号`).join('、')}`
        : s.type;
    return s.reason ? `${base}（${s.reason}）` : base;
  };

  return (
    <div>
      <span className="mb-1 block text-[10px] font-bold text-slate-500">
        建议与动作
      </span>

      {suggestions.length > 0 && (
        <div className="mb-1.5 flex flex-wrap gap-1">
          {suggestions.map((s, idx) => (
            <span
              key={idx}
              onClick={() => removeSuggestion(idx)}
              title="点击移除"
              className="cursor-pointer rounded-full border border-orange-300 bg-orange-50 px-2 py-0.5 text-[11px] font-medium text-orange-800 hover:bg-orange-100"
            >
              {describe(s)} ×
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-1">
        {SUGGESTION_OPTIONS.map((opt) => (
          <button
            key={opt.label}
            type="button"
            onClick={() => selectOption(opt)}
            className={`rounded border px-2 py-0.5 text-[11px] ${opt.className}`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {pendingOpt && (
        <div className="mt-1.5 rounded border border-slate-200 bg-slate-50 p-1.5">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500">
              {pendingOpt.label} · 选择目标
            </span>
            <button
              type="button"
              className="text-[10px] text-slate-400 hover:text-rose-600"
              onClick={() => setPendingOpt(null)}
            >
              取消
            </button>
          </div>
          <NumberPicker
            value={pendingTargets}
            onChange={setPendingTargets}
            mode={pendingOpt.targetMode || 'single'}
            excludePlayer={playerNum}
          />
          <ReasonPicker value={pendingReason} onChange={setPendingReason} />
          <button
            type="button"
            disabled={pendingTargets.length === 0}
            onClick={confirmTargeted}
            className="mt-1.5 w-full rounded bg-indigo-600 py-1 text-[11px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            确认添加
          </button>
        </div>
      )}
    </div>
  );
};
