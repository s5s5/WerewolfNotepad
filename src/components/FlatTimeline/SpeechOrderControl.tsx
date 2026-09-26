import { useState } from 'react';
import { NumberPicker } from './NumberPicker';
import type { SpeechOrderConfig } from '../../types/game';

interface Props {
  order: SpeechOrderConfig | undefined;
  onSet: (order: SpeechOrderConfig) => void;
  eligiblePlayers?: number[];
}

export const SpeechOrderControl = ({ order, onSet, eligiblePlayers }: Props) => {
  const [firstSpeaker, setFirstSpeaker] = useState<number[]>(
    order ? [order.firstSpeaker] : [],
  );
  const [direction, setDirection] = useState<'正序' | '逆序'>(
    order?.direction || '正序',
  );
  const [source, setSource] = useState<'系统决定' | '警长决定'>(
    order?.source || '系统决定',
  );

  const confirm = () => {
    if (firstSpeaker.length === 0) return;
    onSet({ firstSpeaker: firstSpeaker[0], direction, source });
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-2">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-600">发言顺序</span>
        {order && (
          <span className="text-[11px] font-bold text-indigo-700">
            {order.firstSpeaker}号起 · {order.direction} · {order.source}
          </span>
        )}
      </div>
      <div className="space-y-1.5">
        <NumberPicker
          value={firstSpeaker}
          onChange={setFirstSpeaker}
          mode="single"
        />
        <div className="flex gap-1.5">
          {(['正序', '逆序'] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDirection(d)}
              className={`rounded border px-2 py-0.5 text-[11px] font-medium ${
                direction === d
                  ? 'border-indigo-600 bg-indigo-600 text-white'
                  : 'border-slate-200 bg-white text-slate-600'
              }`}
            >
              {d}
            </button>
          ))}
          {(['系统决定', '警长决定'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSource(s)}
              className={`rounded border px-2 py-0.5 text-[11px] font-medium ${
                source === s
                  ? 'border-amber-500 bg-amber-500 text-white'
                  : 'border-slate-200 bg-white text-slate-600'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <button
          type="button"
          disabled={firstSpeaker.length === 0}
          onClick={confirm}
          className="w-full rounded bg-indigo-600 py-1 text-[11px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          确定顺序
        </button>
      </div>
      {eligiblePlayers && eligiblePlayers.length === 0 && (
        <p className="mt-1 text-[10px] text-slate-400">暂无可发言玩家</p>
      )}
    </div>
  );
};
