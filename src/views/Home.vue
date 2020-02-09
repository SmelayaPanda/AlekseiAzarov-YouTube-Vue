<template>
    <div class="row text-center py-4 mx-0">
        <div class="col-12 text-center">
            <div class="d-inline-block" style="border: 2px solid darkgrey">
                <Snake @game-over="onGameOver"
                       :key="gameKey"
                       :bound="400"
                       :cell="25"
                       :speed="200"/>
            </div>

            <template v-if="!isStarted">
                <div @click="start"
                     class="border bg-success text-white mx-auto mt-2 start-btn">
                    <h4>Старт</h4>

                    <div v-if="rank" class="my-2">
                        <small>Сейчас вы на <b>{{ rank }}</b> месте из <b>{{ users.length }}</b> участников</small>
                    </div>
                </div>

                <div class="row views border mb-1">
                    <div v-for="view in views" :key="view.key"
                         @click="activeView = view.key"
                         :class="{ 'bg-secondary text-white': view.key === activeView }"
                         class="col view-tab p-2">
                        {{ view.label }}
                    </div>
                </div>

                <div v-if="activeView === views.info.key">
                    <h3 class="mt-3">Vue Snake Game</h3>
                    <div>Победителю $8 <span class="text-muted">USD</span></div>
                    <small>[ $8 * {{ usd }} = {{ usd * 8 }} рублей ]</small>
                    <br>
                    <div class="text-muted">
                        <small>Результаты - 8 марта 2020г. 12:00 дня по МСК</small>
                        <br>
                        <small>Набравших одинаковое кол-во очков рассудит рандом</small>
                        <br>
                        <br>
                        <small class="text-info">
                            Desktop web-browser version
                        </small>
                    </div>
                </div>
                <ul v-else-if="activeView === views.rating.key" class="list-group">
                    <li v-for="(item, idx) in users" :key="item.uid" class="list-group-item text-left">
                        <small class="badge badge-secondary mr-2"
                               :class="idx === 0 ? 'badge-success' : 'badge-secondary'">
                            {{ idx + 1 }}
                        </small>
                        <small>
                            {{ user && user.uid === item.uid ? 'Вы' : item.uid }}
                        </small>
                        <strong class="float-right">
                            {{ item.score }}
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
                user: null,
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
        computed: {
            rank() {
                if (this.user && this.user.uid && this.user.score) {
                    return 1 + this.users.findIndex(u => u.uid === this.user.uid)
                } else {
                    return -1
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

            firebase.auth().onAuthStateChanged(async user => {
                this.user = user || null
                if (user) {
                    const data = await firebase
                        .firestore()
                        .collection('users')
                        .doc(firebase.auth().currentUser.uid)
                        .get()
                    this.user = data.exists ? {...user, ...data.data()} : user
                } else {
                    this.user = null
                }
            })
        }
    }
</script>

<style lang="scss" scoped>
    .views {
        margin: 16px auto;
        max-width: 404px;

        .view-tab {
            &:hover {
                cursor: pointer;
            }
        }
    }

    .list-group {
        margin: 0 auto;
        max-width: 404px;
        max-height: 300px;
        overflow-y: auto;
    }

    .start-btn {
        width: 404px;
        padding: 8px;

        &:hover {
            cursor: pointer;
        }
    }
</style>
