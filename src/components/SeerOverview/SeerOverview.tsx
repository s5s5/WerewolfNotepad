import { useMemo, useState } from 'react';
import { useGame } from '../../context/GameContext';
import { collectAllMentions, SCENE_LABELS } from '../../utils/mentions';
import { collectSeerClaims } from '../../utils/seer';
import { SeerBadge } from '../common/SeerBadge';

export const SeerOverview = () => {
  const { state } = useGame();
  const [open, setOpen] = useState(true);
  const claims = useMemo(() => collectSeerClaims(state), [state]);
  const mentions = useMemo(() => collectAllMentions(state), [state]);

  if (claims.length === 0) return null;

  const supporters = (target: number, actions: string[]) => {
    const set = new Set<number>();
    mentions.forEach((m) => {
      if (
        m.target === target &&
        m.speaker !== undefined &&
        m.speaker !== target &&
        actions.some((a) => m.action.startsWith(a))
      )
        set.add(m.speaker);
    });
    return [...set].sort((a, b) => a - b);
  };

  return (
    <div className="rounded-lg border border-rose-300 bg-rose-50/50 p-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-[11px] font-bold text-rose-700"
      >
        <span>预言家对跳（{claims.length}）</span>
        <span>{open ? '▾' : '▸'}</span>
      </button>
      {open && (
        <div className="mt-1.5 space-y-1.5">
          {claims.map((c) => {
            const stand = supporters(c.player, ['站边']);
            const step = supporters(c.player, ['踩']);
            return (
              <div
                key={c.player}
                className="rounded border border-rose-200 bg-white p-1.5"
              >
                <div className="text-[11px] font-bold text-slate-800">
                  {c.player}号
                  <SeerBadge player={c.player} />
                  <span className="ml-1 text-[10px] font-normal text-slate-400">
                    第{c.firstDay}天 · {SCENE_LABELS[c.firstScene]}起跳
                  </span>
                </div>
                <ul className="mt-0.5 space-y-0.5 text-[10.5px]">
                  {c.checks.length === 0 && (
                    <li className="text-slate-300">暂无验人</li>
                  )}
                  {c.checks.map((k, i) => (
                    <li key={i} className="text-slate-600">
                      第{k.day}天 验 {k.target}号{' '}
                      <span
                        className={`font-semibold ${
                          k.result === '金水'
                            ? 'text-emerald-600'
                            : 'text-orange-600'
                        }`}
                      >
                        {k.result}
                      </span>
                      {k.reason && (
                        <span className="text-slate-400">（{k.reason}）</span>
                      )}
                    </li>
                  ))}
                </ul>
                {c.badgeFlow && (
                  <div className="text-[10.5px] text-slate-600">
                    警徽流 {c.badgeFlow.join('→')}
                  </div>
                )}
                <div className="text-[10.5px] text-slate-600">
                  <span className="font-semibold text-emerald-600">站边：</span>
                  {stand.length ? stand.map((n) => `${n}号`).join('、') : '无'}
                  <span className="ml-2 font-semibold text-orange-600">
                    踩：
                  </span>
                  {step.length ? step.map((n) => `${n}号`).join('、') : '无'}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
