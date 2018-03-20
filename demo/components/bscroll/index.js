import Picker from './picker'
import showPicker from './main'
Picker.install = function (Vue) {
  Vue.component(Picker.name, Picker)
  Vue.prototype.$picker = showPicker;
}

export default Picker