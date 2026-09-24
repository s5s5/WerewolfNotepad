import { useEffect, useReducer } from 'react';
import { PLAYER_COUNT, STORAGE_KEY } from '../constants/roles';
import type {
  GameState,
  LogEntry,
  PersistedGameState,
  Player,
  RoleName,
} from '../types/game';

const createInitialPlayers = (): Player[] =>
  Array.from({ length: PLAYER_COUNT }, (_, i) => ({ num: i + 1, tags: [] }));

const createInitialState = (): GameState => ({
  mySeat: '',
  myRole: '未知',
  currentRound: 1,
  currentPlayer: 1,
  filterCurrentPlayerOnly: false,
  players: createInitialPlayers(),
  currentSpeechChips: [],
  logs: [],
});

const loadFromStorage = (): Partial<GameState> | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Partial<PersistedGameState>;
    if (data && Array.isArray(data.players)) {
      return {
        mySeat: data.mySeat || '',
        myRole: data.myRole || '未知',
        currentRound: data.currentRound || 1,
        currentPlayer: data.currentPlayer || 1,
        players: data.players,
        logs: data.logs || [],
      };
    }
  } catch (e) {
    console.warn('读取失败:', e);
  }
  return null;
};

const saveToStorage = (state: GameState) => {
  try {
    const data: PersistedGameState = {
      mySeat: state.mySeat,
      myRole: state.myRole,
      currentRound: state.currentRound,
      currentPlayer: state.currentPlayer,
      players: state.players,
      logs: state.logs,
      timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('存储失败:', e);
  }
};

export type GameAction =
  | { type: 'SET_MY_SEAT'; seat: string }
  | { type: 'SET_MY_ROLE'; role: RoleName }
  | { type: 'PREV_ROUND' }
  | { type: 'NEXT_ROUND' }
  | { type: 'SELECT_PLAYER'; num: number }
  | { type: 'PREV_PLAYER' }
  | { type: 'NEXT_PLAYER' }
  | { type: 'SET_FILTER_CURRENT_PLAYER'; value: boolean }
  | { type: 'TOGGLE_PLAYER_TAG'; num: number; tag: string }
  | { type: 'REMOVE_PLAYER_TAG'; num: number; tag: string }
  | { type: 'SET_PLAYER_TAG'; num: number; tag: string; on: boolean }
  | { type: 'ADD_SPEECH_CHIP'; text: string }
  | { type: 'REMOVE_SPEECH_CHIP'; index: number }
  | { type: 'CLEAR_SPEECH_CHIPS' }
  | { type: 'SET_SPEECH_CHIPS'; chips: string[] }
  | { type: 'SAVE_SPEECH'; content: string }
  | { type: 'ADD_LOG'; log: LogEntry }
  | { type: 'UPDATE_LOG_CONTENT'; id: string; content: string }
  | { type: 'DELETE_LOG'; id: string }
  | { type: 'INSERT_DIVIDER' }
  | { type: 'RESET_ALL' };

const makeLogId = (prefix: string) =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

const nowTimeString = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'SET_MY_SEAT':
      return { ...state, mySeat: action.seat };
    case 'SET_MY_ROLE':
      return { ...state, myRole: action.role };
    case 'PREV_ROUND':
      return state.currentRound > 1
        ? { ...state, currentRound: state.currentRound - 1 }
        : state;
    case 'NEXT_ROUND':
      return { ...state, currentRound: state.currentRound + 1 };
    case 'SELECT_PLAYER':
      return { ...state, currentPlayer: action.num };
    case 'PREV_PLAYER': {
      let next = state.currentPlayer - 1;
      if (next < 1) next = PLAYER_COUNT;
      return { ...state, currentPlayer: next };
    }
    case 'NEXT_PLAYER': {
      let next = state.currentPlayer + 1;
      if (next > PLAYER_COUNT) next = 1;
      return { ...state, currentPlayer: next };
    }
    case 'SET_FILTER_CURRENT_PLAYER':
      return { ...state, filterCurrentPlayerOnly: action.value };
    case 'TOGGLE_PLAYER_TAG': {
      const players = state.players.map((p) => {
        if (p.num !== action.num) return p;
        const has = p.tags.includes(action.tag);
        return {
          ...p,
          tags: has
            ? p.tags.filter((t) => t !== action.tag)
            : [...p.tags, action.tag],
        };
      });
      return { ...state, players };
    }
    case 'REMOVE_PLAYER_TAG': {
      const players = state.players.map((p) =>
        p.num === action.num
          ? { ...p, tags: p.tags.filter((t) => t !== action.tag) }
          : p,
      );
      return { ...state, players };
    }
    case 'SET_PLAYER_TAG': {
      const players = state.players.map((p) => {
        if (p.num !== action.num) return p;
        const has = p.tags.includes(action.tag);
        if (action.on && !has) return { ...p, tags: [...p.tags, action.tag] };
        if (!action.on && has)
          return { ...p, tags: p.tags.filter((t) => t !== action.tag) };
        return p;
      });
      return { ...state, players };
    }
    case 'ADD_SPEECH_CHIP':
      if (!action.text) return state;
      return {
        ...state,
        currentSpeechChips: [...state.currentSpeechChips, action.text],
      };
    case 'REMOVE_SPEECH_CHIP':
      return {
        ...state,
        currentSpeechChips: state.currentSpeechChips.filter(
          (_, i) => i !== action.index,
        ),
      };
    case 'CLEAR_SPEECH_CHIPS':
      return { ...state, currentSpeechChips: [] };
    case 'SET_SPEECH_CHIPS':
      return { ...state, currentSpeechChips: action.chips };
    case 'SAVE_SPEECH': {
      const newLog: LogEntry = {
        id: makeLogId('log'),
        type: 'speech',
        player: state.currentPlayer,
        round: state.currentRound,
        time: nowTimeString(),
        content: action.content,
      };
      return {
        ...state,
        logs: [...state.logs, newLog],
        currentSpeechChips: [],
      };
    }
    case 'ADD_LOG':
      return { ...state, logs: [...state.logs, action.log] };
    case 'UPDATE_LOG_CONTENT':
      return {
        ...state,
        logs: state.logs.map((l) =>
          l.id === action.id ? { ...l, content: action.content } : l,
        ),
      };
    case 'DELETE_LOG':
      return { ...state, logs: state.logs.filter((l) => l.id !== action.id) };
    case 'INSERT_DIVIDER':
      return {
        ...state,
        logs: [
          ...state.logs,
          {
            id: makeLogId('divider'),
            type: 'divider',
            title: `第 ${state.currentRound} 天 轮次节点`,
          },
        ],
      };
    case 'RESET_ALL':
      return createInitialState();
    default:
      return state;
  }
};

const init = (): GameState => {
  const loaded = loadFromStorage();
  return loaded ? { ...createInitialState(), ...loaded } : createInitialState();
};

export const useGameState = () => {
  const [state, dispatch] = useReducer(gameReducer, undefined, init);

  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  return { state, dispatch };
};
