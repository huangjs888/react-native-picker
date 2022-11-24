/*
 * @Author: Huangjs
 * @Date: 2022-10-18 15:58:16
 * @LastEditors: Huangjs
 * @LastEditTime: 2022-11-23 17:46:56
 * @Description: ******
 */
import React, { useState } from 'react';
import {
  StyleSheet,
  Platform,
  Pressable,
  View,
  Modal,
  Button,
} from 'react-native';
import { Picker, DateTimePicker } from '@huangjs888/react-native-picker';

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
  const [selectedA, setSelectedA] = useState('key5');
  const [value, setValue] = useState(new Date(2022, 10, 6, 8, 29, 36, 20));
  const [visible, setVisible] = useState(false);
  const [param, setParam] = useState([]);
  const click = (display, mode) => {
    setVisible(true);
    setParam([display, mode]);
  };
  return (
    <View style={styles.view}>
      <Picker
        style={[styles.picker]}
        onValueChange={(v) => {
          setSelectedA(v);
          console.log(v);
        }}
        selectedValue={selectedA}
        indicator={false}
        curtain={true}>
        {items.map((item) => (
          <Picker.Item key={item.value} value={item.value} label={item.label} />
        ))}
      </Picker>
      <View style={[styles.button]}>
        <Button
          title="no display mode"
          onPress={() => click(undefined, undefined)}
        />
      </View>
      <View style={[styles.button]}>
        <Button title="spinner-date" onPress={() => click('spinner', 'date')} />
      </View>
      <View style={[styles.button]}>
        <Button
          title="spinner-datetime"
          onPress={() => click('spinner', 'datetime')}
        />
      </View>
      <View style={[styles.button]}>
        <Button title="spinner-time" onPress={() => click('spinner', 'time')} />
      </View>
      <View style={[styles.button]}>
        <Button
          title="no display-date"
          onPress={() => click(undefined, 'date')}
        />
      </View>
      <View style={[styles.button]}>
        <Button
          title="no display-datetime"
          onPress={() => click(undefined, 'datetime')}
        />
      </View>
      <View style={[styles.button]}>
        <Button
          title="no display-time"
          onPress={() => click(undefined, 'time')}
        />
      </View>
      <Modal
        animationType="fade"
        transparent
        visible={visible}
        onRequestClose={() => setVisible(false)}>
        <View style={[styles.center]}>
          <Pressable
            style={[styles.pressable]}
            onPress={() => setVisible(false)}
          />
          <View style={[styles.modalView]}>
            <View style={[styles.button]}>
              <Button
                title="close"
                onPress={() => {
                  setVisible(false);
                }}
              />
            </View>
            <DateTimePicker
              style={[styles.border]}
              onChange={(e, selectedDate) => {
                setValue(selectedDate);
                console.log(selectedDate);
                if (!param[0] && param[1]) {
                  setVisible(false);
                }
              }}
              display={param[0]}
              mode={param[1]}
              value={value}
              minimumDate={new Date(2022, 10, 2, 8, 12, 5, 10)}
              maximumDate={new Date(2022, 10, 10, 13, 42, 30, 1)}
              is24Hour={false}
              locale="zh-Hans"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  view: {
    width: '100%',
    flex: 1,
    paddingTop: 16,
    flexDirection: 'column',
    paddingBottom: 16,
    // backgroundColor: '#000',
    height: 216,
  },
  item: {
    color: '#0000ff',
    lineHeight: 65,
    fontSize: 50,
    fontFamily: 'sans-serif-condensed-light',
  },
  button: {
    marginBottom: 16,
    marginLeft: 16,
    marginRight: 16,
  },
  flex: { flex: 1 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressable: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '90%',
    height: '60%',
    padding: 16,
    borderRadius: 4,
    backgroundColor: '#fff',
    shadowColor: 'rgba(0,0,0,0.2)',
    ...Platform.select({
      android: {
        elevation: 4,
      },
      default: {
        shadowOffset: { height: 0, width: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 4,
      },
    }),
  },
  border: {
    borderWidth: 1,
    borderColor: 'red',
  },
  picker: {
    borderWidth: 1,
    borderColor: 'green',
    margin: 16,
  },
});
