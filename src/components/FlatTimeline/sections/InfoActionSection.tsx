import { useState } from 'react';
import { INFO_ACTION_OPTIONS, type ActionOption } from '../../../constants/cardOptions';
import { NumberPicker } from '../NumberPicker';
import { ReasonPicker } from '../ReasonPicker';
import type { SpeechCardData } from '../../../types/game';

interface Props {
  playerNum: number;
  card: SpeechCardData;
  onPatch: (patch: Partial<SpeechCardData>) => void;
}

const MAX_BADGE_FLOW = 3;

export const InfoActionSection = ({ playerNum, card, onPatch }: Props) => {
  const [pendingOpt, setPendingOpt] = useState<ActionOption | null>(null);
  const [pendingTargets, setPendingTargets] = useState<number[]>([]);
  const [pendingReason, setPendingReason] = useState('');

  const openPicker = (opt: ActionOption) => {
    setPendingOpt(opt);
    setPendingTargets([]);
    setPendingReason('');
  };

  const handlePickerChange = (next: number[]) => {
    if (pendingOpt?.targetMode !== 'multi') {
      setPendingTargets(next);
      return;
    }
    if (next.length > pendingTargets.length) {
      const added = next.find((n) => !pendingTargets.includes(n));
      if (added !== undefined && pendingTargets.length < MAX_BADGE_FLOW) {
        setPendingTargets([...pendingTargets, added]);
      }
    } else {
      setPendingTargets(pendingTargets.filter((n) => next.includes(n)));
    }
  };

  const confirmTargeted = () => {
    if (!pendingOpt || pendingTargets.length === 0) return;
    const reason = pendingReason.trim() || undefined;
    switch (pendingOpt.label) {
      case '查杀':
      case '金水':
        onPatch({
          seerCheck: { target: pendingTargets[0], result: pendingOpt.label, reason },
        });
        break;
      case '毒':
        onPatch({ poison: { target: pendingTargets[0], reason } });
        break;
      case '银水':
        onPatch({ silverWater: { target: pendingTargets[0], reason } });
        break;
      case '警徽流':
        onPatch({ badgeFlow: pendingTargets });
        break;
    }
    setPendingOpt(null);
    setPendingTargets([]);
    setPendingReason('');
  };

  const chips: { key: string; label: string; onRemove: () => void }[] = [];
  if (card.seerCheck) {
    chips.push({
      key: 'seerCheck',
      label: `${card.seerCheck.target}号 · ${card.seerCheck.result}${
        card.seerCheck.reason ? `（${card.seerCheck.reason}）` : ''
      }`,
      onRemove: () => onPatch({ seerCheck: undefined }),
    });
  }
  if (card.poison) {
    chips.push({
      key: 'poison',
      label: `${card.poison.target}号 · 毒${card.poison.reason ? `（${card.poison.reason}）` : ''}`,
      onRemove: () => onPatch({ poison: undefined }),
    });
  }
  if (card.silverWater) {
    chips.push({
      key: 'silverWater',
      label: `${card.silverWater.target}号 · 银水${
        card.silverWater.reason ? `（${card.silverWater.reason}）` : ''
      }`,
      onRemove: () => onPatch({ silverWater: undefined }),
    });
  }
  if (card.badgeFlow?.length) {
    chips.push({
      key: 'badgeFlow',
      label: `警徽流:${card.badgeFlow.join('→')}`,
      onRemove: () => onPatch({ badgeFlow: undefined }),
    });
  }

  return (
    <div>
      <span className="mb-1 block text-[10px] font-bold text-slate-500">
        信息
      </span>

      {chips.length > 0 && (
        <div className="mb-1.5 flex flex-wrap gap-1">
          {chips.map((c) => (
            <span
              key={c.key}
              onClick={c.onRemove}
              title="点击移除"
              className="cursor-pointer rounded-full border border-indigo-300 bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-800 hover:bg-indigo-100"
            >
              {c.label} ×
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-1">
        {INFO_ACTION_OPTIONS.map((opt) => (
          <button
            key={opt.label}
            type="button"
            onClick={() => openPicker(opt)}
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
              {pendingOpt.targetMode === 'multi'
                ? `（按点击顺序，最多 ${MAX_BADGE_FLOW} 个）`
                : '（单选）'}
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
            onChange={handlePickerChange}
            mode={pendingOpt.targetMode || 'single'}
            excludePlayer={playerNum}
          />
          {pendingOpt.label !== '警徽流' && (
            <ReasonPicker value={pendingReason} onChange={setPendingReason} />
          )}
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
