import { useGame } from '../../context/GameContext';
import {
  DEATH_TAG,
  FOOL_IMMUNE_TAG,
  POLICE_CANDIDATE_TAG,
} from '../../constants/roles';
import type { Player } from '../../types/game';

interface SeatCardProps {
  player: Player;
}

const SeatCard = ({ player }: SeatCardProps) => {
  const { state, dispatch } = useGame();
  const isCurrent = player.num === state.currentPlayer;
  const isMe = String(player.num) === String(state.mySeat);
  const isDead = player.tags.includes(DEATH_TAG);
  const isFoolImmune = player.tags.includes(FOOL_IMMUNE_TAG);
  const isCandidate = player.tags.includes(POLICE_CANDIDATE_TAG);

  const cardClass = `relative flex cursor-pointer flex-col justify-between rounded-lg border p-1.5 transition select-none ${
    isCurrent
      ? 'border-indigo-500 bg-indigo-50/90 shadow-xs ring-2 ring-indigo-400'
      : 'border-slate-200 bg-white hover:border-indigo-300'
  } ${isMe ? 'bg-amber-50/60 ring-2 ring-amber-400' : ''} ${isDead ? 'bg-slate-100 opacity-55' : ''}`;

  const displayTag = player.tags.length > 0 ? player.tags[0] : null;

  return (
    <div
      className={cardClass}
      onClick={() => dispatch({ type: 'SELECT_PLAYER', num: player.num })}
    >
      <div className="flex items-center justify-between">
        <span
          className={`text-xs font-bold ${
            isDead
              ? 'text-slate-400 line-through'
              : isCurrent
                ? 'text-indigo-700'
                : 'text-slate-800'
          }`}
        >
          {player.num}号
        </span>
        {isMe && (
          <span className="text-[9px] font-bold text-amber-500" title="我自己">
            我
          </span>
        )}
        {isCandidate && (
          <span className="text-[9px] font-bold text-indigo-600">警</span>
        )}
        {isFoolImmune && (
          <span className="text-[9px] font-bold text-purple-600">愚</span>
        )}
      </div>
      <div className="mt-1 flex h-3.5 items-center">
        {displayTag && (
          <span className="block max-w-full truncate rounded bg-slate-200/80 px-1 text-[9px] text-slate-700">
            {displayTag}
          </span>
        )}
      </div>
    </div>
  );
};

export const SeatsMatrix = () => {
  const { state } = useGame();

  return (
    <div className="flex-shrink-0 border-b border-slate-200 bg-slate-50/80 px-3 py-2">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
          12 席位状态盘
        </span>
        {state.mySeat ? (
          <span className="rounded border border-amber-300 bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800">
            我是 {state.mySeat}号 · {state.myRole}
          </span>
        ) : (
          <span className="rounded border border-slate-200 bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-400">
            未设定我的主角席位
          </span>
        )}
      </div>
      <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-12">
        {state.players.map((p) => (
          <SeatCard key={p.num} player={p} />
        ))}
      </div>
    </div>
  );
};
