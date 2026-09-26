import { useMemo } from 'react';
import { useGame } from '../../context/GameContext';
import { PLAYER_COUNT } from '../../constants/roles';
import { collectAllMentions, SCENE_LABELS } from '../../utils/mentions';

export const MentionsPanel = () => {
  const { state } = useGame();

  const grouped = useMemo(() => {
    const mentions = collectAllMentions(state);
    const map = new Map<number, typeof mentions>();
    mentions.forEach((m) => {
      const list = map.get(m.target) || [];
      list.push(m);
      map.set(m.target, list);
    });
    map.forEach((list) =>
      list.sort((a, b) => a.day - b.day || (a.round || 0) - (b.round || 0)),
    );
    return map;
  }, [state]);

  return (
    <aside className="fixed top-14 right-2 z-30 hidden max-h-[calc(100vh-4.5rem)] w-64 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white/95 shadow-lg backdrop-blur-sm lg:flex">
      <div className="border-b border-slate-200 px-3 py-2">
        <h3 className="text-xs font-bold text-slate-700">被提及记录</h3>
      </div>
      <div className="flex-1 space-y-2.5 overflow-y-auto p-2.5">
        {Array.from({ length: PLAYER_COUNT }, (_, i) => i + 1).map((num) => {
          const mentions = grouped.get(num);
          if (!mentions || mentions.length === 0) return null;
          return (
            <div key={num} className="rounded-lg border border-slate-200 p-2">
              <span className="mb-1 block text-[11px] font-bold text-slate-800">
                {num}号
              </span>
              <ul className="space-y-1">
                {mentions.map((m, idx) => (
                  <li
                    key={idx}
                    className="text-[10.5px] leading-relaxed text-slate-600"
                  >
                    第{m.day}天 · {SCENE_LABELS[m.scene]}
                    {m.round ? ` 第${m.round}轮` : ''}
                    {m.speaker ? ` · ${m.speaker}号` : ''}：
                    <span className="font-semibold text-slate-800">
                      {m.action}
                    </span>
                    {m.reason && (
                      <span className="text-slate-400">（{m.reason}）</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
        {grouped.size === 0 && (
          <p className="py-6 text-center text-[11px] text-slate-400">
            暂无被提及记录
          </p>
        )}
      </div>
    </aside>
  );
};
