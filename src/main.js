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
    apiKey: "AIzaSyCfKDQyrgsy1QpZjJQAfZ5dRz55MyyfJao",
    authDomain: "snakegame-alekseyazarov.firebaseapp.com",
    databaseURL: "https://snakegame-alekseyazarov.firebaseio.com",
    projectId: "snakegame-alekseyazarov",
    storageBucket: "snakegame-alekseyazarov.appspot.com",
    messagingSenderId: "1014708943943",
    appId: "1:1014708943943:web:87c2dba259bd1985dc8562",
    measurementId: "G-76W0DQB1C6"
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
