import Vue from 'vue'
// import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import * as firebase from 'firebase/app'
// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import 'firebase/analytics'
import 'firebase/auth'

import 'firebase/firestore'

Vue.config.productionTip = false

const firebaseConfig = {
    apiKey: 'AIzaSyD7vGWoUR3qyQ8g2BDRb4UeHCMedEqHHVc',
    authDomain: 'snake-23feb2020.firebaseapp.com',
    databaseURL: 'https://snake-23feb2020.firebaseio.com',
    projectId: 'snake-23feb2020',
    storageBucket: 'snake-23feb2020.appspot.com',
    messagingSenderId: '185136299368',
    appId: '1:185136299368:web:26ce72053d43c8a09f2add',
    measurementId: 'G-JDJHJ2G3DG'
}
firebase.initializeApp(firebaseConfig)

new Vue({
    router,
    store,
    render: h => h(App),
    mounted() {
        firebase.auth().signInAnonymously().catch(function (error) {
            alert('Что-то пошло не так, напишите на SmelayaPandaGm@gmail.com')
        })
    }
}).$mount('#app')
