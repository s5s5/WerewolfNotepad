import { useState } from 'react';
import { NumberPicker } from './NumberPicker';
import type { SpeechOrderConfig } from '../../types/game';

interface Props {
  order: SpeechOrderConfig | undefined;
  onSet: (order: SpeechOrderConfig) => void;
  eligiblePlayers?: number[];
  sheriff?: number;
  disabledPlayers?: number[];
  dimmedPlayers?: number[];
  onPick?: (player: number) => void;
}

export const SpeechOrderControl = ({
  order,
  onSet,
  eligiblePlayers,
  sheriff,
  disabledPlayers,
  dimmedPlayers,
  onPick,
}: Props) => {
  const [firstSpeaker, setFirstSpeaker] = useState<number[]>(
    order ? [order.firstSpeaker] : [],
  );
  const [direction, setDirection] = useState<'正序' | '逆序'>(
    order?.direction || '正序',
  );
  const [source, setSource] = useState<'系统决定' | '警长决定'>(
    order?.source || '系统决定',
  );

  const sheriffMode = !!sheriff && source === '警长决定';

  const apply = (
    first: number[],
    dir: '正序' | '逆序',
    src: '系统决定' | '警长决定',
  ) => {
    if (!!sheriff && src === '警长决定') {
      onSet({ firstSpeaker: sheriff, direction: dir, source: src });
    } else if (first.length > 0) {
      onSet({ firstSpeaker: first[0], direction: dir, source: src });
    }
  };

  const pickFirst = (next: number[]) => {
    setFirstSpeaker(next);
    if (next.length > 0) onPick?.(next[0]);
    apply(next, direction, source);
  };

  const changeDirection = (d: '正序' | '逆序') => {
    setDirection(d);
    apply(firstSpeaker, d, source);
  };

  const changeSource = (src: '系统决定' | '警长决定') => {
    setSource(src);
    apply(firstSpeaker, direction, src);
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-2">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-600">发言顺序</span>
        {order && (
          <span className="text-[11px] font-bold text-indigo-700">
            {order.source === '警长决定' && sheriff
              ? `警长${sheriff}号殿后`
              : `${order.firstSpeaker}号起`}
            {` · ${order.direction} · ${order.source}`}
          </span>
        )}
      </div>
      <div className="space-y-1.5">
        {sheriffMode ? (
          <p className="text-[11px] font-bold text-amber-700">
            警长{sheriff}号殿后
          </p>
        ) : (
          <NumberPicker
            value={firstSpeaker}
            onChange={pickFirst}
            mode="single"
            disabledPlayers={disabledPlayers}
            dimmedPlayers={dimmedPlayers}
          />
        )}
        <div className="flex gap-1.5">
          {(['正序', '逆序'] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => changeDirection(d)}
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
              onClick={() => changeSource(s)}
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
      </div>
      {eligiblePlayers && eligiblePlayers.length === 0 && (
        <p className="mt-1 text-[10px] text-slate-400">暂无可发言玩家</p>
      )}
    </div>
  );
};
