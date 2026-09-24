import { useGame } from '../../context/GameContext';

export const ChipDisplay = () => {
  const { state, dispatch } = useGame();

  return (
    <div className="flex min-h-[46px] flex-wrap items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 p-2">
      {state.currentSpeechChips.length === 0 ? (
        <span className="text-xs text-slate-400">
          点击下方词块开始组合发言内容...
        </span>
      ) : (
        state.currentSpeechChips.map((chip, index) => (
          <span
            key={`${chip}-${index}`}
            title="点击移除此词块"
            onClick={() => dispatch({ type: 'REMOVE_SPEECH_CHIP', index })}
            className="badge-chip flex cursor-pointer items-center gap-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-800 shadow-2xs hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
          >
            <span>{chip}</span>
            <span className="text-xs text-slate-400">×</span>
          </span>
        ))
      )}
    </div>
  );
};
