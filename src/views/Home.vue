<template>
    <div class="row text-center pt-4 mx-0">
        <div class="col-12 text-center">
            <div class="d-inline-block" style="border: 2px solid darkgrey">
                <Snake @game-over="onGameOver"
                       :key="gameKey"
                       :bound="360"
                       :cell="20"
                       :speed="200"/>
            </div>

            <template v-if="!isStarted">
                <div @click="start"
                     class="border bg-success text-white mx-auto mt-2 start-btn">
                    Старт
                </div>
                <div class="row views border">
                    <div v-for="view in views" :key="view.key"
                         @click="activeView = view.key"
                         :class="{'bg-secondary text-white': view.key === activeView}"
                         class="col view-tab p-2">
                        {{ view.label }}
                    </div>
                </div>

                <div v-if="activeView === views.info.key">
                    <h3>Vue Snake Game</h3>
                    <div>Победителю $8 <span class="text-muted">USD</span></div>
                    <small>[ 8 * {{ usd }} = {{ usd * 8 }} рублей ]</small>

                    <br>
                    <div class="text-muted">
                        <small>Результаты - 8 марта 2020г. 12:00 дня по МСК</small> <br>
                        <small>Набравших одинаковое кол-во очков рассудит рандом</small> <br>
                        <small>🎉 Потратьте деньги на букет 💐цветов 😀</small>
                    </div>
                </div>
                <ul v-else-if="activeView === views.rating.key" class="list-group">
                    <li v-for="(user, idx) in users" :key="user.uid" class="list-group-item text-left">
                        <small class="badge badge-secondary mr-2"
                               :class="idx === 0 ? 'badge-success' : 'badge-secondary'">
                            {{ idx + 1 }}
                        </small>
                        <small class="">{{ user.uid }}</small>
                        <strong class="float-right">
                            {{ user.score }}
                        </strong>
                    </li>
                </ul>

                <div v-else-if="activeView === views.code.key">
                    <a href="https://gist.github.com/SmelayaPanda/ed5db80a8af5a90a9885de64782aa247" target="_blank">
                        Исходный код
                    </a>
                    <small>(* без ускорения после сьеденого яблока)</small>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
    import Snake from '@/components/prod/SnakeProd'
    import * as firebase from 'firebase/app'
    import axios from 'axios'

    export default {
        name: 'Home',
        components: {Snake},
        data() {
            return {
                isStarted: false,
                gameKey: 1,
                users: [],
                showRating: false,

                usd: 64.00,
                activeView: 'info',
                views: {
                    rating: {
                        key: 'rating',
                        label: 'Рейтинг'
                    },
                    info: {
                        key: 'info',
                        label: 'Инфо'
                    },
                    code: {
                        key: 'code',
                        label: 'Код'
                    }
                }
            }
        },
        methods: {
            start() {
                this.isStarted = true
                this.$emit('start')
            },

            async fetchUsers() {
                const users = await firebase.firestore().collection('users').orderBy('score').get()
                users.forEach(doc => {
                    this.users.push({uid: doc.id, ...doc.data()})
                })
            },

            async onGameOver(score) {
                this.isStarted = false
                const user = await firebase
                    .firestore()
                    .collection('users')
                    .doc(firebase.auth().currentUser.uid)
                    .get()

                let email
                if (user.exists) {
                    if (score < user.data().score) {
                        alert(`
                        Вы набрали ${score}

                        Ваш прошлый результат был лучше (${user.data().score})`
                        )
                    } else {
                        email = prompt(
                            `
                            Ваш новый рекорд - ${score}!

                            Почта (не видна другим) та же?
                            - свяжусь по ней если ты выиграешь 8$!)
                            `, user.data().email)
                    }
                } else {
                    email = prompt(
                        `
                            Игра окончена.
                            Очки ${score}.

                            Попробуй еще!)

                            Укажи свою почту (не видна другим)
                            - свяжусь по ней если ты выиграешь 8$!)
                            `, '@gmail.com')
                }

                if (email) {
                    firebase.firestore()
                        .collection('users')
                        .doc(firebase.auth().currentUser.uid || Math.random())
                        .set({email, score})
                }
                this.gameKey = Math.random()
            },

            fetchCurrency() {
                axios.get('https://free.currconv.com/api/v7/convert?q=USD_RUB&compact=ultra&apiKey=223a110d0b48985561a1')
                    .then(res => {
                        if (res && res.data && res.data.USD_RUB && Number(res.data.USD_RUB)) {
                            this.usd = Number(res.data.USD_RUB)
                        }
                    })
            }
        },
        mounted() {
            this.fetchUsers()
            // this.fetchCurrency()
        }
    }
</script>

<style lang="scss" scoped>
    .views {
        margin: 16px auto;
        max-width: 364px;

        .view-tab {
            &:hover {
                cursor: pointer;
            }
        }
    }

    .list-group {
        margin: 0 auto;
        max-width: 364px;
        max-height: 300px;
        overflow-y: auto;
    }

    .start-btn {
        width: 364px;
        padding: 8px;

        &:hover {
            cursor: pointer;
        }
    }
</style>
