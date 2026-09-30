import { useState } from 'react';
import { NumberPicker } from './NumberPicker';
import type { VoteRecord } from '../../types/game';

interface Props {
  title: string;
  eligibleTargets?: number[];
  eligibleVoters?: number[];
  records: VoteRecord[];
  onChange: (records: VoteRecord[]) => void;
}

export const VoteSection = ({
  title,
  eligibleTargets,
  eligibleVoters,
  records,
  onChange,
}: Props) => {
  const [target, setTarget] = useState<number[]>([]);
  const [voters, setVoters] = useState<number[]>([]);

  const addGroup = () => {
    if (target.length === 0 || voters.length === 0) return;
    const t = target[0];
    const existingIdx = records.findIndex((r) => r.target === t);
    const next =
      existingIdx > -1
        ? records.map((r, i) => (i === existingIdx ? { target: t, voters } : r))
        : [...records, { target: t, voters }];
    onChange(next);
    setTarget([]);
    setVoters([]);
  };

  const removeGroup = (t: number) => {
    onChange(records.filter((r) => r.target !== t));
  };

  return (
    <div
      data-stage={title}
      className="rounded-lg border border-slate-200 bg-white p-2.5"
    >
      <span className="mb-1.5 block text-[11px] font-bold text-slate-600">
        {title}
      </span>

      <div className="space-y-1.5">
        <div>
          <span className="mb-1 block text-[10px] font-medium text-slate-400">
            被投人
          </span>
          <NumberPicker
            value={target}
            onChange={setTarget}
            mode="single"
            excludePlayer={undefined}
          />
          {eligibleTargets && (
            <p className="mt-0.5 text-[9px] text-slate-400">
              可投目标：
              {eligibleTargets.map((n) => `${n}号`).join('、') || '无'}
            </p>
          )}
        </div>
        <div>
          <span className="mb-1 block text-[10px] font-medium text-slate-400">
            投票人（可多选）
          </span>
          <NumberPicker value={voters} onChange={setVoters} mode="multi" />
          {eligibleVoters && (
            <p className="mt-0.5 text-[9px] text-slate-400">
              有票玩家：{eligibleVoters.map((n) => `${n}号`).join('、') || '无'}
            </p>
          )}
        </div>
        <button
          type="button"
          disabled={target.length === 0 || voters.length === 0}
          onClick={addGroup}
          className="w-full rounded bg-amber-500 py-1 text-[11px] font-bold text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          + 添加本组得票
        </button>
      </div>

      <div className="mt-2 space-y-1">
        {records.length === 0 ? (
          <span className="text-[10px] text-slate-400 italic">暂无票型</span>
        ) : (
          records.map((r) => (
            <div
              key={r.target}
              className="flex items-center justify-between rounded border border-slate-200 bg-slate-50 px-2 py-1 text-[11px]"
            >
              <span>
                <span className="font-bold text-amber-700">{r.target}号</span> (
                {r.voters.length}票): {r.voters.map((n) => `${n}号`).join('、')}
              </span>
              <button
                type="button"
                onClick={() => removeGroup(r.target)}
                className="text-slate-400 hover:text-rose-600"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
