import type { BoardConfig } from './boards';
import { FOOL_IMMUNE_TAG } from './roles';

export interface TagOption {
  label: string;
  className: string;
}

const GOOD_ROLE_CLASS =
  'bg-slate-100 hover:bg-indigo-50 text-slate-700 border-slate-200';
const WOLF_ROLE_CLASS =
  'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200';

export const getRoleTags = (board: BoardConfig): TagOption[] => [
  ...board.roles.map((r) => ({
    label: r.name,
    className: r.team === 'wolf' ? WOLF_ROLE_CLASS : GOOD_ROLE_CLASS,
  })),
  { label: '悍跳狼', className: WOLF_ROLE_CLASS },
];

export const STATUS_TAGS: TagOption[] = [
  {
    label: '金水',
    className:
      'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200',
  },
  {
    label: '银水',
    className:
      'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200',
  },
  {
    label: '查杀',
    className: 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200',
  },
  {
    label: '疑似好人',
    className: 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200',
  },
  {
    label: '进狼坑',
    className: 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200',
  },
  {
    label: '焦点位',
    className: 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200',
  },
];

const ALL_ACTION_TAGS: TagOption[] = [
  {
    label: '上警竞选',
    className: 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200',
  },
  {
    label: '已退水',
    className:
      'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200',
  },
  {
    label: '快速过麦',
    className:
      'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200',
  },
  {
    label: '愚者翻牌免死',
    className:
      'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200',
  },
  {
    label: '狼人自爆',
    className: 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200',
  },
  {
    label: '已倒牌',
    className:
      'bg-slate-200 hover:bg-slate-300 text-slate-800 border-slate-300 font-semibold',
  },
  {
    label: '中刀',
    className: 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200',
  },
  {
    label: '吃毒',
    className:
      'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200',
  },
  {
    label: '吃枪',
    className:
      'bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200',
  },
  {
    label: '被放逐',
    className:
      'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200',
  },
];

export const getActionTags = (board: BoardConfig): TagOption[] =>
  board.id === 'standard'
    ? ALL_ACTION_TAGS
    : ALL_ACTION_TAGS.filter((t) => t.label !== FOOL_IMMUNE_TAG);
