/*
 * @Author: Huangjs
 * @Date: 2022-10-18 10:35:07
 * @LastEditors: Huangjs
 * @LastEditTime: 2022-11-23 15:14:12
 * @Description: ******
 */

import * as React from 'react';
import type { Element, ElementRef, ChildrenArray } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
  SyntheticEvent,
  requireNativeComponent,
} from 'react-native';
import PickerItem from './PickerItem';
import { PickerIOS } from '@react-native-picker/picker';

export type PickerProps = {
  testID?: string;
  numberOfLines?: number;
  themeVariant?: string;
  style?: StyleProp<ViewStyle>;
  itemStyle?: StyleProp<ViewStyle>;
  selectedValue?: number | string;
  accentColor?: string;
  textColor?: string;
  textSize?: number;
  fontFamily?: string;
  itemSpace?: number;
  itemCount?: number;
  itemAlign?: number;
  indicator?: boolean;
  indicatorColor?: string;
  indicatorSize?: number;
  curtain?: boolean;
  curtainColor?: string;
  curtainRound?: boolean;
  atmospheric?: boolean;
  curved?: boolean;
  cyclic?: boolean;
  widthSame?: boolean;
  maxWidthText?: string;
  maxWidthTextIndex?: number;
  onValueChange?: (value: string | number, index: number) => void;
  onChange?: (
    event: SyntheticEvent<{ value: string | number; index: number }>,
  ) => void;
  children: ChildrenArray<Element<typeof PickerItem>>;
};

type ItemType = {
  value?: string | number;
  /**
   * the picker item display label
   */
  label?: string;
};

type State = {
  selectedIndex: number;
  items: Array<ItemType>;
};

class Picker extends React.Component {
  _picker?: ElementRef = null;

  props: any;

  state: State = {
    selectedIndex: 0,
    items: [],
  };

  static Item: typeof PickerItem = PickerItem;

  static getDerivedStateFromProps(props: PickerProps): State {
    let selectedIndex: number = 0;
    const items: Array<ItemType> = [];
    // 将传入的item子组件属性数据提取出来作为state，传入本地组件items
    React.Children.toArray(props.children).forEach(function (child, index) {
      if (child.props.value === props.selectedValue) {
        selectedIndex = index;
      }
      items.push({ value: child.props.value, label: child.props.label });
    });
    return { selectedIndex, items };
  }

  _onChange = (e) => {
    const { index } = e.nativeEvent;
    if (this.props.onValueChange) {
      this.props.onValueChange(this.state.items[index].value, index);
    }
    if (this.props.onChange) {
      this.props.onChange({
        ...e,
        nativeEvent: {
          ...e.nativeEvent,
          value: this.state.items[index].value,
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

  render(): React.Node {
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
      ...restProps
    } = this.props;
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
    const items = this.state.items.map(({ label }) => label);
    return (
      <View
        style={StyleSheet.flatten([
          styles.container,
          [{ backgroundColor: _background }],
          style,
        ])}>
        <NativePicker
          ref={(picker) => {
            this._picker = picker;
          }}
          {...restProps}
          style={StyleSheet.flatten([styles.picker, itemStyle])}
          items={items}
          selectedIndex={this.state.selectedIndex}
          onChange={this._onChange}
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

const NativePicker = requireNativeComponent('PickerView', Picker);

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    padding: 12,
  },
  picker: {
    // The picker will conform to whatever width is given, but we do
    // have to set the component's height explicitly on the
    // surrounding view to ensure it gets rendered.
    height: 216,
  },
});

export default Platform.OS === 'android' ? Picker : PickerIOS;
