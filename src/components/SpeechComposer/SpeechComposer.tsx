import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { ChipDisplay } from './ChipDisplay';
import { WordChipLibrary } from './WordChipLibrary';

export const SpeechComposer = () => {
  const { state, dispatch, showToast } = useGame();
  const [customText, setCustomText] = useState('');

  const handleSave = () => {
    const trimmed = customText.trim();
    if (state.currentSpeechChips.length === 0 && !trimmed) {
      showToast('请先拼入词块或输入内容');
      return;
    }

    const speechContent = [...state.currentSpeechChips];
    if (trimmed) speechContent.push(`(${trimmed})`);

    dispatch({ type: 'SAVE_SPEECH', content: speechContent.join(' ') });
    setCustomText('');
    showToast(`已保存 ${state.currentPlayer}号 发言`);
  };

  return (
    <div className="flex flex-col space-y-2.5 rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
          <span className="text-xs font-bold text-slate-700">
            模块二：发言记录拼词
          </span>
          <span className="text-[11px] text-slate-400">
            词块点选即入，点击词块可快速删除
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => dispatch({ type: 'CLEAR_SPEECH_CHIPS' })}
            className="rounded px-1.5 py-0.5 text-xs text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            清空已选
          </button>
        </div>
      </div>

      <ChipDisplay />

      <div className="relative">
        <input
          type="text"
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          onKeyDown={(e) => {
            if (e.ctrlKey && e.key === 'Enter') {
              e.preventDefault();
              handleSave();
            }
          }}
          placeholder="自由文字补充（可手打特殊昵称、细节或破绽，可不填）"
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
        />
      </div>

      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1">
          <button
            onClick={() => dispatch({ type: 'PREV_PLAYER' })}
            className="rounded border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs text-slate-700 transition hover:bg-slate-200"
          >
            上一位
          </button>
          <button
            onClick={() => dispatch({ type: 'NEXT_PLAYER' })}
            className="rounded border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs text-slate-700 transition hover:bg-slate-200"
          >
            下一位
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden text-[10px] text-slate-400 sm:inline">
            Ctrl + Enter 保存
          </span>
          <button
            onClick={handleSave}
            className="flex items-center gap-1 rounded-lg bg-indigo-600 px-4 py-1 text-xs font-semibold text-white shadow-xs transition hover:bg-indigo-700"
          >
            <span>保存发言</span>
          </button>
        </div>
      </div>

      <WordChipLibrary />
    </div>
  );
};
