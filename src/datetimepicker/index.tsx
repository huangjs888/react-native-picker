/*
 * @Author: Huangjs
 * @Date: 2022-10-18 10:35:07
 * @LastEditors: Huangjs
 * @LastEditTime: 2022-12-12 13:34:58
 * @Description: ******
 */
import React from 'react';
import {
  Platform,
  type StyleProp,
  type ViewStyle,
  type ViewProps,
  type NativeSyntheticEvent,
} from 'react-native';
import RNDateTimePicker, {
  type AndroidNativeProps,
} from '@react-native-community/datetimepicker';
import DateTimePickerAndroid from './datetime';

export type ChangeEvent = NativeSyntheticEvent<
  Readonly<{
    timestamp: number;
  }>
>;

export interface DateTimePickerProps extends ViewProps {
  testID: string;

  /**
   * 日期选择器的样式
   */
  style?: StyleProp<ViewStyle>;

  /**
   * 日期每一个可选择部分容器的样式，比如，年，月，日
   */
  itemContainerStyle?: StyleProp<ViewStyle>;

  /**
   * 日期每一个可选择部分的样式，比如，年，月，日
   */
  itemStyle?: StyleProp<ViewStyle>;

  /**
   * The currently selected date.
   */
  value: Date;

  /**
   * 时间选择改变事件，参数：时间和当前选择时间
   */
  onChange?: (event: ChangeEvent, date?: Date) => void;

  /**
   * 允许选择的最大时间，android默认2100年，ios默认10000年
   */
  maximumDate?: Date;

  /**
   * 允许选择的最小时间，android默认1901年，ios默认1年
   */
  minimumDate?: Date;

  /**
   * time和datetime模式下分钟选择的最小间隔，默认为 1
   */
  minuteInterval?: 1 | 2 | 3 | 4 | 5 | 6 | 10 | 12 | 15 | 20 | 30;

  /**
   * 时间选择模式，date：只显示日期，time只显示时间，datetime时间和日期
   */
  mode?: 'date' | 'time' | 'datetime';

  /**
   * 设置选择的风格，'clock' | 'calendar'只能设置android
   */
  display?: 'spinner' | 'default' | 'clock' | 'calendar';

  /**
   * 未被选中时间的颜色
   */
  textColor?: string;

  /**
   * 被选时间的颜色
   */
  accentColor?: string;

  /**
   * 主题风格
   */
  themeVariant?: 'dark' | 'light';

  /**
   * 小时是否使用24小时制，不使用的时候会显示上午下午
   */
  is24Hour?: boolean;

  /**
   * 时间本地化，传入'zh-Hans'是中文，其他都是英文
   */
  locale?: string;

  /**
   * Timezone offset in minutes.
   *
   * By default, the date picker will use the device's timezone. With this
   * parameter, it is possible to force a certain timezone offset. For
   * instance, to show times in Pacific Standard Time, pass -7 * 60.
   */
  timeZoneOffsetInMinutes?: number;

  /**
   * android参数，false，隐藏不能选择的时间，true显示所有时间并且循环显示
   */
  cyclic?: boolean;

  /**
   * 是否禁用时间选择
   */
  disabled?: boolean;

  /**
   * 'clock' | 'calendar'模式下的设置
   */
  positiveButtonLabel?: string;

  /**
   * 'clock' | 'calendar'模式下的设置
   */
  neutralButtonLabel?: string;

  /**
   * 'clock' | 'calendar'模式下的设置
   */
  negativeButtonLabel?: string;

  /**
   * 'clock' | 'calendar'模式下的设置
   * callback when an error occurs inside the date picker native code (such as null activity)
   */
  onError?: (arg: Error) => void;
}

function DateTimePicker(props: DateTimePickerProps | AndroidNativeProps | any) {
  const { display } = props;
  if (display === 'spinner') {
    return <DateTimePickerAndroid {...props} />;
  }
  const { ...restProps } = props;

  return <RNDateTimePicker {...restProps} />;
}

export default Platform.OS === 'ios' ? RNDateTimePicker : DateTimePicker;
