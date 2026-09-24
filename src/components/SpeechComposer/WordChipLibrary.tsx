import { useGame } from '../../context/GameContext';
import { useModalActions } from '../../context/ModalContext';
import { PLAYER_COUNT } from '../../constants/roles';
import {
  GOD_SKILL_PICKER_CHIPS,
  GOD_SKILL_WORD_CHIPS,
  JUDGE_IDENTITY_CHIPS,
  LOGIC_COMMENT_CHIPS,
  PUNCTUATION_CHIPS,
  SEER_POLICE_PICKER_CHIPS,
  SEER_POLICE_WORD_CHIPS,
  SELF_CLAIM_CHIPS,
  STANCE_CHIPS,
  type PickerWordChip,
  type WordChip,
} from '../../constants/speechChips';

const WordChipButton = ({ chip }: { chip: WordChip }) => {
  const { dispatch } = useGame();
  return (
    <button
      type="button"
      onClick={() => dispatch({ type: 'ADD_SPEECH_CHIP', text: chip.label })}
      className={`rounded border px-2 py-0.5 ${chip.className}`}
    >
      {chip.label}
    </button>
  );
};

const PickerWordButton = ({ chip }: { chip: PickerWordChip }) => {
  const { openPlayerPicker } = useModalActions();
  return (
    <button
      type="button"
      onClick={() =>
        openPlayerPicker({
          word: chip.label,
          order: chip.order,
          mode: chip.mode,
        })
      }
      className={`rounded border px-2 py-0.5 ${chip.className}`}
    >
      {chip.label}
    </button>
  );
};

export const WordChipLibrary = () => {
  const { dispatch } = useGame();
  const { openSeerCheckModal } = useModalActions();

  return (
    <div className="space-y-2 border-t border-slate-100 pt-2 text-xs">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="w-12 flex-shrink-0 text-[11px] font-bold text-slate-400">
          标点号码:
        </span>
        {PUNCTUATION_CHIPS.map((chip) => (
          <WordChipButton key={chip.label} chip={chip} />
        ))}
        <span className="text-slate-200">|</span>
        <div className="flex flex-wrap gap-1">
          {Array.from({ length: PLAYER_COUNT }, (_, idx) => idx + 1).map(
            (i) => (
              <button
                key={i}
                type="button"
                onClick={() =>
                  dispatch({ type: 'ADD_SPEECH_CHIP', text: `${i}号` })
                }
                className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-xs font-semibold text-slate-700 hover:bg-slate-200"
              >
                {i}号
              </button>
            ),
          )}
        </div>
      </div>

      <div className="flex items-start gap-1.5">
        <span className="w-12 flex-shrink-0 pt-0.5 text-[11px] font-bold text-purple-700">
          自报身份:
        </span>
        <div className="flex flex-wrap gap-1">
          {SELF_CLAIM_CHIPS.map((chip) => (
            <WordChipButton key={chip.label} chip={chip} />
          ))}
        </div>
      </div>

      <div className="flex items-start gap-1.5">
        <span className="w-12 flex-shrink-0 pt-0.5 text-[11px] font-bold text-emerald-700">
          判定身份:
        </span>
        <div className="flex flex-wrap gap-1">
          {JUDGE_IDENTITY_CHIPS.map((chip) => (
            <PickerWordButton key={chip.label} chip={chip} />
          ))}
        </div>
      </div>

      <div className="flex items-start gap-1.5">
        <span className="w-12 flex-shrink-0 pt-0.5 text-[11px] font-bold text-sky-700">
          站边交互:
        </span>
        <div className="flex flex-wrap gap-1">
          {STANCE_CHIPS.map((chip) => (
            <PickerWordButton key={chip.label} chip={chip} />
          ))}
        </div>
      </div>

      <div className="flex items-start gap-1.5">
        <span className="w-12 flex-shrink-0 pt-0.5 text-[11px] font-bold text-amber-700">
          预言家/警徽:
        </span>
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={openSeerCheckModal}
            className="flex items-center gap-0.5 rounded bg-amber-500 px-2 py-0.5 font-bold text-white shadow-2xs hover:bg-amber-600"
          >
            快捷报验人
          </button>
          {SEER_POLICE_PICKER_CHIPS.map((chip) => (
            <PickerWordButton key={chip.label} chip={chip} />
          ))}
          {SEER_POLICE_WORD_CHIPS.map((chip) => (
            <WordChipButton key={chip.label} chip={chip} />
          ))}
        </div>
      </div>

      <div className="flex items-start gap-1.5">
        <span className="w-12 flex-shrink-0 pt-0.5 text-[11px] font-bold text-teal-700">
          神职技能:
        </span>
        <div className="flex flex-wrap gap-1">
          {GOD_SKILL_PICKER_CHIPS.map((chip) => (
            <PickerWordButton key={chip.label} chip={chip} />
          ))}
          {GOD_SKILL_WORD_CHIPS.map((chip) => (
            <WordChipButton key={chip.label} chip={chip} />
          ))}
        </div>
      </div>

      <div className="flex items-start gap-1.5">
        <span className="w-12 flex-shrink-0 pt-0.5 text-[11px] font-bold text-slate-400">
          逻辑短评:
        </span>
        <div className="flex flex-wrap gap-1">
          {LOGIC_COMMENT_CHIPS.map((chip) => (
            <WordChipButton key={chip.label} chip={chip} />
          ))}
        </div>
      </div>
    </div>
  );
};
