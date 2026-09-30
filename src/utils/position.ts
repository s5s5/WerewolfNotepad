import { useSyncExternalStore } from 'react';

export interface Position {
  day: number;
  stage: string;
}

let current: Position = { day: 1, stage: '' };
const listeners = new Set<() => void>();

export const setPosition = (next: Position) => {
  if (next.day === current.day && next.stage === current.stage) return;
  current = next;
  listeners.forEach((l) => l());
};

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export const usePosition = () => useSyncExternalStore(subscribe, () => current);
