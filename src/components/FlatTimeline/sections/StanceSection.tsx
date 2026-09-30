import { useState } from 'react';
import {
  STANCE_OPTIONS,
  type ActionOption,
} from '../../../constants/cardOptions';
import { NumberPicker } from '../NumberPicker';
import { ReasonPicker, cleanReason } from '../ReasonPicker';
import type { SpeechCardData, StanceAction } from '../../../types/game';

interface Props {
  playerNum: number;
  card: SpeechCardData;
  onPatch: (patch: Partial<SpeechCardData>) => void;
}

const isCustom = (opt: ActionOption) => opt.label === '自定义';

export const StanceSection = ({ playerNum, card, onPatch }: Props) => {
  const stances = card.stances || [];
  const [pendingOpt, setPendingOpt] = useState<ActionOption | null>(null);
  const [pendingTargets, setPendingTargets] = useState<number[]>([]);
  const [pendingReason, setPendingReason] = useState('');

  const removeStance = (idx: number) => {
    onPatch({ stances: stances.filter((_, i) => i !== idx) });
  };

  const selectOption = (opt: ActionOption) => {
    if (!opt.needsTarget) {
      onPatch({ stances: [...stances, { type: opt.label }] });
      return;
    }
    setPendingOpt(opt);
    setPendingTargets([]);
    setPendingReason('');
  };

  const confirmDisabled =
    !pendingOpt ||
    pendingTargets.length === 0 ||
    (isCustom(pendingOpt) && !cleanReason(pendingReason));

  const confirmTargeted = () => {
    if (!pendingOpt || confirmDisabled) return;
    if (isCustom(pendingOpt)) {
      onPatch({
        stances: [
          ...stances,
          { type: cleanReason(pendingReason), targets: pendingTargets },
        ],
      });
    } else {
      onPatch({
        stances: [
          ...stances,
          {
            type: pendingOpt.label,
            targets: pendingTargets,
            reason: cleanReason(pendingReason) || undefined,
          },
        ],
      });
    }
    setPendingOpt(null);
    setPendingTargets([]);
    setPendingReason('');
  };

  const describe = (s: StanceAction) => {
    const base =
      s.targets && s.targets.length > 0
        ? `${s.type} ${s.targets.map((t) => `${t}号`).join('、')}`
        : s.type;
    return s.reason ? `${base}（${s.reason}）` : base;
  };

  return (
    <div>
      <span className="mb-1 block text-[10px] font-bold text-slate-500">
        立场
      </span>

      {stances.length > 0 && (
        <div className="mb-1.5 flex flex-wrap gap-1">
          {stances.map((s, idx) => (
            <span
              key={idx}
              onClick={() => removeStance(idx)}
              title="点击移除"
              className="cursor-pointer rounded-full border border-sky-300 bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-800 hover:bg-sky-100"
            >
              {describe(s)} ×
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-1">
        {STANCE_OPTIONS.map((opt) => (
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
              {pendingOpt.label} · 选择目标（
              {pendingOpt.targetMode === 'multi' ? '可多选' : '单选'}）
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
            disabled={confirmDisabled}
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
