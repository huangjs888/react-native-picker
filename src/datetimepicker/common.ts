/*
 * @Author: Huangjs
 * @Date: 2022-11-23 15:51:05
 * @LastEditors: Huangjs
 * @LastEditTime: 2022-12-05 20:28:12
 * @Description: ******
 */
export const weekMap = ['日', '一', '二', '三', '四', '五', '六'];
export const weekEnMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const monthsMap = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
export const monthsAbbMap = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
export const dayMilliseconds = 24 * 60 * 60 * 1000;
// datatime下1000天范围，这是苹果默认的范围，但是android太卡
// export const maxDayCount = 10000;
// 上下两年范围内
export const maxDayCount = 1500;
// 1000年范围，这是苹果默认的时间范围，但是android太卡
// export const minMTime = -62135582743000; // 0001-01-01 12:00:00
// export const maxMTime = 253433851200000; // 10000-01-01 12:00:00
// 300年的范围
export const minMTime = -2177481600000; // 1901-01-01 00:00:00
export const maxMTime = 4133951999000; // 2200-12-31 23:59:59
export const fixTimeZoneOffset = (value?: number) => {
  if ((!value && value !== 0) || value > 60 * 18 || value < -60 * 18) {
    return 0;
  }
  return value + new Date().getTimezoneOffset();
};
export const fixDateTimeRange = (
  minimumDate?: Date,
  maximumDate?: Date,
  ignoreHourAndMinute?: boolean,
) => {
  // 最大最小时间不存在则取默认的最大最小时间，且两个时间都需要在默认最大最小时间之内
  let minDateTime = Math.max(
    Math.min(!minimumDate ? minMTime : minimumDate.getTime(), maxMTime),
    minMTime,
  );
  let maxDateTime = Math.max(
    Math.min(!maximumDate ? maxMTime : maximumDate.getTime(), maxMTime),
    minMTime,
  );
  if (minDateTime > maxDateTime) {
    // 忽略最大最小时间的秒和毫秒数
    let minTime = new Date(new Date(minDateTime).setMilliseconds(0)).setSeconds(
      0,
    );
    let maxTime = new Date(new Date(maxDateTime).setMilliseconds(0)).setSeconds(
      0,
    );
    // 忽略时分
    if (ignoreHourAndMinute) {
      minTime = new Date(new Date(minTime).setMinutes(0)).setHours(0);
      maxTime = new Date(new Date(maxTime).setMinutes(0)).setHours(0);
    }
    // 如果忽略后的最小时间等于后的最大时间（即只是在忽略的部分minDateTime > maxDateTime）则取忽略后的最小最大的相等时间
    // 否则，就取默认最小最大时间
    if (minTime === maxTime) {
      minDateTime = minTime;
      maxDateTime = maxTime;
    } else {
      minDateTime = minMTime;
      maxDateTime = maxMTime;
    }
  }
  return [new Date(minDateTime), new Date(maxDateTime)];
};
// 判断选取的时间是否在最大最小时间之间（参考苹果的逻辑）
export const getValidDate = (
  timeStamp: number,
  dateRange: Date[],
  ignoreHourAndMinute: boolean,
) => {
  const [minDate, maxDate] = dateRange;
  let validDate = new Date(timeStamp);
  // 如果小于最小时间，直接取最小时间
  if (timeStamp < minDate.getTime()) {
    validDate = new Date(minDate);
  } else {
    // 最大时间忽略秒和毫秒
    let maxTime = new Date(new Date(maxDate).setMilliseconds(0)).setSeconds(0);
    // 忽略时分
    if (ignoreHourAndMinute) {
      maxTime = new Date(new Date(maxTime).setMinutes(0)).setHours(0);
    }
    // 如果大于忽略后的最大时间，则取忽略后最大时间
    if (timeStamp > maxTime) {
      validDate = new Date(maxTime);
    }
  }
  return validDate;
};
