<template>
    <svg :width="bound" :height="bound" :viewBox="`0 0 ${bound + 1} ${bound + 1}`">
        <!-- snake -->
        <SnakeRectangles v-for="(el, i) in snake" :i="i" :x="el[0]" :y="el[1]" :cell="cell"/>
        <!-- fruit -->
        <rect :x="f[0]" :y="f[1]" :width="cell" :height="cell" fill="red"/>
    </svg>
</template>
<script>
    import SnakeRectangles from '@/components/prod/SnakeRectangles'

    export default {
        components: {SnakeRectangles},
        props: ['bound', 'cell', 'speed'], // Numbers
        data() {
            return {
                score: 0,
                f: [0, 0],  // fruit [x, y]
                d: [this.cell, 0],  // direction [dx, dy]
                p: [[0, 0]] // paths [[x1, y1], [x2, y2]...]
            }
        },
        computed: {
            snake() {
                return this.p.slice(0, this.score)
            }
        },
        methods: {
            start() {
                const startTime = new Date().getTime()
                const getRandomCell = () => this.cell * Math.round(Math.random() * Math.round(-1 + this.bound / this.cell))
                let timer = true
                const interval = () => {
                    this.p.unshift([this.p[0][0] + this.d[0], this.p[0][1] + this.d[1]]) // write path
                    if (!this.score || (this.f[0] === this.p[0][0] && this.f[1] === this.p[0][1])) { // set fruit
                        this.score++
                        this.f = [getRandomCell(), getRandomCell()]
                    }
                    if ((this.p[0][0] < 0 || this.p[0][1] < 0 || this.p[0][0] >= this.bound || this.p[0][1] >= this.bound) || // 1. bound rect
                        ([...new Set(this.snake.map(i => i[0] + '' + i[1]))].length !== this.snake.length)) { // 2. self crash
                        this.$emit('game-over', this.score, new Date().getTime() - startTime)
                        clearTimeout(timer)
                        timer = null
                    }
                    if (timer) {
                        timer = setTimeout(interval, this.speed - this.score * 4)
                    }
                }
                setTimeout(interval, this.speed)
            }
        },
        created() {
            const arr = {
                'ArrowLeft': [-this.cell, 0],
                'ArrowRight': [this.cell, 0],
                'ArrowUp': [0, -this.cell],
                'ArrowDown': [0, this.cell]
            }
            window.onkeydown = e => this.d = arr[e.key] || [0, 0]

            this.$parent.$on('start', this.start)
        }
    }
</script>
