export type RoleName = string;

export interface Player {
  num: number;
  tags: string[];
}

export interface GameState {
  boardId: string;
  mySeat: string;
  myRole: RoleName;
  currentRound: number;
  currentPlayer: number;
  filterCurrentPlayerOnly: boolean;
  resetNonce: number;
  players: Player[];
  days: Record<number, DayData>;
}

export interface PersistedGameState {
  boardId: string;
  mySeat: string;
  myRole: RoleName;
  currentRound: number;
  currentPlayer: number;
  players: Player[];
  days: Record<number, DayData>;
  timestamp: number;
}

export interface VoteRecord {
  target: number;
  voters: number[];
}

// ============ v2 平铺时间轴数据模型 ============

export const DAY_COUNT = 5;

export type SpeechPhase =
  'sheriff' | 'daytime' | 'firstNightDeath' | 'exitSpeech';
export type PkScope = 'sheriff' | 'day';

/** 验人结果（发言者声称验了某人） */
export interface SeerCheckAction {
  target: number;
  result: '金水' | '查杀';
  reason?: string;
}

/** 银水动作（发言者声称某人是银水） */
export interface SilverWaterAction {
  target: number;
  reason?: string;
}

/** 毒动作（发言者声称女巫毒了某人） */
export interface PoisonAction {
  target: number;
  reason?: string;
}

/** 立场动作（发言者对某人表态），type 从 STANCE_OPTIONS 配置中取值 */
export interface StanceAction {
  type: string;
  targets?: number[];
  reason?: string;
}

/** 建议动作（发言者提出的带目标建议），type 从 SUGGESTION_OPTIONS 配置中取值 */
export interface SuggestionAction {
  type: string;
  targets?: number[];
  reason?: string;
}

/** 发言者声称的板子专属动作（守人/赠技能/决斗/验牌等） */
export interface ClaimRecord {
  id: string;
  kind: string;
  target?: number;
  targets?: number[];
  detail?: string;
}

/** 单张发言卡片的完整结构化数据 */
export interface SpeechCardData {
  seerCheck?: SeerCheckAction;
  silverWater?: SilverWaterAction;
  poison?: PoisonAction;
  claimedIdentity?: string[];
  badgeFlow?: number[];
  claims?: ClaimRecord[];
  stances?: StanceAction[];
  suggestions?: SuggestionAction[];
  notes?: string;
}

export interface SpeechOrderConfig {
  firstSpeaker: number;
  direction: '正序' | '逆序';
  source: '系统决定' | '警长决定';
}

export type NightDeathInfo =
  { type: 'peace' } | { type: 'deaths'; players: number[] };

export type EliminationResult =
  | { type: 'exiled'; player: number; skillTrigger?: string }
  /** 警长竞选 PK：只选出警长，不出局任何人 */
  | { type: 'elected'; player: number }
  | { type: 'tied_again' };

/** 平票 PK 轮次数据（警长竞选或白天投票平票后触发） */
export interface PkRoundData {
  players: number[];
  speeches: Record<number, SpeechCardData>;
  voteRecords?: VoteRecord[];
  result?: EliminationResult;
}

export interface SheriffData {
  candidates: number[];
  speechOrder?: SpeechOrderConfig;
  speeches: Record<number, SpeechCardData>;
  voteRecords?: VoteRecord[];
  result?:
    | { type: 'elected'; player: number }
    | { type: 'tied_pk' }
    | { type: 'badge_lost' }
    | { type: 'aborted' };
  pkRounds?: PkRoundData[];
}

export interface DaytimeData {
  speechOrder?: SpeechOrderConfig;
  speeches: Record<number, SpeechCardData>;
}

export interface DayVoteData {
  records?: VoteRecord[];
  result?:
    | { type: 'exiled'; player: number; skillTrigger?: string }
    | { type: 'tied_pk' };
}

export type MentionScene =
  | 'sheriff'
  | 'sheriffPk'
  | 'daytime'
  | 'dayPk'
  | 'firstNightDeath'
  | 'exitSpeech'
  | 'candidacy'
  | 'sheriffVote'
  | 'dayVote'
  | 'pkVote'
  | 'badge'
  | 'nightDeath'
  | 'dayDeath';

/** 反向查询：某个目标玩家在第几天、哪个环节、被谁、如何提及。speaker 为空表示系统事件或自身行为 */
export interface PlayerMention {
  day: number;
  scene: MentionScene;
  round?: number;
  speaker?: number;
  target: number;
  action: string;
  reason?: string;
}

export interface DayData {
  nightDeath?: NightDeathInfo;
  sheriff?: SheriffData;
  /** 旧存档字段，仅用于迁移 */
  firstNightDeathSpeech?: { player: number; card: SpeechCardData };
  firstNightDeathSpeeches?: Record<number, SpeechCardData>;
  daytime: DaytimeData;
  dayVote?: DayVoteData;
  pkRounds?: PkRoundData[];
  /** 旧存档字段，仅用于迁移 */
  exitSpeech?: { player: number; card: SpeechCardData };
  exitSpeeches?: Record<number, SpeechCardData>;
  dayDeaths?: number[];
  badgeAction?: { action: '移交' | '撕警徽'; transferTo?: number };
}
