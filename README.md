<!--
 * @Author: Huangjs
 * @Date: 2022-05-27 10:16:38
 * @LastEditors: Huangjs
 * @LastEditTime: 2022-12-12 09:38:53
 * @Description: ******
-->
# react-native-picker

## Getting started

`$ npm install @huangjs888/react-native-picker --save`

## Usage
```javascript

import React, { useState } from 'react';
import { View } from 'react-native';
import Picker, {
  DateTimePicker,
  ComposeDateTimePicker,
} from '@huangjs888/react-native-picker';

const items = [
  { label: 'Sin数据', value: 'key0' },
  { label: 'Cos数据', value: 'key1' },
  { label: 'Tan数据', value: 'key3' },
  { label: 'Cat数据', value: 'key4' },
  { label: 'Dog数据', value: 'key5' },
  { label: 'Bob数据', value: 'key6' },
  { label: 'Key数据', value: 'key7' },
  { label: 'Bla数据', value: 'key8' },
  { label: 'Edg数据', value: 'key9' },
];

export default () => {
  const [selected, setSelected] = useState('key5');
  const [value, setValue] = useState(new Date());
  return (
    <View>
      <Picker
        onValueChange={(v) => {
          setSelected(v);
        }}
        selectedValue={selected}
        indicator={false}
        curtain={true}>
        {items.map((item) => (
          <Picker.Item key={item.value} value={item.value} label={item.label} />
        ))}
      </Picker>
      <DateTimePicker
        display="spinner"
        mode="date"
        onChange={(e, date) => {
          setValue(date);
          console.log(date);
        }}
        value={value}
        minimumDate={new Date(2012, 10, 2, 8, 12, 5, 10)}
        maximumDate={new Date(2032, 10, 10, 13, 42, 30, 1)}
        locale="zh-Hans"
      />
      <ComposeDateTimePicker
        onChange={(e, date) => {
          setValue(date);
          console.log(date);
        }}
        value={value}
        locale="zh-Hans"
        is24Hour={is24Hour}
        minuteInterval={5}
      />
    </View>
  );
};

```
