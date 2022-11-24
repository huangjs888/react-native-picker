/*
 * @Author: Huangjs
 * @Date: 2022-11-08 10:42:40
 * @LastEditors: Huangjs
 * @LastEditTime: 2022-11-23 16:47:19
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
  getValidDate,
  fixTimeZoneOffset,
  fixDateTimeRange,
} from './common';
import Picker from '../picker';

function DateTimePicker(props) {
  const {
    mode,
    onChange,
    value,
    timeZoneOffsetInMinutes,
    minuteInterval,
    minimumDate,
    maximumDate,
  } = props;
  if (!value) {
    throw new Error('A date or time must be specified as `value` prop');
  }
  // 记录初始时间
  const initValueRef = useRef(null);
  // 可以受控可以非受控
  const [currentDate, setCurrentDate] = useDerivedState(value);
  // 修正时区值
  const tzoim = useMemo(
    () => fixTimeZoneOffset(timeZoneOffsetInMinutes, value.getTimezoneOffset()),
    [value, timeZoneOffsetInMinutes],
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
    (event, key) => {
      const { nativeEvent, ...restEvent } = event;
      const { value: val, ...restNativeEvent } = nativeEvent;
      let year = selectDate.getFullYear();
      let month = selectDate.getMonth();
      let date = selectDate.getDate();
      let hour = selectDate.getHours();
      let minute = selectDate.getMinutes();
      // 根据选择的年月日时分，修改对应的时间值
      if (key === 'year') {
        year = val;
      } else if (key === 'month') {
        month = val;
      } else if (key === 'date') {
        date = val;
      } else if (key === 'ymdw') {
        const tmpDate = new Date(
          initValueRef.current.getTime() -
            (maxDayCount / 2 - val) * dayMilliseconds,
        );
        year = tmpDate.getFullYear();
        month = tmpDate.getMonth();
        date = tmpDate.getDate();
      } else if (key === 'noon') {
        if (val === 0 && hour >= 12) {
          hour -= 12;
        } else if (val === 1 && hour < 12) {
          hour += 12;
        }
      } else if (key === 'hour') {
        hour = val;
      } else if (key === 'minute') {
        minute = val;
      }
      // 检查选中的日是否大于当前年月下的天数
      const count = new Date(year, month + 1, 0).getDate();
      if (date > count) {
        date = count;
      }
      let timeStamp = new Date(
        new Date(
          new Date(
            new Date(new Date(selectDate).setFullYear(year)).setMonth(month),
          ).setDate(date),
        ).setHours(hour),
      ).setMinutes(minute);
      // 如果选择的时间跟之前时间一样，则不触发onChange事件，也不更新
      if (timeStamp === selectDate.getTime()) {
        return;
      }
      // 调回时区偏移量
      timeStamp = new Date(timeStamp).setMinutes(
        new Date(timeStamp).getMinutes() - tzoim,
      );
      const tempDate = getValidDate(timeStamp, dateRange, mode === 'date');
      const unifiedEvent = {
        ...restEvent,
        nativeEvent: {
          ...restNativeEvent,
          timestamp: tempDate.getTime(),
        },
      };
      onChange && onChange(unifiedEvent, tempDate);
      setCurrentDate(tempDate);
    },
    [onChange, selectDate, setCurrentDate, dateRange, tzoim, mode],
  );
  const { is24Hour, locale } = props;
  // 计算选择器的items
  const dateItems = useMemo(() => {
    const items = [];
    if (mode === 'date') {
      const years = [];
      // 爱你一万年
      for (let i = 1; i <= 10000; i += 1) {
        years.push({
          value: i,
          label: locale === 'zh-Hans' ? `${i}年` : `${i}`,
        });
      }
      const months = [];
      // 12个月
      for (let i = 0; i < 12; i += 1) {
        months.push({
          value: i,
          label: locale === 'zh-Hans' ? `${i + 1}月` : monthsMap[i],
        });
      }
      const dates = [];
      // 31天
      for (let i = 1; i <= 31; i += 1) {
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
            initValueRef.current.getTime() +
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
      // 24小时
      for (let i = 0; i < 24; i += 1) {
        hours.push({
          value: i,
          label: is24Hour
            ? `${i < 10 ? '0' : ''}${i}` // 24小时制不满10前面补0
            : `${i === 0 || i === 12 ? 12 : i % 12}`, // 显示12小时制
        });
      }
      // 60分钟（计算最小分数间隔，默认是1）
      const minutes = [];
      const interval = minuteInterval || 1;
      const intervalSize = 60 / interval;
      for (let i = 0; i < intervalSize; i += 1) {
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
  }, [is24Hour, minuteInterval, locale, mode]);
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
          initValueRef.current.getFullYear(),
          initValueRef.current.getMonth(),
          initValueRef.current.getDate(),
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
  const getContainerStyle = useCallback((key: string, mode: string) => {
    if (mode === 'date') {
      return [{ flex: key === 'year' ? 2 : 1 }];
    }
    if (mode === 'time') {
      return [{ flex: 1 }];
    }
    if (mode === 'datetime') {
      return [{ flex: key === 'ymdw' ? 2 : 1 }];
    }
    return [];
  }, []);
  const {
    style,
    containerStyle,
    itemStyle,
    themeVariant,
    textColor,
    accentColor,
    disabled,
  } = props;
  return (
    <View style={StyleSheet.flatten([styles.wrapper, style])}>
      {dateItems.map(({ value: item, key }) => (
        <Picker
          cyclic={key !== 'year' && key !== 'ymdw' && key !== 'noon'}
          indicator
          key={key}
          style={StyleSheet.flatten([
            styles.container,
            getContainerStyle(key, mode),
            containerStyle,
          ])}
          itemStyle={StyleSheet.flatten([styles.item, itemStyle])}
          themeVariant={themeVariant}
          textColor={textColor}
          accentColor={accentColor}
          onChange={(e) => _onChange(e, key)}
          selectedValue={getSelectedValue(key, selectDate)}>
          {item.map(({ value: val, label }) => {
            return <Picker.Item key={val} value={val} label={label} />;
          })}
        </Picker>
      ))}
      {disabled ? <View style={StyleSheet.flatten([styles.mask])} /> : null}
    </View>
  );
}

export default DateTimePicker;

const styles = StyleSheet.create({
  mask: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.15)',
    zIndex: 1000,
  },
  wrapper: {
    flexDirection: 'row',
    flex: 1,
  },
  container: {
    margin: 0,
    padding: 0,
  },
  item: {},
});
