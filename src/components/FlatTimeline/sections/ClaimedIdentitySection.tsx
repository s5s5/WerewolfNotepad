import { CLAIMED_IDENTITY_OPTIONS } from '../../../constants/cardOptions';
import type { SpeechCardData } from '../../../types/game';

interface Props {
  card: SpeechCardData;
  onPatch: (patch: Partial<SpeechCardData>) => void;
}

export const ClaimedIdentitySection = ({ card, onPatch }: Props) => {
  const claimed = card.claimedIdentity || [];

  const toggle = (label: string) => {
    onPatch({
      claimedIdentity: claimed.includes(label)
        ? claimed.filter((c) => c !== label)
        : [...claimed, label],
    });
  };

  return (
    <div>
      <span className="mb-1 block text-[10px] font-bold text-slate-500">
        声称身份
      </span>
      <div className="flex flex-wrap gap-1">
        {CLAIMED_IDENTITY_OPTIONS.map((opt) => (
          <button
            key={opt.label}
            type="button"
            onClick={() => toggle(opt.label)}
            className={`rounded border px-2 py-0.5 text-[11px] transition ${opt.className} ${
              claimed.includes(opt.label) ? 'ring-2 ring-offset-1' : 'opacity-70'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};
