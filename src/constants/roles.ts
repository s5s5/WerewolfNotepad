export const PLAYER_COUNT = 12;
export const STORAGE_KEY = 'werewolf_notebook_standard_12';

export const SEAT_OPTIONS = Array.from({ length: PLAYER_COUNT }, (_, i) =>
  String(i + 1),
);

export const DEATH_TAG = '已倒牌';
export const FOOL_IMMUNE_TAG = '愚者翻牌免死';
export const POLICE_CANDIDATE_TAG = '上警竞选';
