import { useLayoutEffect, useState } from 'react';
import { useGame } from '../../context/GameContext';
import { usePosition } from '../../utils/position';

interface NavSpeaker {
  num: number;
  el: Element;
}
interface NavStage {
  label: string;
  stage: string;
  el: Element;
  speakers: NavSpeaker[];
}
interface NavDay {
  day: number;
  label: string;
  el: Element;
  stages: NavStage[];
}

const scan = (root: HTMLElement): NavDay[] =>
  Array.from(root.querySelectorAll('[data-day]')).map((dayEl) => ({
    day: Number(dayEl.getAttribute('data-day')),
    label: dayEl.getAttribute('data-nav-label') ?? '',
    el: dayEl,
    stages: Array.from(dayEl.querySelectorAll('[data-nav]')).map((stageEl) => ({
      stage: stageEl.getAttribute('data-stage') ?? '',
      label:
        stageEl.getAttribute('data-nav-label') ??
        stageEl.getAttribute('data-stage') ??
        '',
      el: stageEl,
      speakers: Array.from(stageEl.querySelectorAll('[data-speaker]'))
        .filter((s) => s.closest('[data-nav]') === stageEl)
        .map((s) => ({ num: Number(s.getAttribute('data-speaker')), el: s })),
    })),
  }));

const jump = (el: Element) =>
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });

export const TimelineNav = () => {
  const { state, dispatch } = useGame();
  const position = usePosition();
  const [days, setDays] = useState<NavDay[]>([]);
  const [collapsed, setCollapsed] = useState<Set<number>>(new Set());

  // 每次 state 变化后 DOM 已提交，重新扫描锚点
  useLayoutEffect(() => {
    const root = document.getElementById('timeline-scroll');
    if (root) setDays(scan(root));
  }, [state]);

  const toggle = (day: number) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (!next.delete(day)) next.add(day);
      return next;
    });

  return (
    <nav className="hidden w-36 flex-shrink-0 overflow-y-auto border-r border-slate-200 bg-slate-50/60 py-2 text-[11px] md:block">
      {days.map((d) => {
        const open = !collapsed.has(d.day);
        const dayActive = position.day === d.day;
        return (
          <div key={d.day} className="mb-1">
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => toggle(d.day)}
                className="px-1.5 text-slate-400 hover:text-slate-600"
                title={open ? '折叠' : '展开'}
              >
                {open ? '▾' : '▸'}
              </button>
              <button
                type="button"
                onClick={() => jump(d.el)}
                className={`flex-1 truncate py-0.5 text-left font-bold ${
                  dayActive ? 'text-indigo-700' : 'text-slate-700'
                }`}
              >
                {d.label}
              </button>
            </div>
            {open &&
              d.stages.map((s, i) => {
                const active = dayActive && position.stage === s.stage;
                return (
                  <div key={i} className="pl-5">
                    <button
                      type="button"
                      onClick={() => jump(s.el)}
                      className={`block w-full truncate rounded py-0.5 pr-1 text-left ${
                        active
                          ? 'bg-indigo-100 font-bold text-indigo-700'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {s.label}
                    </button>
                    {s.speakers.length > 0 && (
                      <div className="flex flex-wrap gap-1 py-0.5 pl-1">
                        {s.speakers.map((sp, j) => {
                          const isMe = String(sp.num) === String(state.mySeat);
                          return (
                            <button
                              key={j}
                              type="button"
                              onClick={() => {
                                jump(sp.el);
                                dispatch({
                                  type: 'SELECT_PLAYER',
                                  num: sp.num,
                                });
                              }}
                              className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${
                                isMe
                                  ? 'bg-amber-500 text-white'
                                  : 'bg-indigo-100 text-indigo-700'
                              } ${state.currentPlayer === sp.num ? 'ring-2 ring-indigo-400' : ''}`}
                            >
                              {sp.num}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        );
      })}
    </nav>
  );
};
