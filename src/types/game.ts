export const PLAYER_COUNT = 12;

export type RoleName =
  '未知' | '预言家' | '女巫' | '猎人' | '愚者' | '平民' | '狼人';

export interface Player {
  num: number;
  tags: string[];
}

export type LogType =
  'speech' | 'divider' | 'night_death' | 'police_registry' | 'vote_record';

export interface LogEntry {
  id: string;
  type: LogType;
  player?: number;
  round?: number;
  time?: string;
  content?: string;
  title?: string;
  sceneTitle?: string;
}

export interface GameState {
  mySeat: string;
  myRole: RoleName;
  currentRound: number;
  currentPlayer: number;
  filterCurrentPlayerOnly: boolean;
  players: Player[];
  currentSpeechChips: string[];
  logs: LogEntry[];
}

export interface PersistedGameState {
  mySeat: string;
  myRole: RoleName;
  currentRound: number;
  currentPlayer: number;
  players: Player[];
  logs: LogEntry[];
  timestamp: number;
}

export type PickerMode = 'single' | 'multi';
export type PickerOrder = 'num-first' | 'word-first';

export interface PickerConfig {
  word: string;
  order: PickerOrder;
  mode: PickerMode;
  title?: string;
  hint?: string;
}

export type VoteScene = 'sheriff' | 'exile' | 'pk';

export interface VoteRecord {
  target: number;
  voters: number[];
}
