import { useState } from 'react';
import { NumberPicker } from './NumberPicker';
import type { NightDeathInfo } from '../../types/game';

interface Props {
  day: number;
  nightDeath: NightDeathInfo | undefined;
  disabled: number[];
  onSet: (info: NightDeathInfo) => void;
}

export const NightSection = ({ day, nightDeath, disabled, onSet }: Props) => {
  const [deaths, setDeaths] = useState<number[]>(
    nightDeath?.type === 'deaths' ? nightDeath.players : [],
  );

  return (
    <div
      data-stage="夜间"
      className="rounded-lg border border-slate-800 bg-slate-800/95 p-3"
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-300">
          第 {day} 天 · 夜间
        </span>
      </div>

      {nightDeath ? (
        <div
          className={`rounded border px-2.5 py-1.5 text-[11px] font-bold ${
            nightDeath.type === 'peace'
              ? 'border-emerald-600 bg-emerald-900/40 text-emerald-300'
              : 'border-rose-600 bg-rose-900/40 text-rose-300'
          }`}
        >
          {nightDeath.type === 'peace'
            ? '平安夜（无人出局）'
            : `倒牌：${nightDeath.players.map((n) => `${n}号`).join('、')}`}
          <button
            type="button"
            onClick={() => {
              setDeaths([]);
              onSet(nightDeath);
            }}
            className="ml-2 text-[10px] font-normal text-slate-400 hover:text-white"
          >
            （点击下方重新设置）
          </button>
        </div>
      ) : null}

      <div className="mt-2 space-y-1.5">
        <button
          type="button"
          onClick={() => onSet({ type: 'peace' })}
          className="w-full rounded bg-emerald-700 py-1 text-[11px] font-bold text-white hover:bg-emerald-600"
        >
          设为平安夜
        </button>
        <NumberPicker
          value={deaths}
          onChange={setDeaths}
          mode="multi"
          disabledPlayers={disabled}
        />
        <button
          type="button"
          disabled={deaths.length === 0}
          onClick={() => onSet({ type: 'deaths', players: deaths })}
          className="w-full rounded bg-rose-700 py-1 text-[11px] font-bold text-white hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          记录倒牌玩家
        </button>
      </div>
    </div>
  );
};
