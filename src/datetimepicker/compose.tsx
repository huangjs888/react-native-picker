/*
 * @Author: Huangjs
 * @Date: 2022-11-14 14:47:03
 * @LastEditors: Huangjs
 * @LastEditTime: 2022-11-23 16:53:16
 * @Description: ******
 */
import React, { useMemo, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import DateTimePickerIOS from '@react-native-community/datetimepicker';
import DateTimePickerAndroid from './datetime';
import { useDerivedState } from './useDerivedState';
import { getValidDate, fixTimeZoneOffset, fixDateTimeRange } from './common';

const DateTimePicker =
  Platform.OS === 'android' ? DateTimePickerAndroid : DateTimePickerIOS;

function ComposeDateTimePicker(props) {
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
  if (!value) {
    throw new Error('A date or time must be specified as `value` prop');
  }
  // 可以受控可以非受控
  const [currentDate, setCurrentDate] = useDerivedState(value);
  // 修正时区值
  const tzoim = useMemo(
    () => fixTimeZoneOffset(timeZoneOffsetInMinutes, value.getTimezoneOffset()),
    [value, timeZoneOffsetInMinutes],
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
    (event, dt, key) => {
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
      let timeStamp = new Date(
        year,
        month,
        date,
        hour,
        minute,
        second,
        millisecond,
      );
      // 如果选择的时间跟之前时间一样，则不触发onChange事件，也不更新
      if (timeStamp === selectDate.getTime()) {
        return;
      }
      // 调回时区偏移量
      timeStamp = new Date(timeStamp).setMinutes(
        new Date(timeStamp).getMinutes() - tzoim,
      );
      const tempDate = getValidDate(timeStamp, dateRange, false);
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
  return (
    <View style={StyleSheet.flatten([styles.wrapper, style])}>
      <DateTimePicker
        {...restProps}
        display="spinner"
        mode="date"
        onChange={(e, d) => _onChange(e, d, 'date')}
        value={selectDate}
      />
      <DateTimePicker
        {...restProps}
        display="spinner"
        mode="time"
        onChange={(e, t) => _onChange(e, t, 'time')}
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
    flex: 1,
  },
});
