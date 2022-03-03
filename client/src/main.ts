import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import MyToken from '@/types/MyToken';
import jwt_decode from "jwt-decode";

const token = localStorage.getItem('token');
const refresh_token = localStorage.getItem('refresh_token');
const address = localStorage.getItem('address');
if (token != null && address != null && refresh_token != null) {
  const currentDate = new Date();
  const decodedToken = jwt_decode<MyToken>(token as string);
  if (decodedToken.exp * 1000 < currentDate.getTime()) {
    store.dispatch('refresh', refresh_token);
  } else {
    store.dispatch('fetch');
  }
}

createApp(App)
.use(store)
.use(router)
.mount('#app')