import Picker from './picker'
import Vue from 'vue'

let instance
const PickerConstructor = Vue.extend(Picker)

const initInstance = (props, on) => {
  // instance = new PickerConstructor({
  //   el: document.createElement('div'),
  //   propsData
  // });

  instance = new Vue({
    render(createElement) {
      return createElement(Picker, { 
        props,
        on
      }, [])
    }
  })
};


const showPicker = (props, on) => {
  if (!instance) {
    initInstance(props, on);
    instance.$mount()
  }
  document.body.appendChild(instance.$el);
  return instance.$children[0]
}
export default showPicker
// 1, 多次调用全局组件,单例
// 2, 初始参数如何传事件
// 3, 生命周期结束应 destroy