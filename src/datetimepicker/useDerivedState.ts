/*
 * @Author: Huangjs
 * @Date: 2022-11-23 14:22:25
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-09-13 16:00:53
 * @Description: ******
 */
import React from 'react';

export function useChanged<T>(
  value: T,
  compare = (prev: T | void, next: T) => prev !== next,
): boolean {
  const propsRef = React.useRef<T>(value);
  const changed = compare(propsRef.current, value);
  if (changed) {
    propsRef.current = value;
  }
  return changed;
}

export function useForceUpdate() {
  const setState = React.useState({})[1];
  return React.useCallback(() => setState({}), [setState]);
}

type Updater<T> = (updater: T | ((origin: T) => T)) => void;
export function useDerivedState<T>(
  value: T,
  useCompare = (prev: T, next: T) => (useChanged(next) ? next : prev),
): [T, Updater<T>] {
  const nowValueRef = React.useRef<T>(value);
  nowValueRef.current = useCompare(nowValueRef.current, value);
  const forceUpdate = useForceUpdate();
  const updateValue: Updater<T> = React.useCallback(
    (v) => {
      const _value =
        typeof v === 'function'
          ? (v as (origin: T) => T)(nowValueRef.current)
          : v;
      // 是否需要比较？
      if (_value !== nowValueRef.current) {
        nowValueRef.current = _value;
        forceUpdate();
      }
    },
    [forceUpdate],
  );
  return [nowValueRef.current, updateValue];
}
