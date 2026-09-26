import { useGame } from '../../context/GameContext';
import { NumberPicker } from './NumberPicker';
import { SpeechOrderControl } from './SpeechOrderControl';
import { PlayerSpeechCard } from './PlayerSpeechCard';
import { VoteSection } from './VoteSection';
import { PkRoundSection } from './PkRoundSection';
import { computeSpeechOrder } from '../../utils/speechOrder';
import { PLAYER_COUNT, POLICE_CANDIDATE_TAG } from '../../constants/roles';
import type { DayData } from '../../types/game';

interface Props {
  day: number;
  sheriff: DayData['sheriff'];
}

export const SheriffElection = ({ day, sheriff }: Props) => {
  const { dispatch } = useGame();
  const candidates = sheriff?.candidates || [];
  const speeches = sheriff?.speeches || {};
  const order = computeSpeechOrder(sheriff?.speechOrder, candidates);

  const setCandidates = (next: number[]) => {
    candidates.forEach((n) => {
      if (!next.includes(n)) {
        dispatch({ type: 'SET_PLAYER_TAG', num: n, tag: POLICE_CANDIDATE_TAG, on: false });
      }
    });
    next.forEach((n) => {
      if (!candidates.includes(n)) {
        dispatch({ type: 'SET_PLAYER_TAG', num: n, tag: POLICE_CANDIDATE_TAG, on: true });
      }
    });
    dispatch({ type: 'SET_SHERIFF_CANDIDATES', day, candidates: next });
  };

  const nonCandidates = Array.from({ length: PLAYER_COUNT }, (_, i) => i + 1).filter(
    (n) => !candidates.includes(n),
  );

  return (
    <div className="space-y-2.5 rounded-lg border border-indigo-200 bg-indigo-50/40 p-3">
      <span className="text-[11px] font-bold text-indigo-900">警长竞选</span>

      <div className="rounded-lg border border-indigo-200 bg-white p-2">
        <span className="mb-1 block text-[10px] font-bold text-slate-500">
          上警名单
        </span>
        <NumberPicker value={candidates} onChange={setCandidates} mode="multi" />
        <p className="mt-1 text-[10px] text-slate-400">
          警下（有票）：{nonCandidates.map((n) => `${n}号`).join('、') || '无'}
        </p>
      </div>

      {candidates.length > 0 && (
        <>
          <SpeechOrderControl
            order={sheriff?.speechOrder}
            onSet={(o) =>
              dispatch({ type: 'SET_SPEECH_ORDER', day, phase: 'sheriff', order: o })
            }
            eligiblePlayers={candidates}
          />

          <div className="space-y-1.5">
            {order.map((p) => (
              <PlayerSpeechCard
                key={p}
                day={day}
                phase="sheriff"
                playerNum={p}
                card={speeches[p] || {}}
              />
            ))}
          </div>

          <VoteSection
            title="警选投票"
            eligibleTargets={candidates}
            eligibleVoters={nonCandidates}
            records={sheriff?.voteRecords || []}
            onChange={(records) =>
              dispatch({ type: 'SET_SHERIFF_VOTES', day, records })
            }
          />

          {sheriff?.result ? (
            <p className="text-[11px] font-bold text-indigo-800">
              结果：
              {sheriff.result.type === 'elected'
                ? `${sheriff.result.player}号 当选警长`
                : sheriff.result.type === 'tied_pk'
                  ? '平票，进入 PK'
                  : '警徽流失'}
            </p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {candidates.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() =>
                    dispatch({
                      type: 'SET_SHERIFF_RESULT',
                      day,
                      result: { type: 'elected', player: p },
                    })
                  }
                  className="rounded border border-indigo-300 bg-indigo-50 px-2 py-0.5 text-[11px] font-bold text-indigo-700 hover:bg-indigo-100"
                >
                  判 {p}号 当选
                </button>
              ))}
              <button
                type="button"
                onClick={() =>
                  dispatch({ type: 'SET_SHERIFF_RESULT', day, result: { type: 'tied_pk' } })
                }
                className="rounded border border-slate-300 bg-slate-50 px-2 py-0.5 text-[11px] font-bold text-slate-600 hover:bg-slate-100"
              >
                平票
              </button>
            </div>
          )}

          {sheriff?.result?.type === 'tied_pk' && (
            <PkRoundSection day={day} scope="sheriff" pkRounds={sheriff.pkRounds || []} />
          )}
        </>
      )}

      {candidates.length === 0 && (
        <p className="text-[10px] text-slate-400">尚未有人上警</p>
      )}
    </div>
  );
};
