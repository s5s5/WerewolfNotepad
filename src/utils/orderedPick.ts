/** NumberPicker 多选按点击顺序维护：新增追加到末尾，取消则移除 */
export const applyOrderedPick = (
  prev: number[],
  next: number[],
  max?: number,
): number[] => {
  if (next.length > prev.length) {
    const added = next.find((n) => !prev.includes(n));
    if (added === undefined) return prev;
    if (max !== undefined && prev.length >= max) return prev;
    return [...prev, added];
  }
  return prev.filter((n) => next.includes(n));
};
