/*
 * @Author: Huangjs
 * @Date: 2022-11-23 14:22:25
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-01-17 16:25:44
 * @Description: ******
 */
import React from 'react';

type Param<T> = { value: T };
export function useDerivedState<D>(vv: D): [D, (v: D) => void] {
  const preValueRef = React.useRef<D>(vv);
  const [value, setValue] = React.useState<Param<D>>({ value: vv });
  let mergedValue: D = value.value;
  if (vv !== preValueRef.current) {
    preValueRef.current = vv;
    mergedValue = vv;
  }
  const changeState = React.useCallback<(v: D) => void>(
    (v: D) => setValue({ value: v }),
    [],
  );
  return [mergedValue, changeState];
}
