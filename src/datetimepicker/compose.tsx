/*
 * @Author: Huangjs
 * @Date: 2022-11-14 14:47:03
 * @LastEditors: Huangjs
 * @LastEditTime: 2022-12-09 17:04:41
 * @Description: ******
 */
import React, { useMemo, useCallback } from 'react';
import { StyleSheet, Platform, View } from 'react-native';
import RNDateTimePicker, {
  IOSNativeProps,
} from '@react-native-community/datetimepicker';
import DateTimePickerAndroid from './datetime';
import { DateTimePickerProps, ChangeEvent } from './index';
import { useDerivedState } from './useDerivedState';
import { getValidDate, fixTimeZoneOffset, fixDateTimeRange } from './common';

const DateTimePicker =
  Platform.OS === 'android' ? DateTimePickerAndroid : RNDateTimePicker;

function ComposeDateTimePicker(
  props: DateTimePickerProps | IOSNativeProps | any,
) {
  const {
    style,
    onChange,
    value,
    minimumDate,
    maximumDate,
    timeZoneOffsetInMinutes,
    minuteInterval,
    ...restProps
  } = props;
  if (!(value instanceof Date)) {
    throw new Error('A date or time must be specified as `value` prop');
  }
  // 可以受控可以非受控
  const [currentDate, setCurrentDate] = useDerivedState<Date>(value);
  // 修正时区值
  const tzoim = useMemo(
    () => fixTimeZoneOffset(timeZoneOffsetInMinutes),
    [timeZoneOffsetInMinutes],
  );
  // 修正最大最小时间
  const dateRange = useMemo(
    () => fixDateTimeRange(minimumDate, maximumDate, false),
    [minimumDate, maximumDate],
  );
  // 修正传入的value
  const selectDate = useMemo(() => {
    let tempDate = getValidDate(
      new Date(currentDate).getTime(),
      dateRange,
      false,
    );
    // 调整时区偏移量
    tempDate = new Date(tempDate.setMinutes(tempDate.getMinutes() + tzoim));
    // 计算minuteInterval，将分更改为minuteInterval的倍数
    tempDate = new Date(
      tempDate.setMinutes(
        tempDate.getMinutes() - (tempDate.getMinutes() % (minuteInterval || 1)),
      ),
    );
    // 时间忽略毫秒数
    return new Date(tempDate.setMilliseconds(0));
  }, [currentDate, dateRange, tzoim, minuteInterval]);
  const _onChange = useCallback(
    (event: ChangeEvent, dt: Date, key: string) => {
      let year = selectDate.getFullYear();
      let month = selectDate.getMonth();
      let date = selectDate.getDate();
      let hour = selectDate.getHours();
      let minute = selectDate.getMinutes();
      let second = selectDate.getSeconds();
      let millisecond = selectDate.getMilliseconds();
      if (key === 'date') {
        year = dt.getFullYear();
        month = dt.getMonth();
        date = dt.getDate();
      } else if (key === 'time') {
        hour = dt.getHours();
        minute = dt.getMinutes();
        second = dt.getSeconds();
        millisecond = dt.getMilliseconds();
      }
      let tempDate = new Date(
        year,
        month,
        date,
        hour,
        minute,
        second,
        millisecond,
      );
      // 如果选择的时间跟之前时间一样，则不触发onChange事件，也不更新
      if (tempDate.getTime() === selectDate.getTime()) {
        return;
      }
      tempDate = getValidDate(
        tempDate.setMinutes(tempDate.getMinutes() - tzoim), // 调回时区偏移量
        dateRange,
        false,
      );
      const unifiedEvent = {
        ...event,
        nativeEvent: {
          ...event.nativeEvent,
          timestamp: tempDate.getTime(),
        },
      };
      onChange && onChange(unifiedEvent, tempDate);
      setCurrentDate(tempDate);
    },
    [onChange, selectDate, setCurrentDate, dateRange, tzoim],
  );
  const aMinWidth = restProps.locale === 'zh-Hans' ? 134 : 148;
  const delt = restProps.locale === 'zh-Hans' ? 36 : 30;
  const bMinWidth = 40 + (restProps.is24Hour ? 0 : delt);
  return (
    <View style={StyleSheet.flatten([styles.wrapper, style])}>
      <DateTimePicker
        {...restProps}
        style={StyleSheet.flatten([styles.flexA, { minWidth: aMinWidth }])}
        cyclic
        display="spinner"
        mode="date"
        onChange={(e: ChangeEvent, d: Date) => _onChange(e, d, 'date')}
        value={selectDate}
      />
      <DateTimePicker
        {...restProps}
        style={StyleSheet.flatten([styles.flexB, { minWidth: bMinWidth }])}
        cyclic
        display="spinner"
        mode="time"
        onChange={(e: ChangeEvent, t: Date) => _onChange(e, t, 'time')}
        value={selectDate}
        minuteInterval={minuteInterval}
      />
    </View>
  );
}

export default ComposeDateTimePicker;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
  },
  flexA: { flex: 1, marginRight: 16 },
  flexB: { flex: 1 },
});
