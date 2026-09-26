import type { TagOption } from './tags';
import { ACTION_TAGS, ROLE_TAGS, STATUS_TAGS } from './tags';

export type TargetMode = 'single' | 'multi';

export interface ActionOption {
  label: string;
  needsTarget: boolean;
  targetMode?: TargetMode;
  className: string;
}

export const CLAIMED_IDENTITY_OPTIONS: ActionOption[] = [
  {
    label: '跳预言家',
    needsTarget: false,
    className:
      'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100',
  },
  {
    label: '平民',
    needsTarget: false,
    className: 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200',
  },
  {
    label: '女巫',
    needsTarget: false,
    className:
      'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100',
  },
  {
    label: '猎人',
    needsTarget: false,
    className:
      'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100',
  },
  {
    label: '愚者',
    needsTarget: false,
    className:
      'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100',
  },
  {
    label: '强神',
    needsTarget: false,
    className:
      'bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100',
  },
  {
    label: '划水',
    needsTarget: false,
    className: 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200',
  },
  {
    label: '自认狼',
    needsTarget: false,
    className: 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100 font-semibold',
  },
];

export const STANCE_OPTIONS: ActionOption[] = [
  {
    label: '站边',
    needsTarget: true,
    targetMode: 'single',
    className: 'bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100 font-medium',
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
    className: 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200',
  },
  {
    label: '没站边',
    needsTarget: false,
    className: 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200',
  },
  {
    label: '认好人',
    needsTarget: true,
    targetMode: 'multi',
    className: 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100',
  },
  {
    label: '认狼',
    needsTarget: true,
    targetMode: 'multi',
    className: 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100 font-semibold',
  },
  {
    label: '疑狼',
    needsTarget: true,
    targetMode: 'multi',
    className: 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100',
  },
];

export const SUGGESTION_OPTIONS: ActionOption[] = [
  {
    label: '建议归票',
    needsTarget: true,
    targetMode: 'single',
    className: 'bg-indigo-50 text-indigo-800 border-indigo-200 hover:bg-indigo-100 font-medium',
  },
  {
    label: '建议出',
    needsTarget: true,
    targetMode: 'single',
    className: 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100 font-medium',
  },
  {
    label: '建议撕警徽',
    needsTarget: false,
    className: 'bg-orange-50 text-orange-800 border-orange-200 hover:bg-orange-100 font-semibold',
  },
  {
    label: '建议PK',
    needsTarget: false,
    className: 'bg-orange-50 text-orange-800 border-orange-200 hover:bg-orange-100',
  },
];

export const SEER_RESULT_OPTIONS = ['金水', '查杀'] as const;

export interface BoardConfig {
  name: string;
  playerCount: number;
  roles: string[];
  claimedIdentityOptions: ActionOption[];
  stanceOptions: ActionOption[];
  suggestionOptions: ActionOption[];
  seerResultOptions: readonly string[];
  roleTags: TagOption[];
  statusTags: TagOption[];
  actionTags: TagOption[];
}

export const STANDARD_FOOL_BOARD: BoardConfig = {
  name: '12人标准愚者板',
  playerCount: 12,
  roles: ['预言家', '女巫', '猎人', '愚者', '平民', '狼人'],
  claimedIdentityOptions: CLAIMED_IDENTITY_OPTIONS,
  stanceOptions: STANCE_OPTIONS,
  suggestionOptions: SUGGESTION_OPTIONS,
  seerResultOptions: SEER_RESULT_OPTIONS,
  roleTags: ROLE_TAGS,
  statusTags: STATUS_TAGS,
  actionTags: ACTION_TAGS,
};
