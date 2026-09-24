import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import type { LogEntry } from '../../types/game';

interface Props {
  item: LogEntry;
}

export const TimelineEntry = ({ item }: Props) => {
  const { state, dispatch, showToast } = useGame();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item.content ?? '');

  if (item.type === 'divider') {
    return (
      <div className="my-3 flex items-center text-[10px] text-slate-400 select-none">
        <div className="flex-1 border-t border-slate-200"></div>
        <span className="px-2 font-bold">{item.title || '轮次分隔'}</span>
        <div className="flex-1 border-t border-slate-200"></div>
      </div>
    );
  }

  const isHighlight = item.player === state.currentPlayer;
  const cardClass = `relative rounded-lg border p-2.5 text-xs transition ${
    isHighlight
      ? 'border-indigo-200 bg-indigo-50/60'
      : 'border-slate-200 bg-white'
  }`;

  if (item.type === 'night_death') {
    return (
      <div className={cardClass}>
        <div className="mb-1 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1 font-bold text-indigo-700">
            夜间结算 · 第 {item.round} 天
          </span>
          <span>{item.time}</span>
        </div>
        <div className="font-medium text-slate-800">{item.content}</div>
      </div>
    );
  }

  if (item.type === 'police_registry') {
    return (
      <div className={cardClass}>
        <div className="mb-1 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1 font-bold text-sky-700">
            警长竞选格局 · 第 {item.round} 天
          </span>
          <span>{item.time}</span>
        </div>
        <div className="font-medium whitespace-pre-line text-slate-800">
          {item.content}
        </div>
      </div>
    );
  }

  if (item.type === 'vote_record') {
    return (
      <div className={cardClass}>
        <div className="mb-1 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1 font-bold text-amber-700">
            {item.sceneTitle} · 第 {item.round} 天
          </span>
          <span>{item.time}</span>
        </div>
        <div className="font-medium whitespace-pre-line text-slate-800">
          {item.content}
        </div>
      </div>
    );
  }

  // speech
  const handleSaveEdit = () => {
    const updated = draft.trim();
    if (updated) {
      dispatch({ type: 'UPDATE_LOG_CONTENT', id: item.id, content: updated });
      setEditing(false);
      showToast('修改已保存');
    }
  };

  const handleLoadEdit = () => {
    if (item.player) dispatch({ type: 'SELECT_PLAYER', num: item.player });
    dispatch({
      type: 'SET_SPEECH_CHIPS',
      chips: item.content ? [item.content] : [],
    });
    setEditing(false);
    showToast(`已载入 ${item.player}号 发言`);
  };

  return (
    <div className={cardClass}>
      <div className="mb-1 flex items-center justify-between text-[11px] text-slate-400">
        <div
          className="flex cursor-pointer items-center gap-1.5"
          onClick={() =>
            item.player && dispatch({ type: 'SELECT_PLAYER', num: item.player })
          }
        >
          <span className="rounded bg-indigo-100/70 px-1.5 font-bold text-indigo-600">
            {item.player}号
          </span>
          <span className="text-slate-500">第 {item.round} 天发言</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>{item.time}</span>
          <button
            title="修改此条记录"
            className="p-0.5 text-slate-400 hover:text-indigo-600"
            onClick={() => setEditing((v) => !v)}
          >
            改
          </button>
          <button
            title="删除此条"
            className="p-0.5 text-slate-400 hover:text-rose-600"
            onClick={() => dispatch({ type: 'DELETE_LOG', id: item.id })}
          >
            删
          </button>
        </div>
      </div>
      <div className="leading-relaxed font-normal whitespace-pre-wrap text-slate-800">
        {item.content}
      </div>

      {editing && (
        <div className="mt-2 border-t border-slate-200 pt-2">
          <textarea
            className="w-full rounded border border-slate-300 bg-white p-1.5 text-xs"
            rows={2}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <div className="mt-1 flex items-center justify-end gap-1.5">
            <button
              className="rounded px-2 py-0.5 text-[11px] text-slate-500 hover:bg-slate-100"
              onClick={() => setEditing(false)}
            >
              取消
            </button>
            <button
              className="rounded px-2 py-0.5 text-[11px] text-indigo-600 hover:bg-indigo-50"
              onClick={handleLoadEdit}
            >
              载入重拼
            </button>
            <button
              className="rounded bg-indigo-600 px-2.5 py-0.5 text-[11px] font-medium text-white"
              onClick={handleSaveEdit}
            >
              保存修改
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
