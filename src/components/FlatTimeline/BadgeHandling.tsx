import { useState } from 'react';
import { NumberPicker } from './NumberPicker';
import type { DayData } from '../../types/game';

interface Props {
  badgeAction: DayData['badgeAction'];
  onSet: (action: '移交' | '撕警徽', transferTo?: number) => void;
}

export const BadgeHandling = ({ badgeAction, onSet }: Props) => {
  const [transferTo, setTransferTo] = useState<number[]>(
    badgeAction?.transferTo ? [badgeAction.transferTo] : [],
  );

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-2.5">
      <span className="mb-1.5 block text-[11px] font-bold text-amber-800">
        警徽处理
      </span>
      {badgeAction && (
        <p className="mb-1.5 text-[11px] font-bold text-amber-700">
          当前：{badgeAction.action}
          {badgeAction.transferTo ? ` → ${badgeAction.transferTo}号` : ''}
        </p>
      )}
      <div className="space-y-1.5">
        <NumberPicker
          value={transferTo}
          onChange={setTransferTo}
          mode="single"
        />
        <div className="flex gap-1.5">
          <button
            type="button"
            disabled={transferTo.length === 0}
            onClick={() => onSet('移交', transferTo[0])}
            className="flex-1 rounded bg-amber-500 py-1 text-[11px] font-bold text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            移交警徽
          </button>
          <button
            type="button"
            onClick={() => onSet('撕警徽')}
            className="flex-1 rounded bg-rose-600 py-1 text-[11px] font-bold text-white hover:bg-rose-700"
          >
            撕警徽
          </button>
        </div>
      </div>
    </div>
  );
};
