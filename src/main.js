import '@babel/polyfill'

import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'

import router from './router'
import store from './store'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@fortawesome/fontawesome-free/css/all.css';
import { auth } from "@/firebase";
import VueChatScroll from 'vue-chat-scroll'
Vue.use(VueChatScroll)

Vue.config.productionTip = false



auth.onAuthStateChanged(function(user) {
    console.log(user);


    if (user) { //antes de que se rendereé la app primero se pregunta si hay usuario autenticfado o no
        //setUusuario se ejecuta  si se esta autenticado 
        store.dispatch('setUsuario', user);
    }

    new Vue({
        router,
        store,
        render: h => h(App),
    }).$mount('#app')
});