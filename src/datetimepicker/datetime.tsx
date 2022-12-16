/*
 * @Author: Huangjs
 * @Date: 2022-11-08 10:42:40
 * @LastEditors: Huangjs
 * @LastEditTime: 2022-12-15 13:41:09
 * @Description: ******
 */
import React, { useRef, useMemo, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDerivedState } from './useDerivedState';
import {
  weekMap,
  weekEnMap,
  monthsMap,
  monthsAbbMap,
  maxDayCount,
  dayMilliseconds,
  minMTime,
  maxMTime,
  getValidDate,
  fixTimeZoneOffset,
  fixDateTimeRange,
} from './common';
import {
  PickerAndroid,
  PickerAndroidScrollState,
  type PickerAndroidScrollEvent,
  type PickerEvent,
} from '../picker';
import type { PickerItemProps } from '../picker/PickerItem';
import type { DateTimeAndroidProps, DateTimePickerEvent } from './index';

const minMYear = new Date(minMTime).getFullYear();
const maxMYear = new Date(maxMTime).getFullYear();

function DateTimePicker(props: DateTimeAndroidProps) {
  const {
    mode,
    onChange,
    value,
    timeZoneOffsetInMinutes,
    minuteInterval,
    minimumDate,
    maximumDate,
  } = props;
  if (!(value instanceof Date)) {
    throw new Error('A date or time must be specified as `value` prop');
  }
  // 记录选择器滚动状态
  const scrollStateRef = useRef<{ [key: string]: PickerAndroidScrollState }>(
    {},
  );
  // 记录初始时间
  const initValueRef = useRef<Date | null>(null);
  // 可以受控可以非受控
  const [currentDate, setCurrentDate] = useDerivedState<Date>(value);
  // 修正时区值
  const tzoim = useMemo(
    () => fixTimeZoneOffset(timeZoneOffsetInMinutes),
    [timeZoneOffsetInMinutes],
  );
  // 修正最大最小时间
  const dateRange = useMemo(
    () => fixDateTimeRange(minimumDate, maximumDate, mode === 'date'),
    [minimumDate, maximumDate, mode],
  );
  // 修正传入的value
  const selectDate = useMemo(() => {
    let tempDate = getValidDate(
      new Date(currentDate).getTime(),
      dateRange,
      mode === 'date',
    );
    // 将第一次传入的参数保存下来
    if (!initValueRef.current) {
      initValueRef.current = tempDate;
    }
    if (mode !== 'date') {
      // 调整时区偏移量
      tempDate = new Date(tempDate.setMinutes(tempDate.getMinutes() + tzoim));
      // 计算minuteInterval，将分更改为minuteInterval的倍数
      tempDate = new Date(
        tempDate.setMinutes(
          tempDate.getMinutes() -
            (tempDate.getMinutes() % (minuteInterval || 1)),
        ),
      );
    }
    // 时间忽略毫秒数
    return new Date(tempDate.setMilliseconds(0));
  }, [currentDate, dateRange, tzoim, minuteInterval, mode]);
  // onChange事件
  const _onChange = useCallback(
    (event: PickerEvent, key: string) => {
      if (
        Object.keys(scrollStateRef.current).find(
          (k) => scrollStateRef.current[k] !== PickerAndroidScrollState.IDLE,
        )
      ) {
        // 所有滚动器都处于静止状态时才触发事件
        return;
      }
      const itemValue = +event.nativeEvent.itemValue;
      let year = selectDate.getFullYear();
      let month = selectDate.getMonth();
      let date = selectDate.getDate();
      let hour = selectDate.getHours();
      let minute = selectDate.getMinutes();
      // 根据选择的年月日时分，修改对应的时间值
      if (key === 'year') {
        year = itemValue;
      } else if (key === 'month') {
        month = itemValue;
      } else if (key === 'date') {
        date = itemValue;
      } else if (key === 'ymdw') {
        const tmpDate = new Date(
          (initValueRef.current?.getTime() || 0) -
            (maxDayCount / 2 - itemValue) * dayMilliseconds,
        );
        year = tmpDate.getFullYear();
        month = tmpDate.getMonth();
        date = tmpDate.getDate();
      } else if (key === 'noon') {
        if (itemValue === 0 && hour >= 12) {
          hour -= 12;
        } else if (itemValue === 1 && hour < 12) {
          hour += 12;
        }
      } else if (key === 'hour') {
        hour = itemValue;
      } else if (key === 'minute') {
        minute = itemValue;
      }
      // 检查选中的日是否大于当前年月下的天数
      const count = new Date(year, month + 1, 0).getDate();
      if (date > count) {
        date = count;
      }
      let tempDate = new Date(
        year,
        month,
        date,
        hour,
        minute,
        selectDate.getSeconds(),
        selectDate.getMilliseconds(),
      );
      // 如果选择的时间跟之前时间一样，则不触发onChange事件，也不更新
      if (tempDate.getTime() === selectDate.getTime()) {
        return;
      }
      tempDate = getValidDate(
        tempDate.setMinutes(tempDate.getMinutes() - tzoim), // 调回时区偏移量
        dateRange,
        mode === 'date',
      );
      const unifiedEvent: DateTimePickerEvent = {
        type: 'set',
        nativeEvent: {
          timestamp: tempDate.getTime(),
        },
      };
      onChange && onChange(unifiedEvent, tempDate);
      setCurrentDate(tempDate);
    },
    [onChange, selectDate, setCurrentDate, dateRange, tzoim, mode],
  );
  const _onScrollStateChange = useCallback(
    (event: PickerAndroidScrollEvent, key: string) => {
      const { state } = event.nativeEvent;
      scrollStateRef.current[key] = +state;
    },
    [],
  );
  const { cyclic, is24Hour, locale } = props;
  const itemRange = useMemo(() => {
    if (!cyclic) {
      const [minDate, maxDate] = dateRange;
      return {
        minYear: minDate.getFullYear(),
        maxYear: maxDate.getFullYear(),
        minMonth:
          minDate.getFullYear() === selectDate.getFullYear()
            ? minDate.getMonth()
            : 0,
        maxMonth:
          maxDate.getFullYear() === selectDate.getFullYear()
            ? maxDate.getMonth()
            : 11,
        minDay:
          minDate.getFullYear() === selectDate.getFullYear() &&
          minDate.getMonth() === selectDate.getMonth()
            ? minDate.getDate()
            : 1,
        maxDay:
          maxDate.getFullYear() === selectDate.getFullYear() &&
          maxDate.getMonth() === selectDate.getMonth()
            ? maxDate.getDate()
            : new Date(
                selectDate.getFullYear(),
                selectDate.getMonth() + 1,
                0,
              ).getDate(),
        minHour:
          minDate.getFullYear() === selectDate.getFullYear() &&
          minDate.getMonth() === selectDate.getMonth() &&
          minDate.getDate() === selectDate.getDate()
            ? minDate.getHours()
            : 0,
        maxHour:
          maxDate.getFullYear() === selectDate.getFullYear() &&
          maxDate.getMonth() === selectDate.getMonth() &&
          maxDate.getDate() === selectDate.getDate()
            ? maxDate.getHours()
            : 23,
        minMinute:
          minDate.getFullYear() === selectDate.getFullYear() &&
          minDate.getMonth() === selectDate.getMonth() &&
          minDate.getDate() === selectDate.getDate() &&
          minDate.getHours() === selectDate.getHours()
            ? minDate.getMinutes()
            : 0,
        maxMinute:
          maxDate.getFullYear() === selectDate.getFullYear() &&
          maxDate.getMonth() === selectDate.getMonth() &&
          maxDate.getDate() === selectDate.getDate() &&
          maxDate.getHours() === selectDate.getHours()
            ? maxDate.getMinutes()
            : 59,
      };
    }
    return null;
  }, [dateRange, selectDate, cyclic]);
  // 计算选择器的items
  const dateItems = useMemo(() => {
    const items = [];
    if (mode === 'date') {
      const years = [];
      const { minYear = minMYear, maxYear = maxMYear } = itemRange || {};
      for (let i = minYear; i <= maxYear; i += 1) {
        years.push({
          value: i,
          label: locale === 'zh-Hans' ? `${i}年` : `${i}`,
        });
      }
      const months = [];
      const { minMonth = 0, maxMonth = 11 } = itemRange || {};
      for (let i = minMonth; i <= maxMonth; i += 1) {
        months.push({
          value: i,
          label: locale === 'zh-Hans' ? `${i + 1}月` : monthsMap[i],
        });
      }
      const dates = [];
      const { minDay = 1, maxDay = 31 } = itemRange || {};
      for (let i = minDay; i <= maxDay; i += 1) {
        dates.push({
          value: i,
          label: locale === 'zh-Hans' ? `${i}日` : `${i}`,
        });
      }
      items.push(
        { key: 'month', value: months },
        { key: 'date', value: dates },
      );
      const yearItem = { key: 'year', value: years };
      // 不同locale排序不同
      if (locale === 'zh-Hans') {
        items.unshift(yearItem);
      } else {
        items.push(yearItem);
      }
    } else if (mode === 'datetime' || mode === 'time') {
      if (mode === 'datetime') {
        const ymdws = [];
        // datetime年月日放在一块，传入时间的上下5000天
        for (let i = 1; i <= maxDayCount; i += 1) {
          const tmpDate = new Date(
            (initValueRef.current?.getTime() || 0) +
              (i - maxDayCount / 2) * dayMilliseconds,
          );
          ymdws.push({
            value: i,
            label:
              locale === 'zh-Hans'
                ? `${tmpDate.getMonth() + 1}月 ${tmpDate.getDate()}日  周${
                    weekMap[tmpDate.getDay()]
                  }`
                : `${weekEnMap[tmpDate.getDay()]} ${
                    monthsAbbMap[tmpDate.getMonth()]
                  } ${tmpDate.getDate()}`,
          });
        }
        items.push({
          key: 'ymdw',
          value: ymdws,
        });
      }
      const hours = [];
      const { minHour = 0, maxHour = 23 } = itemRange || {};
      for (let i = minHour; i <= maxHour; i += 1) {
        hours.push({
          value: i,
          label: is24Hour
            ? `${i < 10 ? '0' : ''}${i}` // 24小时制不满10前面补0
            : `${i === 0 || i === 12 ? 12 : i % 12}`, // 显示12小时制
        });
      }
      const { minMinute = 0, maxMinute = 59 } = itemRange || {};
      const minutes = [];
      const interval = minuteInterval || 1;
      for (
        let i = (minMinute - (minMinute % interval)) / interval,
          len = (maxMinute - (maxMinute % interval)) / interval;
        i <= len;
        i += 1
      ) {
        const step = interval * i;
        minutes.push({
          value: step,
          label: `${step < 10 ? '0' : ''}${step}`, // 补0
        });
      }
      items.push(
        {
          key: 'hour',
          value: hours,
        },
        {
          key: 'minute',
          value: minutes,
        },
      );
      if (!is24Hour) {
        // 12小时制要显示上下午
        const noon = {
          key: 'noon',
          value: [
            {
              value: 0,
              label: locale === 'zh-Hans' ? '上午' : 'AM',
            },
            {
              value: 1,
              label: locale === 'zh-Hans' ? '下午' : 'PM',
            },
          ],
        };
        // 本地化处理，只有中英文，中英顺序不一致
        if (locale === 'zh-Hans') {
          items.splice(items.length - 2, 0, noon);
        } else {
          items.push(noon);
        }
      }
    }
    return items;
  }, [itemRange, is24Hour, minuteInterval, locale, mode]);
  // 计算选中值
  const getSelectedValue = useCallback((key: string, date: Date) => {
    let selectedValue: number = 0;
    if (key === 'year') {
      selectedValue = date.getFullYear();
    } else if (key === 'month') {
      selectedValue = date.getMonth();
    } else if (key === 'date') {
      selectedValue = date.getDate();
    } else if (key === 'ymdw') {
      selectedValue =
        maxDayCount / 2 -
        (new Date(
          initValueRef.current?.getFullYear() || 0,
          initValueRef.current?.getMonth() || 0,
          initValueRef.current?.getDate() || 0,
          0,
          0,
          0,
          0,
        ).getTime() -
          new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            0,
            0,
            0,
            0,
          ).getTime()) /
          dayMilliseconds;
    } else if (key === 'hour') {
      selectedValue = date.getHours();
    } else if (key === 'minute') {
      selectedValue = date.getMinutes();
    } else if (key === 'noon') {
      // 根据小时是否大于12调整上下午
      selectedValue = date.getHours() < 12 ? 0 : 1;
    }
    return selectedValue;
  }, []);
  // 计算布局样式
  const getMinWidth = useCallback(
    (k?: string, m?: string, l?: string, h?: boolean) => {
      let width = 0;
      if (m === 'date') {
        if (l === 'zh-Hans') {
          width = k === 'year' ? 58 : 38;
        } else {
          width = k === 'month' ? 88 : k === 'year' ? 40 : 20;
        }
      }
      if (m === 'time') {
        const noon = h ? 0 : 36;
        width = k === 'noon' ? noon : 20;
      }
      if (m === 'datetime') {
        const noon = h ? 0 : 36;
        const ymdw = l === 'zh-Hans' ? 144 : 124;
        width = k === 'noon' ? noon : k === 'ymdw' ? ymdw : 20;
      }
      return { minWidth: width };
    },
    [],
  );
  const {
    style,
    itemContainerStyle,
    itemStyle,
    themeVariant,
    textColor,
    accentColor,
    disabled,
  } = props;
  return (
    <View style={StyleSheet.flatten([styles.wrapper, style])}>
      {dateItems.map(
        ({ value: item, key }: { value: PickerItemProps[]; key: string }) => (
          <PickerAndroid
            cyclic={
              cyclic
                ? key !== 'year' && key !== 'ymdw' && key !== 'noon'
                : false
            }
            indicator
            key={key}
            style={StyleSheet.flatten([
              styles.container,
              getMinWidth(key, mode, locale, is24Hour),
              itemContainerStyle,
            ])}
            itemStyle={StyleSheet.flatten([itemStyle])}
            themeVariant={themeVariant}
            textColor={textColor}
            accentColor={accentColor}
            onChange={(e: PickerEvent) => _onChange(e, key)}
            onScrollStateChange={(e: PickerAndroidScrollEvent) =>
              _onScrollStateChange(e, key)
            }
            selectedValue={getSelectedValue(key, selectDate)}>
            {item.map(({ value: val, label }: PickerItemProps) => {
              return <PickerAndroid.Item key={val} value={val} label={label} />;
            })}
          </PickerAndroid>
        ),
      )}
      {disabled ? <View style={StyleSheet.flatten([styles.mask])} /> : null}
    </View>
  );
}

export default DateTimePicker;

const styles = StyleSheet.create({
  mask: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff8',
    zIndex: 100,
  },
  wrapper: {
    flexDirection: 'row',
  },
  container: {
    flex: 1,
  },
});
