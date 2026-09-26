import {
  createContext,
  useContext,
  type Dispatch,
  type ReactNode,
} from 'react';
import { useGameState, type GameAction } from '../hooks/useGameState';
import { useToast } from '../hooks/useToast';
import type { GameState } from '../types/game';

interface GameContextValue {
  state: GameState;
  dispatch: Dispatch<GameAction>;
  showToast: (msg: string, duration?: number) => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const { state, dispatch } = useGameState();
  const { message, showToast } = useToast();

  return (
    <GameContext.Provider value={{ state, dispatch, showToast }}>
      {children}
      <div
        className={`pointer-events-none fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200 ${
          message ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="max-w-[80vw] rounded-xl bg-slate-900/90 px-5 py-3 text-center text-sm font-medium text-white shadow-2xl">
          {message}
        </div>
      </div>
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame 必须在 GameProvider 内使用');
  return ctx;
};
