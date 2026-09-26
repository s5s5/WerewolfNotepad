import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { NumberPicker } from './NumberPicker';
import { PlayerSpeechCard } from './PlayerSpeechCard';
import { VoteSection } from './VoteSection';
import type { EliminationResult, PkRoundData, PkScope } from '../../types/game';

interface Props {
  day: number;
  scope: PkScope;
  pkRounds: PkRoundData[];
}

const RoundView = ({
  day,
  scope,
  round,
  roundIndex,
}: {
  day: number;
  scope: PkScope;
  round: PkRoundData;
  roundIndex: number;
}) => {
  const { dispatch } = useGame();

  const setResult = (records: import('../../types/game').VoteRecord[]) => {
    dispatch({ type: 'SET_PK_RESULT', day, scope, roundIndex, records });
  };

  const finalize = (result: EliminationResult) => {
    dispatch({ type: 'SET_PK_RESULT', day, scope, roundIndex, result });
  };

  return (
    <div className="space-y-2 rounded-lg border border-orange-200 bg-orange-50/50 p-2.5">
      <span className="text-[11px] font-bold text-orange-800">
        平票 PK 第 {roundIndex + 1} 轮：
        {round.players.map((n) => `${n}号`).join(' vs ')}
      </span>

      <div className="space-y-1.5">
        {round.players.map((p) => (
          <PlayerSpeechCard
            key={p}
            day={day}
            phase="sheriff"
            playerNum={p}
            card={round.speeches[p] || {}}
          />
        ))}
      </div>

      <VoteSection
        title="PK 投票"
        eligibleTargets={round.players}
        records={round.voteRecords || []}
        onChange={setResult}
      />

      {round.result && (
        <p className="text-[11px] font-bold text-rose-700">
          结果：
          {round.result.type === 'exiled'
            ? `${round.result.player}号 出局${
                round.result.skillTrigger ? `（${round.result.skillTrigger}）` : ''
              }`
            : '再次平票'}
        </p>
      )}

      <div className="flex flex-wrap gap-1.5">
        {round.players.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => finalize({ type: 'exiled', player: p })}
            className={`rounded border px-2 py-0.5 text-[11px] font-bold ${
              round.result?.type === 'exiled' && round.result.player === p
                ? 'border-rose-500 bg-rose-100 text-rose-800'
                : 'border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            判 {p}号 出局
          </button>
        ))}
        <button
          type="button"
          onClick={() => finalize({ type: 'tied_again' })}
          className={`rounded border px-2 py-0.5 text-[11px] font-bold ${
            round.result?.type === 'tied_again'
              ? 'border-slate-500 bg-slate-200 text-slate-800'
              : 'border-slate-300 bg-slate-50 text-slate-600 hover:bg-slate-100'
          }`}
        >
          仍然平票
        </button>
      </div>
    </div>
  );
};

export const PkRoundSection = ({ day, scope, pkRounds }: Props) => {
  const { dispatch } = useGame();
  const [newPkPlayers, setNewPkPlayers] = useState<number[]>([]);
  const [adding, setAdding] = useState(false);

  const startPk = () => {
    if (newPkPlayers.length < 2) return;
    dispatch({ type: 'ADD_PK_ROUND', day, scope, players: newPkPlayers });
    setNewPkPlayers([]);
    setAdding(false);
  };

  return (
    <div className="space-y-2">
      {pkRounds.map((round, idx) => (
        <RoundView key={idx} day={day} scope={scope} round={round} roundIndex={idx} />
      ))}

      {adding ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
          <span className="mb-1 block text-[11px] font-bold text-slate-600">
            选择 PK 玩家（通常 2 人）
          </span>
          <NumberPicker value={newPkPlayers} onChange={setNewPkPlayers} mode="multi" />
          <div className="mt-1.5 flex gap-1.5">
            <button
              type="button"
              disabled={newPkPlayers.length < 2}
              onClick={startPk}
              className="flex-1 rounded bg-orange-500 py-1 text-[11px] font-bold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              开始 PK
            </button>
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="rounded px-2 py-1 text-[11px] text-slate-500 hover:bg-slate-100"
            >
              取消
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="w-full rounded border border-dashed border-orange-300 bg-white py-1.5 text-[11px] font-bold text-orange-700 hover:bg-orange-50"
        >
          + 出现平票，发起新一轮 PK
        </button>
      )}
    </div>
  );
};
