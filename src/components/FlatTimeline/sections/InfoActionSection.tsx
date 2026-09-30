import { useState } from 'react';
import type { ClaimActionConfig } from '../../../constants/boards';
import { useBoard } from '../../../hooks/useBoard';
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
  const board = useBoard();
  const [pendingDetail, setPendingDetail] = useState('');
  const [pendingOpt, setPendingOpt] = useState<ClaimActionConfig | null>(null);
  const [pendingTargets, setPendingTargets] = useState<number[]>([]);
  const [pendingReason, setPendingReason] = useState('');

  const openPicker = (opt: ClaimActionConfig) => {
    setPendingOpt(opt);
    setPendingTargets([]);
    setPendingReason('');
    setPendingDetail('');
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
    if (pendingOpt.details && !pendingDetail) return;
    const reason = pendingReason.trim() || undefined;
    switch (pendingOpt.type) {
      case 'seerCheck':
        onPatch({
          seerCheck: {
            target: pendingTargets[0],
            result: pendingOpt.label as '查杀' | '金水',
            reason,
          },
        });
        break;
      case 'claim':
        onPatch({
          claims: [
            ...(card.claims ?? []),
            {
              id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              kind: pendingOpt.label,
              target: pendingTargets[0],
              detail: pendingDetail || undefined,
            },
          ],
        });
        break;
      case 'poison':
        onPatch({ poison: { target: pendingTargets[0], reason } });
        break;
      case 'silverWater':
        onPatch({ silverWater: { target: pendingTargets[0], reason } });
        break;
      case 'badgeFlow':
        onPatch({ badgeFlow: pendingTargets });
        break;
    }
    setPendingOpt(null);
    setPendingTargets([]);
    setPendingReason('');
    setPendingDetail('');
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

  card.claims?.forEach((c) => {
    chips.push({
      key: c.id,
      label: `${c.kind}${c.target ? `:${c.target}号` : ''}${c.detail ? ` · ${c.detail}` : ''}`,
      onRemove: () =>
        onPatch({
          claims: card.claims?.filter((x) => x.id !== c.id),
        }),
    });
  });

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
        {board.claimActions.map((opt) => (
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
          {pendingOpt.details && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {pendingOpt.details.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setPendingDetail(d)}
                  className={`rounded border px-2 py-0.5 text-[11px] ${
                    pendingDetail === d
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : 'border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          )}
          {pendingOpt.type !== 'badgeFlow' && pendingOpt.type !== 'claim' && (
            <ReasonPicker value={pendingReason} onChange={setPendingReason} />
          )}
          <button
            type="button"
            disabled={
              pendingTargets.length === 0 ||
              (!!pendingOpt.details && !pendingDetail)
            }
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
