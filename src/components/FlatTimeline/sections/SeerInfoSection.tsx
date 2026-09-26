import { useState } from 'react';
import { NumberPicker } from '../NumberPicker';
import { SEER_RESULT_OPTIONS } from '../../../constants/cardOptions';
import type { SpeechCardData } from '../../../types/game';

interface Props {
  playerNum: number;
  card: SpeechCardData;
  onPatch: (patch: Partial<SpeechCardData>) => void;
}

export const SeerInfoSection = ({ playerNum, card, onPatch }: Props) => {
  const [pendingTarget, setPendingTarget] = useState<number[]>([]);
  const [silverTarget, setSilverTarget] = useState<number[]>([]);

  return (
    <div className="space-y-2">
      <div>
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-500">验人</span>
          {card.seerCheck && (
            <button
              type="button"
              className="text-[10px] text-slate-400 hover:text-rose-600"
              onClick={() => onPatch({ seerCheck: undefined })}
            >
              清除
            </button>
          )}
        </div>
        {card.seerCheck ? (
          <span
            className={`inline-block rounded border px-2 py-0.5 text-[11px] font-bold ${
              card.seerCheck.result === '金水'
                ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                : 'border-rose-300 bg-rose-50 text-rose-700'
            }`}
          >
            {card.seerCheck.target}号 · {card.seerCheck.result}
          </span>
        ) : (
          <div className="space-y-1.5">
            <NumberPicker
              value={pendingTarget}
              onChange={setPendingTarget}
              mode="single"
              excludePlayer={playerNum}
            />
            <div className="flex gap-1.5">
              {SEER_RESULT_OPTIONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  disabled={pendingTarget.length === 0}
                  onClick={() => {
                    onPatch({
                      seerCheck: { target: pendingTarget[0], result: r },
                    });
                    setPendingTarget([]);
                  }}
                  className={`rounded border px-2 py-0.5 text-[11px] font-bold disabled:cursor-not-allowed disabled:opacity-40 ${
                    r === '金水'
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      : 'border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100'
                  }`}
                >
                  报{r}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-500">银水</span>
          {card.silverWater && (
            <button
              type="button"
              className="text-[10px] text-slate-400 hover:text-rose-600"
              onClick={() => onPatch({ silverWater: undefined })}
            >
              清除
            </button>
          )}
        </div>
        {card.silverWater ? (
          <span className="inline-block rounded border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
            {card.silverWater.target}号 · 银水
          </span>
        ) : (
          <div className="space-y-1.5">
            <NumberPicker
              value={silverTarget}
              onChange={setSilverTarget}
              mode="single"
              excludePlayer={playerNum}
            />
            <button
              type="button"
              disabled={silverTarget.length === 0}
              onClick={() => {
                onPatch({ silverWater: { target: silverTarget[0] } });
                setSilverTarget([]);
              }}
              className="rounded border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              报银水
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
