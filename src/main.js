import { createApp } from 'vue';
import App from './App.vue';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import { createRouter, createWebHistory } from 'vue-router';
import ProjectEdit from './components/pages/ProjectEdit';
import ProjectShow from './components/pages/ProjectShow';
import ProjectList from './components/pages/ProjectList';
import notifikasi from './components/pages/notifikasi';
import riwayat from './components/pages/riwayat';
import databarang from './components/pages/databarang';
import tambahdatabarang from './components/pages/tambahdatabarang';
import showdatabarang from './components/pages/showdatabarang';
import editdatabarang from './components/pages/editdatabarang';
import ProjectLogin from './components/pages/LoginPage';
  
axios.defaults.baseURL = process.env.VUE_APP_API_URL
axios.interceptors.request.use(function (config) {
  config.headers['X-Binarybox-Api-Key'] = process.env.VUE_APP_API_KEY;
  return config;
});
  
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: ProjectLogin },
    { path: '/edit/:id', component: ProjectEdit },
    { path: '/show/:id', component: ProjectShow },
    { path: '/list', component: ProjectList },
    { path: '/notifikasi', component: notifikasi },
    { path: '/riwayat', component: riwayat },
    { path: '/databarang', component: databarang },
    { path: '/tambahdatabarang', component: tambahdatabarang },
    { path: '/showdatabarang/:id', component: showdatabarang },
    { path: '/editdatabarang/:id', component: editdatabarang },
  ],
});
  
createApp(App).use(router).mount('#app');