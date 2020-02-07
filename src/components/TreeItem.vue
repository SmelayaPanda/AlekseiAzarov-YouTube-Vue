<template>
    <svg width="500" height="500" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">

        <rect :x="20 * level" width="100" height="100" fill="none" stroke="black"/>

        <g>
            <TreeItem v-if="level < 10" :level="level + 1"/>
        </g>
    </svg>
</template>

<script>
    export default {
        name: 'TreeItem',
        props: {
            level: {
                type: Number,
                required: true
            }
        }
    }
</script>

<style scoped lang="scss">
</style>
