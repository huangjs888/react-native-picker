/*
 * @Author: Huangjs
 * @Date: 2022-10-18 10:35:07
 * @LastEditors: Huangjs
 * @LastEditTime: 2022-12-12 14:52:20
 * @Description: ******
 */
import React, {
  Component,
  Children,
  type ElementRef,
  type ReactElement,
} from 'react';
import {
  Platform,
  StyleSheet,
  View,
  requireNativeComponent,
  type StyleProp,
  type ViewStyle,
  type ViewProps,
  type NativeSyntheticEvent,
} from 'react-native';
import PickerItem, { type PickerItemProps } from './PickerItem';
import { PickerIOS } from '@react-native-picker/picker';

export enum ScrollState {
  /**
   * 选择器处于静止状态
   */
  IDLE,

  /**
   * 选择器处于拖动状态（随手指滑动）
   */
  DRAGGING,

  /**
   * 选择器处于滑动状态（惯性滚动）
   */
  SCROLLING,
}

export type ScrollStateEvent = NativeSyntheticEvent<
  Readonly<{
    state: ScrollState;
  }>
>;

export type ChangeEvent = NativeSyntheticEvent<
  Readonly<{
    value: string | number;
    index: number;
  }>
>;

export interface PickerProps extends ViewProps {
  testID?: string;

  /**
   * 未使用
   */
  numberOfLines?: number;

  /**
   * 选择器样式
   */
  style?: StyleProp<ViewStyle>;

  /**
   * 选择器Item样式
   */
  itemStyle?: StyleProp<ViewStyle>;

  /**
   * 主题风格
   */
  themeVariant?: 'dark' | 'light';

  /**
   * 当前选择的值
   */
  selectedValue?: number | string;

  /**
   * 被选值的颜色
   */
  accentColor?: string;

  /**
   * 未被选中值的颜色
   */
  textColor?: string;

  /**
   * 选择器数据项字体大小
   */
  textSize?: number;

  /**
   * 选择器数据项字体
   */
  fontFamily?: string;

  /**
   * 选择器数据项间距，似乎无效
   */
  itemSpace?: number;

  /**
   * 选择器可见数据项数量
   */
  itemCount?: number;

  /**
   * 选择器数据项位置，0：中间，1，左边，2：右边
   */
  itemAlign?: number;

  /**
   * 选择器当前选择项是否使用上下边框线
   */
  indicator?: boolean;

  /**
   * 边框线颜色
   */
  indicatorColor?: string;

  /**
   * 边框线粗细
   */
  indicatorSize?: number;

  /**
   * 选择器当前选择项是否使用背景
   */
  curtain?: boolean;

  /**
   * 背景颜色
   */
  curtainColor?: string;

  /**
   * 背景框是否圆角
   */
  curtainRound?: boolean;

  /**
   * 选择器是否有空气感
   */
  atmospheric?: boolean;

  /**
   * 选择器是否有卷曲效果
   */
  curved?: boolean;

  /**
   * 选择器数据项是否循环显示
   */
  cyclic?: boolean;

  /**
   * 设置选择器有相同的宽度，可提升性能
   */
  widthSame?: boolean;

  /**
   * 设置选择器最宽文本，可提升性能
   */
  maxWidthText?: string;

  /**
   * 设置选择器最宽文本索引，可提升性能
   */
  maxWidthTextIndex?: number;

  /**
   * 选择器选择值改变事件，参数：当前选择的值和索引
   */
  onValueChange?: (value?: string | number, index?: number) => void;

  /**
   * 选择器改变事件，参数：含有选择的值和索引的选择事件
   */
  onChange?: (event: ChangeEvent) => void;

  /**
   * 选择器滚轮状态变化事件，参数：含有当前状态值得状态事件
   */
  onScrollStateChange?: (event: ScrollStateEvent) => void;

  children?: ReactElement<PickerItemProps>[];
}

type ItemType = {
  value?: string | number;
  label?: string;
};

type State = {
  selectedIndex: number;
  items: Array<ItemType>;
};

class Picker extends Component<PickerProps, State> {
  constructor(props: PickerProps) {
    super(props);
  }

  _picker: ElementRef<typeof NativePicker> | null = null;

  state: State = {
    selectedIndex: 0,
    items: [],
  };

  static Item: typeof PickerItem = PickerItem;

  static getDerivedStateFromProps(props: PickerProps): State {
    let selectedIndex: number = 0;
    const items: Array<ItemType> = [];
    // 将传入的item子组件属性数据提取出来作为state，传入本地组件items
    Children.forEach(
      props.children || [],
      function (child: ReactElement<PickerItemProps>, index: number) {
        if (child.props.value === props.selectedValue) {
          selectedIndex = index;
        }
        items.push({ value: child.props.value, label: child.props.label });
      },
    );
    return { selectedIndex, items };
  }

  _onChange = (e: ChangeEvent) => {
    const { index } = e.nativeEvent;
    if (this.props?.onValueChange) {
      this.props.onValueChange(this.state.items[index].value, index);
    }
    if (this.props?.onChange) {
      this.props.onChange({
        ...e,
        nativeEvent: {
          index,
          value: this.state.items[index].value || 0,
        },
      });
    }

    // picker应该是完全受控组件，使用该组件，onChange时应该同时更改selectedValue，否则撤回native组件的更改
    if (this._picker && this.state.selectedIndex !== index) {
      this._picker.setNativeProps({
        selectedIndex: this.state.selectedIndex,
      });
    }
  };

  render() {
    const {
      style,
      itemStyle,
      itemCount,
      themeVariant,
      textColor,
      accentColor,
      curtainColor,
      indicatorColor,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      numberOfLines,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      selectedValue,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onChange,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onValueChange,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      children,
      onScrollStateChange,
      ...restProps
    } = this.props || {};
    let _itemCount = itemCount;
    if (typeof itemCount !== 'undefined') {
      _itemCount = Math.round(itemCount ?? 1);
      if (_itemCount < 2) {
        _itemCount = 2;
      }
    }
    // 设置主题'dark'时的颜色，默认是'light'的颜色
    let _textColor = textColor;
    let _selectTextColor = accentColor;
    let _curtainColor = curtainColor;
    let _indicatorColor = indicatorColor;
    let _background = 'transparent';
    if (themeVariant === 'dark') {
      if (!_textColor) {
        _textColor = '#aaa';
      }
      if (!_selectTextColor) {
        _selectTextColor = '#bbb';
      }
      if (!_curtainColor) {
        _curtainColor = 'rgba(255,255,255,0.1)';
      }
      if (!_indicatorColor) {
        _indicatorColor = 'rgba(255,255,255,0.1)';
      }
      _background = '#000';
    }
    const items: Array<string | number> = this.state.items.map(
      ({ label }) => label || '',
    );
    return (
      <View
        style={StyleSheet.flatten([style, [{ backgroundColor: _background }]])}>
        <NativePicker
          ref={(picker) => {
            this._picker = picker;
          }}
          {...restProps}
          style={StyleSheet.flatten([styles.picker, itemStyle])}
          items={items}
          selectedIndex={this.state.selectedIndex}
          onChange={this._onChange}
          onScrollStateChange={onScrollStateChange}
          itemCount={_itemCount}
          textColor={_textColor}
          selectTextColor={_selectTextColor}
          curtainColor={_curtainColor}
          indicatorColor={_indicatorColor}
        />
      </View>
    );
  }
}
type NativeProps = PickerProps & {
  items: Array<string | number>;
  selectedIndex?: number | string;
  selectTextColor?: string;
};
const NativePicker = requireNativeComponent<NativeProps>('PickerView');

const styles = StyleSheet.create({
  picker: {
    // The picker will conform to whatever width is given, but we do
    // have to set the component's height explicitly on the
    // surrounding view to ensure it gets rendered.
    height: 216,
  },
});

export default Platform.OS === 'android' ? Picker : PickerIOS;

export const PickerAndroid = Picker;
