import { useEffect, useState } from 'react';
import { useGame } from '../../context/GameContext';
import { useModalActions } from '../../context/ModalContext';
import { PLAYER_COUNT, POLICE_CANDIDATE_TAG } from '../../constants/roles';
import type { VoteRecord, VoteScene } from '../../types/game';

const SCENE_TABS: { scene: VoteScene; label: string }[] = [
  { scene: 'sheriff', label: '警选投票' },
  { scene: 'exile', label: '白天放逐' },
  { scene: 'pk', label: '平票 PK' },
];

const SCENE_TITLES: Record<VoteScene, string> = {
  sheriff: '警选投票',
  exile: '白天放逐投票',
  pk: '平票 PK 投票',
};

export const VoteModal = () => {
  const { state, dispatch, showToast } = useGame();
  const { voteOpen, closeVoteModal } = useModalActions();

  const [scene, setScene] = useState<VoteScene>('sheriff');
  const [policeCandidates, setPoliceCandidates] = useState<Set<number>>(
    new Set(),
  );
  const [targetPlayer, setTargetPlayer] = useState<number | null>(null);
  const [selectedVoters, setSelectedVoters] = useState<Set<number>>(new Set());
  const [records, setRecords] = useState<VoteRecord[]>([]);

  useEffect(() => {
    if (voteOpen) {
      setScene('sheriff');
      setTargetPlayer(null);
      setSelectedVoters(new Set());
      setRecords([]);
      const initialCandidates = new Set<number>();
      state.players.forEach((p) => {
        if (p.tags.includes(POLICE_CANDIDATE_TAG)) initialCandidates.add(p.num);
      });
      setPoliceCandidates(initialCandidates);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voteOpen]);

  if (!voteOpen) return null;

  const isSheriff = scene === 'sheriff';

  const togglePoliceCandidate = (num: number) => {
    setPoliceCandidates((prev) => {
      const next = new Set(prev);
      if (next.has(num)) {
        next.delete(num);
        dispatch({
          type: 'SET_PLAYER_TAG',
          num,
          tag: POLICE_CANDIDATE_TAG,
          on: false,
        });
        if (isSheriff && targetPlayer === num) setTargetPlayer(null);
      } else {
        next.add(num);
        dispatch({
          type: 'SET_PLAYER_TAG',
          num,
          tag: POLICE_CANDIDATE_TAG,
          on: true,
        });
        if (isSheriff && selectedVoters.has(num)) {
          setSelectedVoters((voters) => {
            const nv = new Set(voters);
            nv.delete(num);
            return nv;
          });
        }
      }
      return next;
    });
  };

  const clearPoliceCandidates = () => {
    policeCandidates.forEach((num) => {
      dispatch({
        type: 'SET_PLAYER_TAG',
        num,
        tag: POLICE_CANDIDATE_TAG,
        on: false,
      });
    });
    setPoliceCandidates(new Set());
  };

  const policeList = Array.from(policeCandidates).sort((a, b) => a - b);
  const civilianList = Array.from(
    { length: PLAYER_COUNT },
    (_, idx) => idx + 1,
  ).filter((i) => !policeCandidates.has(i));

  const handleAddVoteGroup = () => {
    if (!targetPlayer) {
      showToast('请先选择被投人');
      return;
    }
    if (selectedVoters.size === 0) {
      showToast('请选择投 TA 的玩家号码');
      return;
    }

    const voters = Array.from(selectedVoters).sort((a, b) => a - b);
    setRecords((prev) => {
      const existingIdx = prev.findIndex((r) => r.target === targetPlayer);
      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx] = { target: targetPlayer, voters };
        return next;
      }
      return [...prev, { target: targetPlayer, voters }];
    });

    setTargetPlayer(null);
    setSelectedVoters(new Set());
    showToast('已添加本组得票');
  };

  const handleClearSelection = () => {
    setTargetPlayer(null);
    setSelectedVoters(new Set());
  };

  const handleConfirmSave = () => {
    if (records.length === 0) {
      showToast('请先至少添加一组票型');
      return;
    }

    const lines: string[] = [];
    if (isSheriff) {
      lines.push(
        `【警上】${policeList.length > 0 ? policeList.map((n) => `${n}号`).join('、') : '无'} (${policeList.length}人)`,
      );
      lines.push(
        `【警下】${civilianList.length > 0 ? civilianList.map((n) => `${n}号`).join('、') : '无'} (${civilianList.length}人)`,
      );
      lines.push('-------------------');
    }
    records.forEach((r) => {
      lines.push(
        `• ${r.target}号 (${r.voters.length}票): ${r.voters.map((n) => `${n}号`).join('、')}`,
      );
    });

    dispatch({
      type: 'ADD_LOG',
      log: {
        id: `log_${Date.now()}`,
        type: 'vote_record',
        round: state.currentRound,
        sceneTitle: SCENE_TITLES[scene],
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        content: lines.join('\n'),
      },
    });

    closeVoteModal();
    showToast('票型已记录至流水');
  };

  const toggleVoteTarget = (i: number) => {
    const isOnPolice = policeCandidates.has(i);
    const isEligible = !isSheriff || isOnPolice;
    if (!isEligible) {
      showToast('警选中只有上警候选人才能被投！');
      return;
    }
    setTargetPlayer(i);
  };

  const toggleVoter = (i: number) => {
    const isOnPolice = policeCandidates.has(i);
    const canVote = !isSheriff || !isOnPolice;
    if (!canVote) {
      showToast('警上竞选人员无投票权，只能由警下人员投票！');
      return;
    }
    setSelectedVoters((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-3 backdrop-blur-xs">
      <div className="animate-in fade-in zoom-in flex max-h-[92vh] w-full max-w-md flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-xl duration-100">
        <div className="mb-2 flex flex-shrink-0 items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-800">
              票型与投票记录
            </span>
          </div>
          <button
            className="p-0.5 text-sm text-slate-400 hover:text-slate-600"
            onClick={closeVoteModal}
          >
            ×
          </button>
        </div>

        <div className="mb-2.5 grid flex-shrink-0 grid-cols-3 gap-1 rounded-lg bg-slate-100 p-1 text-xs">
          {SCENE_TABS.map((tab) => (
            <button
              key={tab.scene}
              type="button"
              onClick={() => setScene(tab.scene)}
              className={`rounded py-1 ${
                scene === tab.scene
                  ? 'bg-white font-bold text-indigo-700 shadow-2xs'
                  : 'font-medium text-slate-600 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto pr-1 text-xs">
          {isSheriff && (
            <div className="rounded-lg border border-indigo-200 bg-indigo-50/70 p-2.5">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1 text-[11px] font-bold text-indigo-900">
                  上警人员记录（点击选择竞选者）
                </span>
                <button
                  type="button"
                  onClick={clearPoliceCandidates}
                  className="text-[10px] font-medium text-indigo-600 hover:text-indigo-800"
                >
                  清空上警
                </button>
              </div>
              <div className="mb-2 grid grid-cols-6 gap-1">
                {Array.from({ length: PLAYER_COUNT }, (_, idx) => idx + 1).map(
                  (i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => togglePoliceCandidate(i)}
                      className={`rounded py-1 text-xs font-bold transition ${
                        policeCandidates.has(i)
                          ? 'border border-indigo-600 bg-indigo-600 text-white shadow-2xs'
                          : 'border border-indigo-200 bg-white text-slate-700 hover:bg-indigo-50'
                      }`}
                    >
                      {i}号
                    </button>
                  ),
                )}
              </div>
              <div className="space-y-0.5 border-t border-indigo-100 pt-1.5 text-[10px] text-slate-600">
                <div>
                  <span className="font-semibold text-indigo-700">
                    【警上人员】
                  </span>
                  <span className="text-slate-700">
                    {policeList.length > 0
                      ? `${policeList.map((n) => `${n}号`).join('、')} (${policeList.length}人)`
                      : '暂无'}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-amber-700">
                    【警下人员（有票）】
                  </span>
                  <span className="text-slate-700">
                    {civilianList.length > 0
                      ? `${civilianList.map((n) => `${n}号`).join('、')} (${civilianList.length}人)`
                      : '全场 12 人'}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-600">
                1. 选择被投人：
              </label>
              <span className="text-[11px] font-bold text-amber-700">
                {targetPlayer ? `${targetPlayer}号 玩家` : '未选择'}
              </span>
            </div>
            <div className="grid grid-cols-6 gap-1">
              {Array.from({ length: PLAYER_COUNT }, (_, idx) => idx + 1).map(
                (i) => {
                  const isTarget = targetPlayer === i;
                  const isOnPolice = policeCandidates.has(i);
                  const isEligible = !isSheriff || isOnPolice;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => toggleVoteTarget(i)}
                      className={`rounded py-1.5 text-xs font-bold transition ${
                        !isEligible
                          ? 'cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-300 opacity-50'
                          : isTarget
                            ? 'border border-amber-600 bg-amber-600 text-white shadow-2xs'
                            : isOnPolice && isSheriff
                              ? 'border border-indigo-300 bg-indigo-50 text-indigo-700 hover:border-indigo-400'
                              : 'border border-slate-200 bg-white text-slate-700 hover:border-amber-300'
                      }`}
                    >
                      {i}号
                      {isSheriff && (
                        <span
                          className={`block text-[9px] font-normal ${isOnPolice ? 'text-indigo-500' : 'text-slate-300'}`}
                        >
                          {isOnPolice ? '警上' : '警下'}
                        </span>
                      )}
                    </button>
                  );
                },
              )}
            </div>
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-600">
                2. 选择投 TA 的人：
              </label>
              <span className="text-[11px] font-bold text-indigo-600">
                已选 {selectedVoters.size} 票
              </span>
            </div>
            <div className="grid grid-cols-6 gap-1">
              {Array.from({ length: PLAYER_COUNT }, (_, idx) => idx + 1).map(
                (i) => {
                  const isVoter = selectedVoters.has(i);
                  const isOnPolice = policeCandidates.has(i);
                  const canVote = !isSheriff || !isOnPolice;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => toggleVoter(i)}
                      className={`rounded py-1.5 text-xs font-bold transition ${
                        !canVote
                          ? 'cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-300 line-through opacity-40'
                          : isVoter
                            ? 'border border-indigo-600 bg-indigo-600 text-white shadow-2xs'
                            : !isOnPolice && isSheriff
                              ? 'border border-amber-200 bg-amber-50/70 text-slate-700 hover:border-indigo-300'
                              : 'border border-slate-200 bg-white text-slate-700 hover:border-indigo-300'
                      }`}
                    >
                      {i}号
                      {isSheriff && (
                        <span
                          className={`block text-[9px] font-normal ${isOnPolice ? 'text-slate-300' : 'text-amber-700'}`}
                        >
                          {isOnPolice ? '警上无票' : '警下有票'}
                        </span>
                      )}
                    </button>
                  );
                },
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleClearSelection}
              className="rounded px-2.5 py-1 text-xs text-slate-500 hover:bg-slate-100"
            >
              重置本组
            </button>
            <button
              type="button"
              onClick={handleAddVoteGroup}
              className="rounded bg-amber-500 px-3 py-1 text-xs font-bold text-white shadow-2xs hover:bg-amber-600"
            >
              + 添加本组得票
            </button>
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-bold text-slate-500">
              本轮已统计票型列表：
            </label>
            <div className="min-h-[40px] space-y-1 rounded-lg border border-slate-200 bg-slate-50 p-2">
              {records.length === 0 ? (
                <span className="text-[11px] text-slate-400 italic">
                  暂无票型组合，请在上方添加
                </span>
              ) : (
                records.map((rec, idx) => (
                  <div
                    key={rec.target}
                    className="flex items-center justify-between rounded border border-slate-200 bg-white px-2 py-1 text-xs"
                  >
                    <div>
                      <span className="font-bold text-amber-700">
                        {rec.target}号
                      </span>
                      <span className="font-semibold text-slate-500">
                        {' '}
                        ({rec.voters.length}票):{' '}
                      </span>
                      <span className="text-slate-700">
                        {rec.voters.map((n) => `${n}号`).join('、')}
                      </span>
                    </div>
                    <button
                      title="删除该组"
                      className="p-0.5 text-slate-400 hover:text-rose-600"
                      onClick={() =>
                        setRecords((prev) => prev.filter((_, i) => i !== idx))
                      }
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-shrink-0 items-center justify-end gap-2 border-t border-slate-100 pt-2">
          <button
            className="rounded px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100"
            onClick={closeVoteModal}
          >
            取消
          </button>
          <button
            className="rounded bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700"
            onClick={handleConfirmSave}
          >
            保存票型记录
          </button>
        </div>
      </div>
    </div>
  );
};
