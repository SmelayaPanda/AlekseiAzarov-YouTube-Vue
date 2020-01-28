<template>
    <ul class="list-unstyled">

        <!-- 1 -->
<!--        <Item v-for="item in items"-->
<!--              v-if="!item.isUpdated"-->
<!--              :key="item.id"-->
<!--              :item="item"-->
<!--              @click.native="onItemClick(idx)"/>-->


        <!-- 2 -->
        <Item v-for="(item, idx) in filteredItems"
              :key="item.id"
              :item="item"
              @click.native="onItemClick(idx)"/>
    </ul>
</template>

<script>
    import Item from '@/components/Item'
    export default {
        name: 'ItemList',
        components: {Item},
        data() {
            return {
                items: []
            }
        },
        computed: {
            filteredItems() {
                return this.items.filter(item => !item.isUpdated)
            }
        },
        methods: {
            onItemClick(idx) {
                console.log(idx)
                // this.$set(this.items[idx], 'id',  new Date().getTime())
                this.$set(this.items[idx], 'isUpdated',  true)
            }
        },
        async mounted() {
            const items = await (await fetch('https://jsonplaceholder.typicode.com/photos')).json()
            this.items = items.slice(0, 20)
        }
    }
</script>

<style scoped>

</style>
