<template>
    <svg :width="bound" :height="bound" :viewBox="`0 0 ${bound + 1} ${bound + 1}`">
        <!-- snake --><rect v-for="(el, i) in p.slice(0, score)" :x="el[0]" :y="el[1]" :width="cell" :height="cell" :fill="i === 0 ? 'grey' : 'darkgrey'"/>
        <!-- fruit --><rect :x="f[0]" :y="f[1]" :width="cell" :height="cell" fill="red"/>
    </svg>
</template>
<script>
    export default {
        props: ['bound', 'cell', 'speed'],
        data() {
            return {
                score: 0,
                f: [0, 0],  // fruit [x, y]
                d: [0, 0],  // direction [dx, dy]
                p: [[0, 0]] // paths [[x1, y1], [x2, y2]...]
            }
        },
        created() {
            const getRandomCell = () => this.cell * Math.round(Math.random() * Math.round(-1 + this.bound / this.cell))
            const interval = setInterval(() => {
                this.p.unshift([this.p[0][0] + this.d[0], this.p[0][1] + this.d[1]]) // write path
                if (!this.score || (this.f[0] === this.p[0][0] && this.f[1] === this.p[0][1])) { // set fruit
                    this.score++
                    this.f = [getRandomCell(), getRandomCell()]
                }
                if ((this.p[0][0] < 0 || this.p[0][1] < 0 || this.p[0][0] >= this.bound || this.p[0][1] >= this.bound) || // 1. bound rect
                    ([...new Set(this.p.slice(0, this.score).map(i => i[0] + '' + i[1]))].length !== this.p.slice(0, this.score).length)) { // 2. self crash
                    this.$emit('game-over', this.score)
                    // alert(`Game over. Your score ${this.score}`)
                    clearInterval(interval)
                }
            }, this.speed)
            const arr = {'ArrowLeft': [-this.cell, 0], 'ArrowRight': [this.cell, 0], 'ArrowUp': [0, -this.cell], 'ArrowDown': [0, this.cell]}
            window.onkeydown = e => this.d = arr[e.key] || [0, 0]
        }
    }
</script>
