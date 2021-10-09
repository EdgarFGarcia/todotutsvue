import Vue from 'vue'
import App from './App.vue'
import store from './store/index.js'
import vuetify from './plugins/vuetify'
import axios from './plugins/axios.js'

Vue.config.productionTip = false

Vue.use(axios)

new Vue({
  store: store,
  vuetify,
  render: h => h(App)
}).$mount('#app')