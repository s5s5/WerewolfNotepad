import { useEffect, useState } from 'react';
import { useGame } from '../../context/GameContext';
import { useModalActions } from '../../context/ModalContext';
import { PLAYER_COUNT } from '../../constants/roles';

export const NightDeathModal = () => {
  const { state, dispatch, showToast } = useGame();
  const { nightDeathOpen, closeNightDeathModal } = useModalActions();
  const [isPeace, setIsPeace] = useState(false);
  const [deaths, setDeaths] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (nightDeathOpen) {
      setIsPeace(false);
      setDeaths(new Set());
    }
  }, [nightDeathOpen]);

  if (!nightDeathOpen) return null;

  const toggleDeath = (i: number) => {
    setIsPeace(false);
    setDeaths((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const summaryText = isPeace
    ? '平安夜（无人员出局）'
    : deaths.size > 0
      ? `昨晚倒牌：${Array.from(deaths)
          .sort((a, b) => a - b)
          .map((n) => `${n}号`)
          .join('、')}`
      : '未选择死者';

  const summaryClass = isPeace
    ? 'font-bold text-emerald-600'
    : deaths.size > 0
      ? 'font-bold text-rose-600'
      : 'font-bold text-slate-400';

  const handleConfirm = () => {
    if (!isPeace && deaths.size === 0) {
      showToast('请选择倒牌玩家或点击平安夜');
      return;
    }

    const content = isPeace
      ? '昨晚是平安夜，全员存活'
      : `昨晚倒牌人员：${Array.from(deaths)
          .sort((a, b) => a - b)
          .map((n) => `${n}号`)
          .join('、')}`;

    dispatch({
      type: 'ADD_LOG',
      log: {
        id: `night_${Date.now()}`,
        type: 'night_death',
        round: state.currentRound,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        content,
      },
    });

    closeNightDeathModal();
    showToast('夜死信息已记录');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-3 backdrop-blur-xs">
      <div className="animate-in fade-in zoom-in w-full max-w-sm rounded-xl border border-slate-200 bg-white p-4 shadow-xl duration-100">
        <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-800">
              昨晚死者信息
            </span>
          </div>
          <button
            className="p-0.5 text-sm text-slate-400 hover:text-slate-600"
            onClick={closeNightDeathModal}
          >
            ×
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">
              快捷指定状态：
            </span>
            <button
              type="button"
              onClick={() => {
                setIsPeace(true);
                setDeaths(new Set());
              }}
              className="rounded bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800 transition hover:bg-emerald-200"
            >
              昨晚是平安夜
            </button>
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-bold text-slate-500">
              或选择倒牌玩家（可多选单死/双死）：
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {Array.from({ length: PLAYER_COUNT }, (_, idx) => idx + 1).map(
                (i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleDeath(i)}
                    className={`rounded-lg border py-2 text-xs font-bold transition ${
                      deaths.has(i)
                        ? 'border-rose-600 bg-rose-600 text-white shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-rose-50'
                    }`}
                  >
                    {i}号
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="rounded border border-slate-200 bg-slate-50 p-2 text-[11px] text-slate-600">
            结果记录：<span className={summaryClass}>{summaryText}</span>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-2">
            <button
              className="rounded px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100"
              onClick={closeNightDeathModal}
            >
              取消
            </button>
            <button
              className="rounded bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700"
              onClick={handleConfirm}
            >
              记录至流水
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
