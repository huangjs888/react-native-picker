package com.huangjs.picker.lib;

import android.content.Context;
import android.graphics.Paint;
import android.graphics.Typeface;
import android.graphics.drawable.ColorDrawable;
import android.os.Build;
import android.view.View;
import android.widget.EditText;
import android.widget.NumberPicker;

import com.facebook.react.uimanager.PixelUtil;

import java.lang.reflect.Field;
import java.util.List;


public class WheelNumberPicker extends NumberPicker {
  private int selectIndex;

  public WheelNumberPicker(final Context context) {
    super(context);
    // 默认不可以循环滚动
    this.setWrapSelectorWheel(false);
    // 设置不可编辑
    this.setDescendantFocusability(NumberPicker.FOCUS_BLOCK_DESCENDANTS);
    this.setItemTextSize((int) PixelUtil.toPixelFromDIP(18));
    this.setSelectedItemTextColor(-16777216);// #000
    this.setIndicatorSize((int) PixelUtil.toPixelFromDIP(1));
    // this.setIndicatorColor(520093696);// rgba(0,0,0,0.12)
    // this.setItemSpace((int) PixelUtil.toPixelFromDIP(12));
    // this.setItemAlign(0);
    // this.setTypeface(Typeface.create("sans-serif-medium", Typeface.NORMAL));
    // this.setVisibleItemCount(5);
  }

  public void setOnItemSelectedListener(OnValueChangeListener listener) {
    this.setOnValueChangedListener(listener);
  }

  public void setOnWheelChangeListener(NumberPicker.OnScrollListener listener) {
    this.setOnScrollListener(listener);
  }

  public void setData(List data) {
    if (null == data) throw new NullPointerException("WheelNumberPicker's data can not be null!");
    if (selectIndex > data.size() - 1) {
      selectIndex = data.size() - 1;
    } else if (selectIndex < 0) {
      selectIndex = 0;
    }
    final String[] dataArray = (String[]) data.toArray(new String[0]);
    this.setMinValue(0);
    this.setMaxValue(dataArray.length - 1);
    this.setDisplayedValues(dataArray);
    this.setValue(selectIndex);
  }

  public void setSelectedItemPosition(int position) {
    this.selectIndex = position;
    this.setValue(position);
  }

  // 设置滚轮选择器滚动循环
  public void setCyclic(boolean cycle) {
    this.setWrapSelectorWheel(cycle);
  }

  // 设置选中文本颜色
  public void setSelectedItemTextColor(Integer color) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
      this.setTextColor(color);
    } else {
      Field[] pickerFields = NumberPicker.class.getDeclaredFields();
      for (Field pf : pickerFields) {
        if (pf.getName().equals("mSelectorWheelPaint")) {
          pf.setAccessible(true);
          try {
            Paint p = (Paint) pf.get(this);
            if (p != null) {
              p.setColor(color);
            }
          } catch (IllegalAccessException e) {
            e.printStackTrace();
          }
          break;
        }
      }
      final int count = this.getChildCount();
      for (int i = 0; i < count; ++i) {
        View child = this.getChildAt(i);
        if (child instanceof EditText) {
          ((EditText) child).setTextColor(color);
        }
      }
    }
  }

  // 设置文本尺寸
  public void setItemTextSize(int size) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
      this.setTextSize(size);
    } else {
      Field[] pickerFields = NumberPicker.class.getDeclaredFields();
      for (Field pf : pickerFields) {
        if (pf.getName().equals("mSelectorWheelPaint")) {
          pf.setAccessible(true);
          try {
            Paint p = (Paint) pf.get(this);
            if (p != null) {
              p.setTextSize(size);
            }
          } catch (IllegalAccessException e) {
            e.printStackTrace();
          }
          break;
        }
      }
      final int count = this.getChildCount();
      for (int i = 0; i < count; ++i) {
        View child = this.getChildAt(i);
        if (child instanceof EditText) {
          ((EditText) child).setTextSize(size);
        }
      }
    }
  }

  // 设置文本字体
  public void setTypeface(Typeface typeface) {
    Field[] pickerFields = NumberPicker.class.getDeclaredFields();
    for (Field pf : pickerFields) {
      if (pf.getName().equals("mSelectorWheelPaint")) {
        pf.setAccessible(true);
        try {
          Paint p = (Paint) pf.get(this);
          if (p != null) {
            p.setTypeface(typeface);
          }
        } catch (IllegalAccessException e) {
          e.printStackTrace();
        }
        break;
      }
    }
    final int count = this.getChildCount();
    for (int i = 0; i < count; ++i) {
      View child = this.getChildAt(i);
      if (child instanceof EditText) {
        ((EditText) child).setTypeface(typeface);
      }
    }
  }


  // 设置滚轮选择器指示器颜色
  public void setIndicatorColor(Integer color) {
    Field[] pickerFields = NumberPicker.class.getDeclaredFields();
    for (Field pf : pickerFields) {
      if (pf.getName().equals("mSelectionDivider")) {
        pf.setAccessible(true);
        try {
          pf.set(this, new ColorDrawable(getResources().getColor(color)));
        } catch (IllegalAccessException e) {
          e.printStackTrace();
        }
        break;
      }
    }
  }

  // 设置滚轮选择器指示器尺寸
  public void setIndicatorSize(int size) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
      this.setSelectionDividerHeight(size);
    } else {
      Field[] pickerFields = NumberPicker.class.getDeclaredFields();
      for (Field pf : pickerFields) {
        if (pf.getName().equals("mSelectionDividerHeight")) {
          pf.setAccessible(true);
          try {
            pf.set(this, size);
          } catch (IllegalAccessException e) {
            e.printStackTrace();
          }
          break;
        }
      }
    }
  }

  //设置item间距
  public void setItemSpace(int space) {
    Field[] pickerFields = NumberPicker.class.getDeclaredFields();
    for (Field pf : pickerFields) {
      if (pf.getName().equals("mSelectorTextGapHeight")) {
        pf.setAccessible(true);
        try {
          pf.set(this, space);
        } catch (IllegalAccessException e) {
          e.printStackTrace();
        }
        break;
      }
    }
  }

  // 设置滚轮选择器可见数据项数量
  public void setVisibleItemCount(int num) {
  }

  // 设置滚轮选择器数据项位置，0：中间，1，左边，2：右边
  public void setItemAlign(int align) {
  }

  // 设置文本颜色
  public void setItemTextColor(Integer color) {

  }

  // 设置滚轮选择器是否显示指示器
  public void setIndicator(boolean hasIndicator) {

  }

  // 设置滚轮选择器是否显示幕布
  public void setCurtain(boolean hasCurtain) {

  }

  // 设置滚轮选择器幕布圆角
  public void setCurtainRound(boolean curtainRound) {

  }

  // 设置滚轮选择器幕布颜色
  public void setCurtainColor(Integer color) {

  }

  // 设置滚轮选择器是否有空气感
  public void setAtmospheric(boolean hasAtmospheric) {

  }

  // 滚轮选择器是否开启卷曲效果
  public void setCurved(boolean hasCurved) {

  }

  // 设置滚轮选择器有相同的宽度，可提升性能
  public void setSameWidth(boolean widthSame) {

  }

  // 设置滚轮选择器最宽文本，可提升性能
  public void setMaximumWidthText(String maxWidthText) {

  }

  // 设置滚轮选择器最宽文本索引，可提升性能
  public void setMaximumWidthTextPosition(int maxWidthTextIndex) {

  }
}
