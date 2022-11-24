/*
 * @Author: Huangjs
 * @Date: 2022-10-18 10:35:07
 * @LastEditors: Huangjs
 * @LastEditTime: 2022-11-15 08:56:27
 * @Description: ******
 */

export type PickerItemProps = {
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
