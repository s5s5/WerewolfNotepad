import { useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { TimelineEntry } from './TimelineEntry';

export const Timeline = () => {
  const { state, dispatch } = useGame();
  const containerRef = useRef<HTMLDivElement>(null);
  const prevLogCount = useRef(state.logs.length);

  const displayList = state.filterCurrentPlayerOnly
    ? state.logs.filter(
        (l) => l.type === 'divider' || l.player === state.currentPlayer,
      )
    : state.logs;

  useEffect(() => {
    if (state.logs.length > prevLogCount.current && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
    prevLogCount.current = state.logs.length;
  }, [state.logs]);

  return (
    <section className="z-10 flex h-[40%] w-full flex-shrink-0 flex-col border-r border-slate-200 bg-slate-50 md:h-full md:w-[420px] lg:w-[480px]">
      <div className="flex flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white px-3.5 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">
            局势与发言流水
          </span>
          <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
            {displayList.length} 条
          </span>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex cursor-pointer items-center gap-1 text-[11px] text-slate-500 select-none">
            <input
              type="checkbox"
              checked={state.filterCurrentPlayerOnly}
              onChange={(e) =>
                dispatch({
                  type: 'SET_FILTER_CURRENT_PLAYER',
                  value: e.target.checked,
                })
              }
              className="rounded border-slate-300 text-indigo-600 focus:ring-0"
            />
            <span>只看当前玩家</span>
          </label>
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex-1 space-y-2.5 overflow-y-auto p-3"
      >
        {displayList.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            暂无对局记录，请在右侧选择玩家并记录发言或状态
          </div>
        ) : (
          displayList.map((item) => <TimelineEntry key={item.id} item={item} />)
        )}
      </div>
    </section>
  );
};
