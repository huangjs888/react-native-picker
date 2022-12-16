package com.huangjs.picker;

import android.graphics.Canvas;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.huangjs.picker.lib.WheelNumberPicker;
import com.huangjs.picker.lib.WheelPicker;

public class PickerView extends WheelPicker {
  private RCTEventEmitter rctEventEmitter = null;
  private boolean isDraw = false;
  private int initIndex = 0;

  private int mState;

  public PickerView(ThemedReactContext themedContext, ReactApplicationContext reactContext) {
    super(themedContext);
    //使用WheelPicker设置监听器
    this.setOnWheelChangeListener(new WheelPicker.OnWheelChangeListener() {
      @Override
      public void onWheelScrolled(int offset) {
      }

      @Override
      public void onWheelSelected(int position) {
        WritableMap eventData = Arguments.createMap();
        eventData.putInt("itemIndex", position);
        dispatchEvent(getId(), "onChange", eventData);
      }

      @Override
      public void onWheelScrollStateChanged(int state) {
        mState = state;
        WritableMap eventData = Arguments.createMap();
        eventData.putInt("state", state);
        dispatchEvent(getId(), "onScrollStateChange", eventData);
      }
    });
    /*//使用WheelNumberPicker设置监听器
    this.setOnWheelChangeListener((view, scrollState) -> {
      mState = scrollState;
      switch (scrollState) {
        case OnScrollListener.SCROLL_STATE_FLING:
          //飞滚状态
          break;
        case OnScrollListener.SCROLL_STATE_IDLE:
          //滚动停止状态
          WritableMap eventData = Arguments.createMap();
          eventData.putInt("index", view.getValue());
          dispatchEvent(getId(), "onChange", eventData);
          break;
        case OnScrollListener.SCROLL_STATE_TOUCH_SCROLL:
          //按下滚动状态
          break;
      }
    });*/
  }

  public void setSelectedIndex(int index) {
    if (mState == WheelPicker.SCROLL_STATE_IDLE) {
      //使用WheelNumberPicker时注释该if直接使用else
      if (!isDraw) {
        initIndex = index;
      } else {
        super.setSelectedItemPosition(index);
      }
    }
  }

  //使用WheelNumberPicker时注释该方法
  protected void onDraw(Canvas canvas) {
    if (!isDraw) {
      isDraw = true;
      super.setSelectedItemPosition(initIndex);
    }
    super.onDraw(canvas);
  }

  private void dispatchEvent(int id, String name, WritableMap data) {
    if (rctEventEmitter == null) {
      rctEventEmitter = ((ReactContext) getContext()).getJSModule(RCTEventEmitter.class);
    }
    rctEventEmitter.receiveEvent(id, name, data);
  }

}
