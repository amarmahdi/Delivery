import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/tailwind.css'
import store from './store'
import { sync } from 'vuex-router-sync'

sync(store, router)

createApp(App).use(store).use(router).mount('#app')
