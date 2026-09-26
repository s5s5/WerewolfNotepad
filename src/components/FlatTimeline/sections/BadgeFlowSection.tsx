import { PLAYER_COUNT } from '../../../constants/roles';
import type { SpeechCardData } from '../../../types/game';

interface Props {
  card: SpeechCardData;
  onPatch: (patch: Partial<SpeechCardData>) => void;
}

const MAX_BADGE_FLOW = 3;

export const BadgeFlowSection = ({ card, onPatch }: Props) => {
  const flow = card.badgeFlow || [];

  const toggle = (n: number) => {
    if (flow.includes(n)) {
      onPatch({ badgeFlow: flow.filter((v) => v !== n) });
    } else if (flow.length < MAX_BADGE_FLOW) {
      onPatch({ badgeFlow: [...flow, n] });
    }
  };

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-500">
          警徽流（按点击顺序，最多 {MAX_BADGE_FLOW} 个）
        </span>
        {flow.length > 0 && (
          <span className="text-[10px] font-bold text-indigo-600">
            {flow.map((n) => `${n}号`).join(' → ')}
          </span>
        )}
      </div>
      <div className="grid grid-cols-6 gap-1">
        {Array.from({ length: PLAYER_COUNT }, (_, i) => i + 1).map((n) => {
          const order = flow.indexOf(n);
          return (
            <button
              key={n}
              type="button"
              onClick={() => toggle(n)}
              className={`relative rounded border py-1 text-[10px] font-bold transition ${
                order > -1
                  ? 'border-amber-500 bg-amber-500 text-white'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-amber-300 hover:bg-amber-50'
              }`}
            >
              {n}
              {order > -1 && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-amber-800 text-[8px] text-white">
                  {order + 1}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
