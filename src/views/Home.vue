<template>
    <div class="row text-center py-4 mx-0">

        <div v-if="isMobileBrowser" class="text-center mx-auto">
            Не писал код для мобильного, сыграйте на компе пожалуста
        </div>
        <div v-else class="col-12 text-center">
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
                    <h4 class="mb-0">Старт</h4>
                    <div v-if="user && rank !== -1" class="my-2">
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
                    </div>
                    <br>
                    <a href="https://www.youtube.com/channel/UCJh2pGEkh1Y9hkf_LHMVn9A/featured?view_as=subscriber"
                       target="_blank">
                        YouTube
                    </a>
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
                isMobileBrowser: false,

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

            fetchUsers() {
                firebase.firestore()
                    .collection('users')
                    .onSnapshot(users => {
                        const arr = []
                        users.forEach(doc => {
                            arr.push({uid: doc.id, ...doc.data()})
                        })

                        this.users = arr.sort((a,b) => b.score - a.score)
                    })
            },

            onGameOver(score) {
                this.isStarted = false
                let email
                if (this.user && this.user.uid) {
                    if (score < this.user.score) {
                        alert(`
                        Вы набрали ${score}

                        Ваш прошлый результат был лучше (${this.user.score})`
                        )
                    } else {
                        if (this.user.email) {
                            email = prompt(
                                `
                            Ваш новый рекорд - ${score}!

                            Почта (не видна другим) та же?
                            - свяжусь по ней если ты выиграешь 8$!)
                            `, this.user.email)
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
                    }
                    if (email) {
                        firebase.firestore()
                            .collection('users')
                            .doc(firebase.auth().currentUser.uid || Math.random())
                            .set({email, score, date: firebase.firestore.FieldValue.serverTimestamp()})
                        this.$set(this.user, 'score', score)
                        this.$set(this.user, 'email', email)
                    }
                    this.gameKey = Math.random()
                } else {
                    alert('Что-то пошло не так, не могу сохранить ваши данные. Напишите на SmelayaPandaGm@gmail.com')
                }
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
            this.fetchCurrency()

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

            const mobilecheck = function () {
                var check = false;
                (function (a) {
                    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true
                })(navigator.userAgent || navigator.vendor || window.opera)
                return check
            }
            this.isMobileBrowser = mobilecheck()
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
