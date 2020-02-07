<template>
    <svg :width="bound" :height="bound" :viewBox="`0 0 ${bound + 1} ${bound + 1}`">
        <pattern id="grid" :width="cell" :height="cell" patternUnits="userSpaceOnUse">
            <path :d="`M ${cell} 0 L 0 0 0 ${cell}`" fill="none" stroke="gray" stroke-width="1"/>
        </pattern>
        <!-- grid  --><rect width="100%" height="100%" fill="url(#grid)"/>
        <!-- snake --><rect v-for="(i, idx) in p.slice(0, score)" :x="i[0]" :y="i[1]" :width="cell" :height="cell" :rx="10" :ry="10" :fill="idx === 0 ? 'black' : 'grey'"/>
        <!-- eat  --><rect :x="eat[0]" :y="eat[1]" :width="cell" :height="cell" fill="red"/>
    </svg>
</template>
<script>
    export default {
        props: ['bound', 'cell', 'speed'],
        data() {
            return {
                score: 0,
                eat: [0, 0],  // [x, y]
                d: [0, 0],   // direction [dx, dy]
                p: [[0, 0]] // paths [[x1, y1], [x2, y2]...]
            }
        },
        created() {
            const getRandomCell = () => this.cell * Math.round(Math.random() * Math.round((this.bound - this.cell) / this.cell))
            const interval = setInterval(() => {
                this.p.unshift([this.p[0][0] + this.d[0], this.p[0][1] + this.d[1]])
                if (!this.score || (this.eat[0] === this.p[0][0] && this.eat[1] === this.p[0][1])) { // start || eat
                    this.score++
                    this.eat = [getRandomCell(), getRandomCell()]
                }
                if ((this.p[0][0] < 0 || this.p[0][1] < 0 || this.p[0][0] >= this.bound || this.p[0][1] >= this.bound) || // 1. bound rect
                    ([...new Set(this.p.slice(0, this.score).map(i => i[0] + '' + i[1]))].length !== this.p.slice(0, this.score).length)) { // 2. self crash
                    alert(`Game over. Your score ${this.score}`); clearInterval(interval)
                }
            }, this.speed)
            const arrow = {'ArrowLeft': [-this.cell, 0], 'ArrowRight': [this.cell, 0], 'ArrowUp': [0, -this.cell], 'ArrowDown': [0, this.cell]}
            window.onkeydown = event => this.d = arrow[event.key] || [0, 0]
        }
    }
</script>
