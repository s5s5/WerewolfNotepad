import { useState } from 'react';
import { NumberPicker } from './NumberPicker';

interface Props {
  day: number;
  dayDeaths: number[] | undefined;
  excluded: number[];
  onSet: (players: number[]) => void;
}

export const DayDeathSection = ({ day, dayDeaths, excluded, onSet }: Props) => {
  const [picked, setPicked] = useState<number[]>(dayDeaths ?? []);
  const selectable = picked.filter((p) => !excluded.includes(p));

  return (
    <div
      data-stage="白天倒牌"
      className="space-y-1.5 rounded-lg border border-slate-200 bg-white p-2.5"
    >
      <span className="block text-[11px] font-bold text-slate-700">
        第 {day} 天 · 白天倒牌
      </span>
      {dayDeaths && dayDeaths.length > 0 && (
        <div className="rounded border border-rose-300 bg-rose-50 px-2.5 py-1.5 text-[11px] font-bold text-rose-700">
          倒牌：{dayDeaths.map((n) => `${n}号`).join('、')}
        </div>
      )}
      <NumberPicker
        value={picked}
        onChange={setPicked}
        mode="multi"
        disabledPlayers={excluded}
      />
      <button
        type="button"
        onClick={() => onSet(selectable)}
        className="w-full rounded bg-rose-700 py-1 text-[11px] font-bold text-white hover:bg-rose-600"
      >
        记录白天倒牌
      </button>
    </div>
  );
};
