import { useGame } from '../../context/GameContext';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const ResetConfirmModal = ({ open, onClose }: Props) => {
  const { dispatch, showToast } = useGame();

  if (!open) return null;

  const handleExecuteReset = () => {
    dispatch({ type: 'RESET_ALL' });
    onClose();
    showToast('全场对局已清空重置');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-3 backdrop-blur-xs">
      <div className="animate-in fade-in zoom-in w-full max-w-xs rounded-xl border border-slate-200 bg-white p-4 text-center shadow-2xl duration-100">
        <div className="mx-auto mb-2.5 flex h-11 w-11 items-center justify-center rounded-full bg-rose-100 text-xl font-bold text-rose-600">
          !
        </div>
        <h3 className="mb-1 text-sm font-bold text-slate-800">
          清空全场对局？
        </h3>
        <p className="mb-4 text-xs leading-relaxed text-slate-500">
          将清空所有玩家发言、席位标记、死者与票型记录，轮次回到第 1 天。
        </p>
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={onClose}
            className="w-1/2 rounded-lg bg-slate-100 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-200"
          >
            取消
          </button>
          <button
            onClick={handleExecuteReset}
            className="w-1/2 rounded-lg bg-rose-600 py-1.5 text-xs font-bold text-white shadow-xs transition hover:bg-rose-700"
          >
            确认清空
          </button>
        </div>
      </div>
    </div>
  );
};
