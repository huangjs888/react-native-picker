package com.huangjs.picker;

import android.graphics.Color;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.huangjs.picker.lib.WheelPicker;

public class PickerView extends WheelPicker {
  private RCTEventEmitter rctEventEmitter = null;

  private int mState;

  public PickerView(ThemedReactContext themedContext, ReactApplicationContext reactContext) {
    super(themedContext);
    //设置监听器
    setOnWheelChangeListener(new OnWheelChangeListener() {
      @Override
      public void onWheelScrolled(int offset) {
      }

      @Override
      public void onWheelSelected(int position) {
        WritableMap eventData = Arguments.createMap();
        eventData.putInt("index", position);
        dispatchEvent(getId(), "onChange", eventData);
      }

      @Override
      public void onWheelScrollStateChanged(int state) {
        mState = state;
      }
    });
  }

  public int getState() {
    return mState;
  }

  private void dispatchEvent(int id, String name, WritableMap data) {
    if (rctEventEmitter == null) {
      rctEventEmitter = ((ReactContext) getContext()).getJSModule(RCTEventEmitter.class);
    }
    rctEventEmitter.receiveEvent(id, name, data);
  }

}
