import Vue from 'vue'
import Picker from './components/bscroll'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
Vue.use(Picker)
import App from './App'

new Vue({
  el: '#app',
  // render: (h) => h(App)
  template: '<App><App/>',
  components: {
    App
  }
})

