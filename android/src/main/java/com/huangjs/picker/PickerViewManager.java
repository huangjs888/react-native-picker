package com.huangjs.picker;

import android.graphics.Typeface;
import android.os.Handler;
import android.os.Looper;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

public class PickerViewManager extends SimpleViewManager<PickerView> {
  private static final String REACT_CLASS = "PickerView";
  private final ReactApplicationContext reactAppContext;

  public PickerViewManager(ReactApplicationContext context) {
    this.reactAppContext = context;
  }

  @NonNull
  @Override
  public String getName() {
    return REACT_CLASS;
  }

  @NonNull
  @Override
  public PickerView createViewInstance(@NonNull ThemedReactContext themedContext) {
    return new PickerView(themedContext, reactAppContext);
  }

  @Override
  public void onDropViewInstance(@NonNull PickerView view) {
    super.onDropViewInstance(view);
  }

  @Override
  public Map getExportedCustomDirectEventTypeConstants() {
    Map export = super.getExportedCustomDirectEventTypeConstants();
    if (export == null) {
      export = MapBuilder.newHashMap();
    }
    export.put("onChange", MapBuilder.of("registrationName", "onChange"));
    export.put("onScrollStateChange", MapBuilder.of("registrationName", "onScrollStateChange"));
    return export;
  }

  @ReactProp(name = "selectedIndex")
  public void setSelectedIndex(final PickerView picker, final int index) {
    if (picker != null) {
      picker.setSelectedIndex(index);
    }
  }

  @ReactProp(name = "items")
  public void setData(PickerView picker, ReadableArray items) {
    if (picker != null) {
      picker.setData(items.toArrayList());
    }
  }

  @ReactProp(name = "selectTextColor", customType = "Color")
  public void setSelectedTextColor(PickerView picker, Integer color) {
    if (picker != null) {
      picker.setSelectedItemTextColor(color);
    }
  }

  @ReactProp(name = "textColor", customType = "Color")
  public void setTextColor(PickerView picker, Integer color) {
    if (picker != null) {
      picker.setItemTextColor(color);
    }
  }

  @ReactProp(name = "fontFamily")
  public void setFontFamily(PickerView picker, String fontFamily) {
    if (picker != null) {
      Typeface typeface = Typeface.create(fontFamily, Typeface.NORMAL);
      picker.setTypeface(typeface);
    }
  }

  @ReactProp(name = "textSize")
  public void setTextSize(PickerView picker, int size) {
    if (picker != null) {
      picker.setItemTextSize((int) PixelUtil.toPixelFromDIP(size));
    }
  }

  @ReactProp(name = "itemSpace")
  public void setItemSpace(PickerView picker, int space) {
    if (picker != null) {
      picker.setItemSpace((int) PixelUtil.toPixelFromDIP(space));
    }
  }

  // 设置滚轮选择器是否显示指示器
  @ReactProp(name = "indicator")
  public void setIndicator(PickerView picker, boolean hasIndicator) {
    if (picker != null) {
      picker.setIndicator(hasIndicator);
    }
  }

  // 设置滚轮选择器指示器颜色
  @ReactProp(name = "indicatorColor", customType = "Color")
  public void setIndicatorColor(PickerView picker, Integer color) {
    if (picker != null) {
      picker.setIndicatorColor(color);
    }
  }

  // 设置滚轮选择器指示器尺寸
  @ReactProp(name = "indicatorSize")
  public void setIndicatorSize(PickerView picker, int size) {
    if (picker != null) {
      picker.setIndicatorSize((int) PixelUtil.toPixelFromDIP(size));
    }
  }

  // 设置滚轮选择器是否显示幕布
  @ReactProp(name = "curtain")
  public void setCurtain(PickerView picker, boolean hasCurtain) {
    if (picker != null) {
      picker.setCurtain(hasCurtain);
    }
  }

  // 设置滚轮选择器幕布圆角
  @ReactProp(name = "curtainRound")
  public void setCurtainRound(PickerView picker, boolean curtainRound) {
    if (picker != null) {
      picker.setCurtainRound(curtainRound);
    }
  }

  // 设置滚轮选择器幕布颜色
  @ReactProp(name = "curtainColor", customType = "Color")
  public void setCurtainColor(PickerView picker, Integer color) {
    if (picker != null) {
      picker.setCurtainColor(color);
    }
  }

  // 设置滚轮选择器是否有空气感
  @ReactProp(name = "atmospheric")
  public void setAtmospheric(PickerView picker, boolean hasAtmospheric) {
    if (picker != null) {
      picker.setAtmospheric(hasAtmospheric);
    }
  }

  // 滚轮选择器是否开启卷曲效果
  @ReactProp(name = "curved")
  public void setCurved(PickerView picker, boolean hasCurved) {
    if (picker != null) {
      picker.setCurved(hasCurved);
    }
  }

  // 设置滚轮选择器可见数据项数量
  @ReactProp(name = "itemCount")
  public void setVisibleItemCount(PickerView picker, int num) {
    if (picker != null) {
      picker.setVisibleItemCount(num);
    }
  }

  // 设置滚轮选择器数据项位置，0：中间，1，左边，2：右边
  @ReactProp(name = "itemAlign")
  public void setItemAlign(PickerView picker, int align) {
    if (picker != null) {
      picker.setItemAlign(align);
    }
  }

  // 设置滚轮选择器滚动循环
  @ReactProp(name = "cyclic")
  public void setCyclic(PickerView picker, boolean cycle) {
    if (picker != null) {
      picker.setCyclic(cycle);
    }
  }

  // 设置滚轮选择器有相同的宽度，可提升性能
  @ReactProp(name = "widthSame")
  public void setWidthSame(PickerView picker, boolean widthSame) {
    if (picker != null) {
      picker.setSameWidth(widthSame);
    }
  }

  // 设置滚轮选择器最宽文本，可提升性能
  @ReactProp(name = "maxWidthText")
  public void setMaximumWidthText(PickerView picker, String maxWidthText) {
    if (picker != null) {
      picker.setMaximumWidthText(maxWidthText);
    }
  }

  // 设置滚轮选择器最宽文本索引，可提升性能
  @ReactProp(name = "maxWidthTextIndex")
  public void setMaximumWidthTextIndex(PickerView picker, int maxWidthTextIndex) {
    if (picker != null) {
      picker.setMaximumWidthTextPosition(maxWidthTextIndex);
    }
  }


}
