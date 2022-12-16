/*
 * @Author: Huangjs
 * @Date: 2022-11-14 14:47:03
 * @LastEditors: Huangjs
 * @LastEditTime: 2022-12-16 13:49:36
 * @Description: ******
 */
import React, { useMemo, useCallback } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import DateTimePicker, {
  type DateTimeAndroidProps,
  type DateTimeIOSProps,
  type DateTimePickerEvent,
} from './index';
import { useDerivedState } from './useDerivedState';
import { getValidDate, fixTimeZoneOffset, fixDateTimeRange } from './common';

function Compose(props: any) {
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
    (event: DateTimePickerEvent, key: string, dt?: Date) => {
      if (!dt || !event.nativeEvent.timestamp) {
        return;
      }
      const newDate = dt || new Date(event.nativeEvent.timestamp);
      let year = selectDate.getFullYear();
      let month = selectDate.getMonth();
      let date = selectDate.getDate();
      let hour = selectDate.getHours();
      let minute = selectDate.getMinutes();
      let second = selectDate.getSeconds();
      let millisecond = selectDate.getMilliseconds();
      if (key === 'date') {
        year = newDate.getFullYear();
        month = newDate.getMonth();
        date = newDate.getDate();
      } else if (key === 'time') {
        hour = newDate.getHours();
        minute = newDate.getMinutes();
        second = newDate.getSeconds();
        millisecond = newDate.getMilliseconds();
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
      const unifiedEvent: DateTimePickerEvent = {
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
        onChange={(e: DateTimePickerEvent, d?: Date) => _onChange(e, 'date', d)}
        value={selectDate}
      />
      <DateTimePicker
        {...restProps}
        style={StyleSheet.flatten([styles.flexB, { minWidth: bMinWidth }])}
        cyclic
        display="spinner"
        mode="time"
        onChange={(e: DateTimePickerEvent, t?: Date) => _onChange(e, 'time', t)}
        value={selectDate}
        minuteInterval={minuteInterval}
      />
    </View>
  );
}

function ComposeIOS(props: DateTimeIOSProps) {
  return <Compose {...props} />;
}

function ComposeAndroid(props: DateTimeAndroidProps) {
  return <Compose {...props} />;
}

export default Platform.OS === 'ios' ? ComposeIOS : ComposeAndroid;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
  },
  flexA: { flex: 1, marginRight: 16 },
  flexB: { flex: 1 },
});
