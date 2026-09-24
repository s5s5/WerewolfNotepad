import { useEffect, useState } from 'react';
import { useGame } from '../../context/GameContext';
import { useModalActions } from '../../context/ModalContext';
import { PLAYER_COUNT } from '../../constants/roles';

const NIGHT_OPTIONS = [
  { val: '昨晚验了', label: '昨晚' },
  { val: '第1晚验了', label: '第1晚' },
  { val: '第2晚验了', label: '第2晚' },
  { val: '第3晚验了', label: '第3晚' },
];

export const SeerCheckModal = () => {
  const { dispatch, showToast } = useGame();
  const { seerCheckOpen, closeSeerCheckModal } = useModalActions();
  const [night, setNight] = useState('昨晚验了');
  const [target, setTarget] = useState<number | null>(null);
  const [result, setResult] = useState<'是金水' | '是查杀'>('是金水');

  useEffect(() => {
    if (seerCheckOpen) {
      setNight('昨晚验了');
      setTarget(null);
      setResult('是金水');
    }
  }, [seerCheckOpen]);

  if (!seerCheckOpen) return null;

  const targetStr = target ? `${target}号` : '?号';

  const handleConfirm = () => {
    if (!target) {
      showToast('请先选择验人目标玩家');
      return;
    }
    dispatch({
      type: 'ADD_SPEECH_CHIP',
      text: `${night} ${target}号 ${result}`,
    });
    closeSeerCheckModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-3 backdrop-blur-xs">
      <div className="animate-in fade-in zoom-in w-full max-w-sm rounded-xl border border-slate-200 bg-white p-4 shadow-xl duration-100">
        <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span>
            <span className="text-xs font-bold text-slate-800">
              快捷报验人（预言家）
            </span>
          </div>
          <button
            className="p-0.5 text-sm text-slate-400 hover:text-slate-600"
            onClick={closeSeerCheckModal}
          >
            ×
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="mb-1.5 block text-[11px] font-bold text-slate-500">
              1. 选择验人时间：
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {NIGHT_OPTIONS.map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setNight(opt.val)}
                  className={`rounded py-1.5 text-center font-medium ${
                    night === opt.val
                      ? 'border border-amber-300 bg-amber-50 font-bold text-amber-800'
                      : 'border border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-bold text-slate-500">
              2. 验的目标玩家：
              <span className="font-bold text-indigo-600">{targetStr}</span>
            </label>
            <div className="grid grid-cols-6 gap-1">
              {Array.from({ length: PLAYER_COUNT }, (_, idx) => idx + 1).map(
                (i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setTarget(i)}
                    className={`rounded py-1.5 text-xs font-bold transition ${
                      target === i
                        ? 'border border-amber-500 bg-amber-500 text-white shadow-2xs'
                        : 'border border-slate-200 bg-white text-slate-700 hover:bg-amber-50'
                    }`}
                  >
                    {i}号
                  </button>
                ),
              )}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-bold text-slate-500">
              3. 查验结果：
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setResult('是金水')}
                className={`flex items-center justify-center gap-1 rounded-lg py-2 text-center font-bold ${
                  result === '是金水'
                    ? 'border-2 border-emerald-500 bg-emerald-50 text-emerald-800'
                    : 'border border-slate-200 bg-white text-slate-700'
                }`}
              >
                是金水（好人）
              </button>
              <button
                type="button"
                onClick={() => setResult('是查杀')}
                className={`flex items-center justify-center gap-1 rounded-lg py-2 text-center font-bold ${
                  result === '是查杀'
                    ? 'border-2 border-rose-500 bg-rose-50 text-rose-800'
                    : 'border border-slate-200 bg-white text-slate-700'
                }`}
              >
                是查杀（狼人）
              </button>
            </div>
          </div>

          <div className="rounded border border-slate-200 bg-slate-50 p-2 text-[11px] text-slate-600">
            预览：
            <span className="font-bold text-indigo-700">{`${night} ${targetStr} ${result}`}</span>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-2">
            <button
              className="rounded px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100"
              onClick={closeSeerCheckModal}
            >
              取消
            </button>
            <button
              className="rounded bg-amber-500 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-amber-600"
              onClick={handleConfirm}
            >
              添加至发言
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
