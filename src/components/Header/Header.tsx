import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { SEAT_OPTIONS } from '../../constants/roles';
import { BOARDS } from '../../constants/boards';
import { useBoard } from '../../hooks/useBoard';
import type { RoleName } from '../../types/game';
import { BoardSwitchConfirmModal } from '../modals/BoardSwitchConfirmModal';
import { ResetConfirmModal } from '../modals/ResetConfirmModal';

export const Header = () => {
  const { state, dispatch } = useGame();
  const board = useBoard();
  const [resetOpen, setResetOpen] = useState(false);
  const [pendingBoard, setPendingBoard] = useState<string | null>(null);

  return (
    <header className="z-20 flex flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 py-2.5 shadow-xs">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white shadow-xs">
          狼
        </div>
        <div>
          <h1 className="text-sm leading-tight font-bold text-slate-800 md:text-base">
            12人{board.name}记录器
          </h1>
          <p className="hidden text-[11px] text-slate-400 sm:block">
            {board.subtitle}
          </p>
        </div>
      </div>

      <select
        value={state.boardId}
        onChange={(e) => {
          if (e.target.value !== state.boardId) setPendingBoard(e.target.value);
        }}
        title="切换板子"
        className="rounded border border-slate-300 bg-white px-1.5 py-0.5 text-xs font-semibold text-slate-700 outline-hidden focus:ring-1 focus:ring-indigo-500"
      >
        {BOARDS.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name}
          </option>
        ))}
      </select>

      <div className="flex items-center gap-2 rounded-lg border border-amber-200/90 bg-amber-50/80 px-2.5 py-1 shadow-2xs">
        <span className="flex items-center gap-1 text-xs font-bold text-amber-800">
          我是:
        </span>
        <select
          value={state.mySeat}
          onChange={(e) =>
            dispatch({ type: 'SET_MY_SEAT', seat: e.target.value })
          }
          className="rounded border border-amber-300 bg-white px-1.5 py-0.5 text-xs font-semibold text-slate-700 outline-hidden focus:ring-1 focus:ring-amber-500"
        >
          <option value="">未指定</option>
          {SEAT_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}号
            </option>
          ))}
        </select>
        <select
          value={state.myRole}
          onChange={(e) =>
            dispatch({ type: 'SET_MY_ROLE', role: e.target.value as RoleName })
          }
          className="rounded border border-amber-300 bg-white px-1.5 py-0.5 text-xs font-semibold text-slate-700 outline-hidden focus:ring-1 focus:ring-amber-500"
        >
          <option value="未知">底牌未知</option>
          {board.roles.map((r) => (
            <option key={r.name} value={r.name}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={() => setResetOpen(true)}
          title="清空全部重来"
          className="rounded-lg border border-transparent px-2 py-1 text-xs font-medium text-rose-600 transition hover:border-rose-200 hover:bg-rose-50"
        >
          重置
        </button>
      </div>

      <ResetConfirmModal open={resetOpen} onClose={() => setResetOpen(false)} />
      <BoardSwitchConfirmModal
        targetBoardId={pendingBoard}
        onClose={() => setPendingBoard(null)}
      />
    </header>
  );
};
