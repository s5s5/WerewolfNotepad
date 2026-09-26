import type { SpeechCardData, SpeechPhase } from '../../../types/game';

interface Props {
  phase: SpeechPhase;
  card: SpeechCardData;
  onPatch: (patch: Partial<SpeechCardData>) => void;
}

export const WithdrawSection = ({ phase, card, onPatch }: Props) => {
  const disabled = phase !== 'sheriff';

  return (
    <label
      className={`flex items-center gap-1.5 text-[11px] font-medium ${
        disabled ? 'cursor-not-allowed text-slate-300' : 'cursor-pointer text-slate-600'
      }`}
    >
      <input
        type="checkbox"
        disabled={disabled}
        checked={!!card.withdrew}
        onChange={(e) => onPatch({ withdrew: e.target.checked })}
        className="rounded border-slate-300 text-indigo-600 focus:ring-0 disabled:opacity-40"
      />
      <span>退水{disabled ? '（仅警选可用）' : ''}</span>
    </label>
  );
};
