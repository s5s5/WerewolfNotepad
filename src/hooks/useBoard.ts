import { useGame } from '../context/GameContext';
import { getBoard } from '../constants/boards';

export const useBoard = () => getBoard(useGame().state.boardId);
