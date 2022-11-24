/*
 * @Author: Huangjs
 * @Date: 2022-10-18 10:35:07
 * @LastEditors: Huangjs
 * @LastEditTime: 2022-11-23 17:39:50
 * @Description: ******
 */
import React from 'react';
import { Platform } from 'react-native';
import DateTimePickerAndroidIOS from '@react-native-community/datetimepicker';
import DateTimePicker from './datetime';
import ComposeDateTimePicker from './compose';
/*
value,
  locale,
  maximumDate,
  minimumDate,
  style,
  testID,
  minuteInterval,
  timeZoneOffsetInMinutes,
  textColor,
  accentColor,
  themeVariant,
  onChange,
  mode = ANDROID_MODE.date,
  display: providedDisplay = IOS_DISPLAY.default,
  disabled = false,
*/

export type DateTimePickerProps = {
  /**
   * The currently selected date.
   */
  value: Date;

  /**
   * Date change handler.
   *
   * This is called when the user changes the date or time in the UI.
   * The first argument is an Event, the second a selected Date.
   */
  onChange?: (
    event: SyntheticEvent<
      Readonly<{
        timestamp: number;
      }>
    >,
    date?: Date,
  ) => void;

  /**
   * Maximum date.
   *
   * Restricts the range of possible date/time values.
   */
  maximumDate?: Date;

  /**
   * Minimum date.
   *
   * Restricts the range of possible date/time values.
   */
  minimumDate?: Date;

  /**
   * The interval at which minutes can be selected.
   */
  minuteInterval?: 1 | 2 | 3 | 4 | 5 | 6 | 10 | 12 | 15 | 20 | 30;

  /**
   * The date picker mode.
   */
  mode?: 'date' | 'time' | 'datetime';

  /**
   * Sets the preferredDatePickerStyle for picker
   */
  display?: 'spinner' | 'default' | 'clock' | 'calendar';

  /**
   * The date picker text color.
   */
  textColor?: string;

  /**
   * The date picker accent color.
   *
   * Sets the color of the selected, date and navigation icons.
   * Has no effect for display 'spinner'.
   */
  accentColor?: string;

  /**
   * Override theme variant used by native picker
   */
  themeVariant?: 'dark' | 'light';

  /**
   * Display TimePicker in 24 hour.
   */
  is24Hour?: boolean;

  /**
   * The date picker locale.
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
   * Is this picker disabled?
   */
  disabled?: boolean;
  positiveButtonLabel?: string;
  neutralButtonLabel?: string;
  negativeButtonLabel?: string;
  /**
   * callback when an error occurs inside the date picker native code (such as null activity)
   */
  onError?: (arg: Error) => void;
};

function CommonDateTimePicker(props) {
  const { display, mode } = props;
  if (!display && !mode) {
    return <ComposeDateTimePicker {...props} />;
  }
  if (Platform.OS === 'android' && display === 'spinner') {
    return <DateTimePicker {...props} />;
  }
  return <DateTimePickerAndroidIOS {...props} />;
}

export default CommonDateTimePicker;
