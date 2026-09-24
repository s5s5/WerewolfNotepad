import type { PickerMode, PickerOrder } from '../types/game';

export interface WordChip {
  label: string;
  className: string;
}

export interface PickerWordChip {
  label: string;
  className: string;
  mode: PickerMode;
  order: PickerOrder;
}

export const PUNCTUATION_CHIPS: WordChip[] = [
  {
    label: '；',
    className: 'bg-slate-200 text-slate-800 font-bold hover:bg-slate-300',
  },
  {
    label: '，',
    className: 'bg-slate-200 text-slate-800 font-bold hover:bg-slate-300',
  },
  {
    label: '和',
    className: 'bg-slate-200 text-slate-800 font-bold hover:bg-slate-300',
  },
  {
    label: '换行',
    className: 'bg-slate-200 text-slate-800 font-bold hover:bg-slate-300',
  },
];

export const SELF_CLAIM_CHIPS: WordChip[] = [
  {
    label: '我是预言家',
    className:
      'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100',
  },
  {
    label: '我是女巫',
    className:
      'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100',
  },
  {
    label: '我是猎人',
    className:
      'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100',
  },
  {
    label: '我是愚者',
    className:
      'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100',
  },
  {
    label: '我是平民',
    className:
      'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100',
  },
  {
    label: '我是好人',
    className:
      'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100',
  },
  {
    label: '我是神',
    className:
      'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100',
  },
  {
    label: '我是狼人',
    className:
      'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100 font-semibold',
  },
];

export const JUDGE_IDENTITY_CHIPS: PickerWordChip[] = [
  {
    label: '是预言家',
    className:
      'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100 font-medium',
    mode: 'single',
    order: 'num-first',
  },
  {
    label: '是女巫',
    className:
      'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100 font-medium',
    mode: 'single',
    order: 'num-first',
  },
  {
    label: '是猎人',
    className:
      'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100 font-medium',
    mode: 'single',
    order: 'num-first',
  },
  {
    label: '是愚者',
    className:
      'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100 font-medium',
    mode: 'single',
    order: 'num-first',
  },
  {
    label: '是平民',
    className:
      'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200',
    mode: 'single',
    order: 'num-first',
  },
  {
    label: '是好人',
    className:
      'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100 font-medium',
    mode: 'single',
    order: 'num-first',
  },
  {
    label: '是金水',
    className:
      'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100 font-medium',
    mode: 'single',
    order: 'num-first',
  },
  {
    label: '是银水',
    className:
      'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100',
    mode: 'single',
    order: 'num-first',
  },
  {
    label: '是查杀',
    className:
      'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100 font-medium',
    mode: 'single',
    order: 'num-first',
  },
  {
    label: '是狼人',
    className:
      'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100 font-semibold',
    mode: 'single',
    order: 'num-first',
  },
  {
    label: '是坏人',
    className:
      'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100 font-medium',
    mode: 'single',
    order: 'num-first',
  },
  {
    label: '是划水',
    className:
      'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200',
    mode: 'single',
    order: 'num-first',
  },
];

export const STANCE_CHIPS: PickerWordChip[] = [
  {
    label: '站边',
    className:
      'bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100 font-medium',
    mode: 'single',
    order: 'word-first',
  },
  {
    label: '死站边',
    className: 'bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100',
    mode: 'single',
    order: 'word-first',
  },
  {
    label: '怀疑',
    className: 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100',
    mode: 'single',
    order: 'word-first',
  },
  {
    label: '不信',
    className:
      'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200',
    mode: 'single',
    order: 'word-first',
  },
  {
    label: '保下',
    className: 'bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100',
    mode: 'multi',
    order: 'word-first',
  },
  {
    label: '猛打',
    className: 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100',
    mode: 'multi',
    order: 'word-first',
  },
  {
    label: '认下',
    className:
      'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200',
    mode: 'multi',
    order: 'word-first',
  },
  {
    label: '要出',
    className: 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100',
    mode: 'multi',
    order: 'word-first',
  },
];

export const SEER_POLICE_PICKER_CHIPS: PickerWordChip[] = [
  {
    label: '昨晚验了',
    className: 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100',
    mode: 'single',
    order: 'word-first',
  },
  {
    label: '第1晚验了',
    className: 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100',
    mode: 'single',
    order: 'word-first',
  },
  {
    label: '第2晚验了',
    className: 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100',
    mode: 'single',
    order: 'word-first',
  },
  {
    label: '第一警徽流',
    className: 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100',
    mode: 'single',
    order: 'word-first',
  },
  {
    label: '第二警徽流',
    className: 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100',
    mode: 'single',
    order: 'word-first',
  },
  {
    label: '飞警徽',
    className:
      'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100 font-semibold',
    mode: 'single',
    order: 'word-first',
  },
];

export const SEER_POLICE_WORD_CHIPS: WordChip[] = [
  {
    label: '撕警徽',
    className:
      'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100 font-semibold',
  },
  {
    label: '顺序发言',
    className:
      'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200',
  },
  {
    label: '逆序发言',
    className:
      'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200',
  },
];

export const GOD_SKILL_PICKER_CHIPS: PickerWordChip[] = [
  {
    label: '首夜开药救',
    className: 'bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100',
    mode: 'single',
    order: 'word-first',
  },
  {
    label: '报银水是',
    className: 'bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100',
    mode: 'single',
    order: 'word-first',
  },
  {
    label: '昨晚用毒毒了',
    className: 'bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100',
    mode: 'single',
    order: 'word-first',
  },
  {
    label: '出局必带走',
    className:
      'bg-orange-50 text-orange-800 border-orange-200 hover:bg-orange-100',
    mode: 'single',
    order: 'word-first',
  },
];

export const GOD_SKILL_WORD_CHIPS: WordChip[] = [
  {
    label: '双药都在',
    className: 'bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100',
  },
  {
    label: '枪在手带弹',
    className:
      'bg-orange-50 text-orange-800 border-orange-200 hover:bg-orange-100',
  },
  {
    label: '压枪不开',
    className:
      'bg-orange-50 text-orange-800 border-orange-200 hover:bg-orange-100',
  },
  {
    label: '认愚者',
    className:
      'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100',
  },
  {
    label: '敢出我就翻牌',
    className:
      'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100',
  },
  {
    label: '翻牌免死无票',
    className:
      'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100',
  },
];

export const LOGIC_COMMENT_CHIPS: WordChip[] = [
  {
    label: '表水好',
    className:
      'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200',
  },
  {
    label: '逻辑矛盾',
    className: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100',
  },
  {
    label: '打冲锋',
    className: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100',
  },
  {
    label: '打倒钩',
    className: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100',
  },
  {
    label: '在垫飞',
    className: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
  },
  {
    label: '抗推位',
    className:
      'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200',
  },
];
