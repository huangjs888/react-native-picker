/*
 * @Author: Huangjs
 * @Date: 2022-10-18 10:35:07
 * @LastEditors: Huangjs
 * @LastEditTime: 2022-12-05 20:42:04
 * @Description: ******
 */

export type PickerItemProps = {
  key?: string | number;
  /**
   * the picker item value
   */
  value?: string | number;
  /**
   * the picker item display label
   */
  label?: string;
};

function PickerItem(_props: PickerItemProps): null {
  // 这些items实际并不会被渲染
  return null;
}

export default PickerItem;
