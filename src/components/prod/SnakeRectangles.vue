<template>
    <rect :x="x" :y="y"
          :width="cell"
          :height="cell"
          :fill="i === 0 ? 'grey' : 'darkgrey'"/>
</template>
<script>
    export default {
        name: 'SnakeRectangles',
        props: {
            x: {},
            y: {},
            i: {},
            cell: {}
        }
    }
</script>
