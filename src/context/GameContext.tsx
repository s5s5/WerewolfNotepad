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
        className={`fixed right-5 bottom-5 z-50 rounded-lg bg-slate-800 px-3 py-2 text-xs text-white shadow-lg transition-opacity duration-200 ${
          message ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        {message}
      </div>
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame 必须在 GameProvider 内使用');
  return ctx;
};
