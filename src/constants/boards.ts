export type RoleTeam = 'good' | 'wolf';

export interface BoardRole {
  name: string;
  team: RoleTeam;
}

export type ClaimActionType =
  'seerCheck' | 'poison' | 'silverWater' | 'badgeFlow' | 'claim';

export interface ClaimActionConfig {
  label: string;
  type: ClaimActionType;
  targetMode: 'single' | 'multi';
  details?: string[];
  className: string;
}

export interface BoardConfig {
  id: string;
  name: string;
  subtitle: string;
  roles: BoardRole[];
  claimActions: ClaimActionConfig[];
  suggestRoles: string[];
}

export const DEFAULT_BOARD_ID = 'standard';

const RED =
  'border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold';
const GREEN =
  'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold';
const PURPLE =
  'border-purple-300 bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold';
const AMBER =
  'border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 font-bold';
const SKY = 'border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold';

const act = (
  label: string,
  type: ClaimActionType,
  className: string,
  extra: Partial<ClaimActionConfig> = {},
): ClaimActionConfig => ({
  label,
  type,
  targetMode: 'single',
  className,
  ...extra,
});

const SEER_ACTIONS = [
  act('查杀', 'seerCheck', RED),
  act('金水', 'seerCheck', GREEN),
];
const POISON = act('毒', 'poison', PURPLE);
const SILVER = act('银水', 'silverWater', GREEN);
const BADGE = act('警徽流', 'badgeFlow', AMBER, { targetMode: 'multi' });
const GUARD = act('守人', 'claim', SKY, { targetMode: 'multi' });
const SHOOT = act('开枪', 'claim', RED);

const good = (name: string): BoardRole => ({ name, team: 'good' });
const wolf = (name: string): BoardRole => ({ name, team: 'wolf' });

export const BOARDS: BoardConfig[] = [
  {
    id: 'standard',
    name: '标准场',
    subtitle: '四民 · 四狼 · 预女猎愚 · 警徽流',
    roles: [
      good('预言家'),
      good('女巫'),
      good('猎人'),
      good('愚者'),
      good('平民'),
      wolf('狼人'),
    ],
    claimActions: [...SEER_ACTIONS, POISON, SILVER, BADGE, SHOOT],
    suggestRoles: ['预言家', '女巫', '猎人'],
  },
  {
    id: 'merchant',
    name: '奇迹商人',
    subtitle: '四民 · 狼王+三狼 · 预女守商 · 警徽流',
    roles: [
      good('预言家'),
      good('女巫'),
      good('守卫'),
      good('奇迹商人'),
      good('平民'),
      wolf('狼王'),
      wolf('狼人'),
    ],
    claimActions: [
      ...SEER_ACTIONS,
      POISON,
      SILVER,
      BADGE,
      GUARD,
      act('赠技能', 'claim', PURPLE, { details: ['查验', '毒药', '守护'] }),
      SHOOT,
    ],
    suggestRoles: ['预言家', '女巫', '守卫'],
  },
  {
    id: 'knight',
    name: '觉醒骑士',
    subtitle: '四民 · 狼美人+三狼 · 预女守骑 · 警徽流',
    roles: [
      good('预言家'),
      good('女巫'),
      good('觉醒守卫'),
      good('觉醒骑士'),
      good('平民'),
      wolf('觉醒狼美人'),
      wolf('狼人'),
    ],
    claimActions: [
      ...SEER_ACTIONS,
      POISON,
      SILVER,
      BADGE,
      GUARD,
      act('决斗', 'claim', RED, { details: ['狼', '好人'] }),
      act('魅惑', 'claim', PURPLE),
    ],
    suggestRoles: ['预言家', '女巫', '觉醒守卫', '觉醒骑士'],
  },
  {
    id: 'mirror',
    name: '镜隐迷踪',
    subtitle: '四民 · 隐狼+三狼 · 镜女猎守 · 警徽流',
    roles: [
      good('魔镜少女'),
      good('女巫'),
      good('猎人'),
      good('守卫'),
      good('平民'),
      wolf('觉醒隐狼'),
      wolf('狼人'),
    ],
    claimActions: [
      act('验牌', 'claim', GREEN, {
        details: [
          '魔镜少女',
          '女巫',
          '猎人',
          '守卫',
          '平民',
          '觉醒隐狼',
          '狼人',
        ],
      }),
      POISON,
      SILVER,
      BADGE,
      GUARD,
      act('模仿', 'claim', PURPLE, {
        details: ['魔镜少女', '女巫', '猎人', '守卫', '平民', '狼人'],
      }),
      SHOOT,
    ],
    suggestRoles: ['魔镜少女', '女巫', '猎人', '守卫'],
  },
];

export const getBoard = (id: string | undefined): BoardConfig =>
  BOARDS.find((b) => b.id === id) ?? BOARDS[0];
