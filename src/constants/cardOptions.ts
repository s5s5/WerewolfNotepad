import type { BoardConfig } from './boards';

export type TargetMode = 'single' | 'multi';

export interface ActionOption {
  label: string;
  needsTarget: boolean;
  targetMode?: TargetMode;
  className: string;
}

const SLATE_CLASS =
  'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200';
const PURPLE_CLASS =
  'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100';

export const getClaimedIdentityOptions = (
  board: BoardConfig,
): ActionOption[] => {
  const goodRoles = board.roles.filter((r) => r.team === 'good');
  const [seer, ...others] = goodRoles;
  const ordered = [
    ...others.filter((r) => r.name === '平民'),
    ...others.filter((r) => r.name !== '平民'),
  ];
  return [
    {
      label: `跳${seer.name}`,
      needsTarget: false,
      className: PURPLE_CLASS,
    },
    { label: '好人', needsTarget: false, className: SLATE_CLASS },
    {
      label: '强神',
      needsTarget: false,
      className: 'bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100',
    },
    ...ordered.map((r) => ({
      label: r.name,
      needsTarget: false,
      className: r.name === '平民' ? SLATE_CLASS : PURPLE_CLASS,
    })),
    {
      label: '自认狼',
      needsTarget: false,
      className:
        'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100 font-semibold',
    },
  ];
};

export const STANCE_OPTIONS: ActionOption[] = [
  {
    label: '站边',
    needsTarget: true,
    targetMode: 'single',
    className:
      'bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100 font-medium',
  },
  {
    label: '踩',
    needsTarget: true,
    targetMode: 'multi',
    className: 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100',
  },
  {
    label: '保',
    needsTarget: true,
    targetMode: 'multi',
    className: 'bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100',
  },
  {
    label: '不站边',
    needsTarget: false,
    className:
      'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200',
  },
  {
    label: '聊情绪',
    needsTarget: false,
    className: 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100',
  },
  {
    label: '快速过麦',
    needsTarget: false,
    className:
      'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200',
  },
  {
    label: '好人是',
    needsTarget: true,
    targetMode: 'multi',
    className:
      'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100',
  },
  {
    label: '狼是',
    needsTarget: true,
    targetMode: 'multi',
    className:
      'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100 font-semibold',
  },
  {
    label: '狼疑是',
    needsTarget: true,
    targetMode: 'multi',
    className: 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100',
  },
  {
    label: '自定义',
    needsTarget: true,
    targetMode: 'multi',
    className:
      'bg-fuchsia-50 text-fuchsia-800 border-fuchsia-200 hover:bg-fuchsia-100 font-medium',
  },
];

/** 常点原因预设，供 ReasonPicker 展示为快捷标签 */
export const COMMON_REASONS = [
  '逻辑问题',
  '发言水',
  '位置学',
  '悍跳',
  '心态崩',
  '抢麦',
  '投票诡异',
  '带节奏',
];

export const SUGGESTION_OPTIONS: ActionOption[] = [
  {
    label: '建议归票',
    needsTarget: true,
    targetMode: 'single',
    className:
      'bg-indigo-50 text-indigo-800 border-indigo-200 hover:bg-indigo-100 font-medium',
  },
  {
    label: '建议出',
    needsTarget: true,
    targetMode: 'single',
    className:
      'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100 font-medium',
  },
  {
    label: '建议撕警徽',
    needsTarget: false,
    className:
      'bg-orange-50 text-orange-800 border-orange-200 hover:bg-orange-100 font-semibold',
  },
  {
    label: '建议PK',
    needsTarget: false,
    className:
      'bg-orange-50 text-orange-800 border-orange-200 hover:bg-orange-100',
  },
];

export interface RoleSuggestVerb {
  verb: string;
  multi?: boolean;
}

export const ROLE_SUGGEST_VERBS: Record<string, RoleSuggestVerb[]> = {
  预言家: [{ verb: '验' }],
  魔镜少女: [{ verb: '验' }],
  女巫: [{ verb: '毒' }, { verb: '救' }],
  猎人: [{ verb: '带' }],
  守卫: [{ verb: '守' }],
  觉醒守卫: [{ verb: '守' }],
  觉醒骑士: [{ verb: '决斗', multi: true }],
};

export const BADGE_SUGGEST_OPTION: ActionOption = {
  label: '建议警徽给',
  needsTarget: true,
  targetMode: 'single',
  className:
    'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100 font-medium',
};
