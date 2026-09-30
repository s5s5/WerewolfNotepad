import { useEffect, useReducer } from 'react';
import { PLAYER_COUNT, STORAGE_KEY } from '../constants/roles';
import { DEFAULT_BOARD_ID, getBoard } from '../constants/boards';
import {
  DAY_COUNT,
  type DayData,
  type EliminationResult,
  type GameState,
  type NightDeathInfo,
  type PersistedGameState,
  type Player,
  type RoleName,
  type SpeechCardData,
  type SpeechOrderConfig,
  type SpeechPhase,
  type VoteRecord,
} from '../types/game';

const createInitialPlayers = (): Player[] =>
  Array.from({ length: PLAYER_COUNT }, (_, i) => ({ num: i + 1, tags: [] }));

const createEmptyDayData = (): DayData => ({
  daytime: { speeches: {} },
});

const createInitialDays = (): Record<number, DayData> => {
  const days: Record<number, DayData> = {};
  for (let d = 1; d <= DAY_COUNT; d++) days[d] = createEmptyDayData();
  return days;
};

const createInitialState = (boardId: string = DEFAULT_BOARD_ID): GameState => ({
  boardId,
  mySeat: '',
  myRole: '未知',
  currentRound: 1,
  currentPlayer: 1,
  filterCurrentPlayerOnly: false,
  resetNonce: 0,
  players: createInitialPlayers(),
  days: createInitialDays(),
});

const loadFromStorage = (): Partial<GameState> | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Partial<PersistedGameState>;
    if (data && Array.isArray(data.players)) {
      const board = getBoard(data.boardId);
      const myRole = data.myRole || '未知';
      return {
        boardId: board.id,
        mySeat: data.mySeat || '',
        myRole: board.roles.some((r) => r.name === myRole) ? myRole : '未知',
        currentRound: data.currentRound || 1,
        currentPlayer: data.currentPlayer || 1,
        players: data.players,
        days:
          data.days && Object.keys(data.days).length > 0
            ? { ...createInitialDays() }
            : createInitialDays(),
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
      boardId: state.boardId,
      mySeat: state.mySeat,
      myRole: state.myRole,
      currentRound: state.currentRound,
      currentPlayer: state.currentPlayer,
      players: state.players,
      days: state.days,
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
  | { type: 'RESET_ALL' }
  | { type: 'SET_BOARD'; boardId: string }
  // === v2 平铺时间轴 actions ===
  | {
      type: 'UPDATE_SPEECH_CARD';
      day: number;
      phase: SpeechPhase;
      player: number;
      patch: Partial<SpeechCardData>;
    }
  | { type: 'SET_NIGHT_DEATH'; day: number; info: NightDeathInfo }
  | { type: 'SET_DAY_DEATHS'; day: number; players: number[] }
  | { type: 'SET_SHERIFF_CANDIDATES'; day: number; candidates: number[] }
  | {
      type: 'SET_SPEECH_ORDER';
      day: number;
      phase: SpeechPhase;
      order: SpeechOrderConfig;
    }
  | {
      type: 'SET_SHERIFF_RESULT';
      day: number;
      result:
        | { type: 'elected'; player: number }
        | { type: 'tied_pk' }
        | { type: 'badge_lost' }
        | { type: 'aborted' };
    }
  | { type: 'SET_SHERIFF_VOTES'; day: number; records: VoteRecord[] }
  | {
      type: 'SET_DAY_VOTE';
      day: number;
      records?: VoteRecord[];
      result?:
        | { type: 'exiled'; player: number; skillTrigger?: string }
        | { type: 'tied_pk' };
    }
  | {
      type: 'ADD_PK_ROUND';
      day: number;
      scope: 'sheriff' | 'day';
      players: number[];
    }
  | {
      type: 'UPDATE_PK_SPEECH';
      day: number;
      scope: 'sheriff' | 'day';
      roundIndex: number;
      player: number;
      patch: Partial<SpeechCardData>;
    }
  | {
      type: 'SET_PK_RESULT';
      day: number;
      scope: 'sheriff' | 'day';
      roundIndex: number;
      records?: VoteRecord[];
      result?: EliminationResult;
    }
  | {
      type: 'SET_BADGE_ACTION';
      day: number;
      action: '移交' | '撕警徽';
      transferTo?: number;
    };

const getDay = (state: GameState, day: number): DayData =>
  state.days[day] || createEmptyDayData();

const updateDay = (
  state: GameState,
  day: number,
  updater: (d: DayData) => DayData,
): GameState => ({
  ...state,
  days: { ...state.days, [day]: updater(getDay(state, day)) },
});

const mergeSpeechCard = (
  speeches: Record<number, SpeechCardData>,
  player: number,
  patch: Partial<SpeechCardData>,
): Record<number, SpeechCardData> => ({
  ...speeches,
  [player]: { ...speeches[player], ...patch },
});

const getPkRounds = (
  dayData: DayData,
  scope: 'sheriff' | 'day',
): NonNullable<DayData['pkRounds']> => {
  if (scope === 'sheriff') return dayData.sheriff?.pkRounds || [];
  return dayData.pkRounds || [];
};

const setPkRounds = (
  dayData: DayData,
  scope: 'sheriff' | 'day',
  pkRounds: NonNullable<DayData['pkRounds']>,
): DayData => {
  if (scope === 'sheriff') {
    return {
      ...dayData,
      sheriff: {
        ...(dayData.sheriff || { candidates: [], speeches: {} }),
        pkRounds,
      },
    };
  }
  return { ...dayData, pkRounds };
};

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
    case 'RESET_ALL':
      return {
        ...createInitialState(state.boardId),
        resetNonce: state.resetNonce + 1,
      };
    case 'SET_BOARD':
      return {
        ...createInitialState(getBoard(action.boardId).id),
        mySeat: state.mySeat,
        resetNonce: state.resetNonce + 1,
      };

    case 'UPDATE_SPEECH_CARD': {
      return updateDay(state, action.day, (d) => {
        if (action.phase === 'sheriff') {
          const sheriff = d.sheriff || { candidates: [], speeches: {} };
          return {
            ...d,
            sheriff: {
              ...sheriff,
              speeches: mergeSpeechCard(
                sheriff.speeches,
                action.player,
                action.patch,
              ),
            },
          };
        }
        if (action.phase === 'firstNightDeath') {
          return {
            ...d,
            firstNightDeathSpeeches: mergeSpeechCard(
              d.firstNightDeathSpeeches || {},
              action.player,
              action.patch,
            ),
          };
        }
        if (action.phase === 'exitSpeech') {
          return {
            ...d,
            exitSpeeches: mergeSpeechCard(
              d.exitSpeeches || {},
              action.player,
              action.patch,
            ),
          };
        }
        return {
          ...d,
          daytime: {
            ...d.daytime,
            speeches: mergeSpeechCard(
              d.daytime.speeches,
              action.player,
              action.patch,
            ),
          },
        };
      });
    }

    case 'SET_NIGHT_DEATH':
      return updateDay(state, action.day, (d) => ({
        ...d,
        nightDeath: action.info,
      }));

    case 'SET_DAY_DEATHS':
      return updateDay(state, action.day, (d) => ({
        ...d,
        dayDeaths: action.players,
      }));

    case 'SET_SHERIFF_CANDIDATES':
      return updateDay(state, action.day, (d) => ({
        ...d,
        sheriff: {
          ...(d.sheriff || { speeches: {} }),
          candidates: action.candidates,
        },
      }));

    case 'SET_SPEECH_ORDER':
      return updateDay(state, action.day, (d) => {
        if (action.phase === 'sheriff') {
          return {
            ...d,
            sheriff: {
              ...(d.sheriff || { candidates: [], speeches: {} }),
              speechOrder: action.order,
            },
          };
        }
        return { ...d, daytime: { ...d.daytime, speechOrder: action.order } };
      });

    case 'SET_SHERIFF_RESULT':
      return updateDay(state, action.day, (d) => ({
        ...d,
        sheriff: {
          ...(d.sheriff || { candidates: [], speeches: {} }),
          result: action.result,
        },
      }));

    case 'SET_SHERIFF_VOTES':
      return updateDay(state, action.day, (d) => ({
        ...d,
        sheriff: {
          ...(d.sheriff || { candidates: [], speeches: {} }),
          voteRecords: action.records,
        },
      }));

    case 'SET_DAY_VOTE':
      return updateDay(state, action.day, (d) => ({
        ...d,
        dayVote: {
          records: action.records ?? d.dayVote?.records,
          result: action.result ?? d.dayVote?.result,
        },
      }));

    case 'ADD_PK_ROUND':
      return updateDay(state, action.day, (d) => {
        const rounds = getPkRounds(d, action.scope);
        return setPkRounds(d, action.scope, [
          ...rounds,
          { players: action.players, speeches: {} },
        ]);
      });

    case 'UPDATE_PK_SPEECH':
      return updateDay(state, action.day, (d) => {
        const rounds = getPkRounds(d, action.scope);
        const nextRounds = rounds.map((r, idx) =>
          idx === action.roundIndex
            ? {
                ...r,
                speeches: mergeSpeechCard(
                  r.speeches,
                  action.player,
                  action.patch,
                ),
              }
            : r,
        );
        return setPkRounds(d, action.scope, nextRounds);
      });

    case 'SET_PK_RESULT':
      return updateDay(state, action.day, (d) => {
        const rounds = getPkRounds(d, action.scope);
        const nextRounds = rounds.map((r, idx) =>
          idx === action.roundIndex
            ? {
                ...r,
                voteRecords: action.records ?? r.voteRecords,
                result: action.result ?? r.result,
              }
            : r,
        );
        return setPkRounds(d, action.scope, nextRounds);
      });

    case 'SET_BADGE_ACTION':
      return updateDay(state, action.day, (d) => ({
        ...d,
        badgeAction: { action: action.action, transferTo: action.transferTo },
      }));

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
