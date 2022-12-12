/*
 * @Author: Huangjs
 * @Date: 2022-11-23 14:22:25
 * @LastEditors: Huangjs
 * @LastEditTime: 2022-12-09 16:12:13
 * @Description: ******
 */
import React from 'react';

export function useDerivedState<D>(vv: D): [D, (v: D) => void] {
  const preValueRef = React.useRef<D>(vv);
  const [value, setValue] = React.useState<D>(vv);
  let mergedValue = value;
  if (vv !== preValueRef.current) {
    preValueRef.current = vv;
    mergedValue = vv;
  }
  const changeState = React.useCallback<(v: D) => void>(
    (v: D) => setValue(v),
    [],
  );
  return [mergedValue, changeState];
}
