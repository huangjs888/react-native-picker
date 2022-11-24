/*
 * @Author: Huangjs
 * @Date: 2022-11-23 14:22:25
 * @LastEditors: Huangjs
 * @LastEditTime: 2022-11-23 15:07:18
 * @Description: ******
 */
import React from 'react';

export const useDerivedState = (vv) => {
  const preValueRef = React.useRef(vv);
  const [value, setValue] = React.useState(vv);
  let mergedValue = value;
  if (vv !== preValueRef.current) {
    preValueRef.current = vv;
    mergedValue = vv;
  }
  const changeState = React.useCallback((v) => setValue(v), []);
  return [mergedValue, changeState];
};
