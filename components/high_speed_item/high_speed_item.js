// components/high_speed_item/high_speed_item.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    itemData: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    restrictionClick() {
      this.triggerEvent('confirm', this.data.itemData)
    }
  }
})