import { useEffect, useState } from 'react';
import { useGame } from '../../context/GameContext';
import { useModalActions } from '../../context/ModalContext';
import { PLAYER_COUNT } from '../../constants/roles';

export const PlayerPickerModal = () => {
  const { dispatch, showToast } = useGame();
  const { pickerConfig, closePlayerPicker } = useModalActions();
  const [selected, setSelected] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (pickerConfig) setSelected(new Set());
  }, [pickerConfig]);

  if (!pickerConfig) return null;

  const { word, order, mode, title, hint } = pickerConfig;

  const toggle = (i: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (mode === 'single') {
        if (next.has(i)) {
          next.clear();
        } else {
          next.clear();
          next.add(i);
        }
      } else {
        if (next.has(i)) next.delete(i);
        else next.add(i);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelected((prev) => {
      if (prev.size === PLAYER_COUNT) return new Set();
      return new Set(Array.from({ length: PLAYER_COUNT }, (_, idx) => idx + 1));
    });
  };

  const handleConfirm = () => {
    if (selected.size === 0) {
      showToast('请至少选择一个号码');
      return;
    }
    const sorted = Array.from(selected).sort((a, b) => a - b);
    const numbersStr = sorted.map((n) => `${n}号`).join('、');
    const resultChip =
      order === 'num-first' ? `${numbersStr} ${word}` : `${word} ${numbersStr}`;
    dispatch({ type: 'ADD_SPEECH_CHIP', text: resultChip });
    closePlayerPicker();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-3 backdrop-blur-xs">
      <div className="animate-in fade-in zoom-in w-full max-w-xs rounded-xl border border-slate-200 bg-white p-3.5 shadow-xl duration-100">
        <div className="mb-2.5 flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
            <span className="text-xs font-bold text-slate-700">
              {title || `选择作用玩家：${word}`}
            </span>
          </div>
          <button
            className="p-0.5 text-sm text-slate-400 hover:text-slate-600"
            onClick={closePlayerPicker}
          >
            ×
          </button>
        </div>

        <div className="mb-2 flex items-center justify-between text-[11px] text-slate-500">
          <span>
            {hint ||
              (mode === 'single'
                ? '点选号码，核对后点击下方确认'
                : '可多选号码，点击确认后添加')}
          </span>
          <span className="font-bold text-indigo-600">
            已选 {selected.size} 个
          </span>
        </div>

        <div className="mb-3 grid grid-cols-4 gap-1.5">
          {Array.from({ length: PLAYER_COUNT }, (_, idx) => idx + 1).map(
            (i) => (
              <button
                key={i}
                type="button"
                onClick={() => toggle(i)}
                className={`rounded-lg border py-2 text-xs font-bold transition ${
                  selected.has(i)
                    ? 'border-indigo-600 bg-indigo-600 text-white shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-indigo-50'
                }`}
              >
                {i}号
              </button>
            ),
          )}
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-2">
          <button
            type="button"
            onClick={toggleSelectAll}
            className={`text-[11px] font-medium text-indigo-600 hover:text-indigo-800 ${
              mode === 'single' ? 'hidden' : 'inline-block'
            }`}
          >
            全选/清空
          </button>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={closePlayerPicker}
              className="rounded px-2.5 py-1 text-xs text-slate-500 hover:bg-slate-100"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="rounded bg-indigo-600 px-3 py-1 text-xs font-semibold text-white shadow-xs transition hover:bg-indigo-700"
            >
              确认添加
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
