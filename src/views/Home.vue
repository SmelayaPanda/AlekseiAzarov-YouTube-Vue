<template>
    <div class=" pt-5 mx-0 vh-100">
        <div class="text-center">

            <div class="d-inline-block" style="border: 2px solid darkgrey">
                <Snake @game-over="onGameOver"
                       :key="gameKey"
                       :bound="400"
                       :cell="25"
                       :speed="100"/>
            </div>

            <div class="list-group"></div>

        </div>
    </div>
</template>

<script>
    import Snake from '@/components/Snake'
    import * as firebase from 'firebase/app'

    export default {
        name: 'Home',
        components: {Snake},
        data() {
            return {
                gameKey: 1
            }
        },
        methods: {
            async onGameOver(score) {
                const user = await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).get()

                let email
                if (user.exists) {
                    if (score < user.data().score) {
                        alert('Ваш прошлый результат был лучше')
                    } else {
                        email = prompt(
                            `
                            Ваш новый рекорд - ${score}!

                            Почта та же?
                            - свяжусь по ней если ты выиграешь 230р!)
                            `, user.data().email)
                    }
                } else {
                    email = prompt(
                        `
                            Игра окончена.
                            Очки ${score}.

                            Попробуй еще!)

                            Укажи свою почту (не видна другим)
                            - свяжусь по ней если ты выиграешь 230р!)
                            `, '@gmail.com')
                }

                if (email) {
                    firebase.firestore()
                        .collection('users')
                        .doc(firebase.auth().currentUser.uid || Math.random())
                        .set({email, score})
                }
                this.gameKey = Math.random()
            }
        },
        mounted() {
            alert(
                `Привет =)\n
                Победителю 230 рублей в честь 23 февраля!

                (Результаты - 23 февр. 2020г. 12:00 дня по МСК)
                (Набравших одинаковое кол-во очков рассудит рандом)`)
        }
    }
</script>
