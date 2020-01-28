<template>
    <ul class="">

        <li>
            <h5>
                {{ title }}
            </h5>
        </li>


        <!-- 1 -->
        <Item v-for="item in items"
              v-if="!item.isUpdated"
              :key="item.id"
              :item="item"
              @click.native="onItemClick(item)"/>


        <!-- 2 -->
        <!--        <Item v-for="item in filteredItems"-->
        <!--              :key="item.id"-->
        <!--              :item="item"-->
        <!--              @click.native="onItemClick(item)"/>-->
    </ul>
</template>

<script>
    import Item from '@/components/Item'

    export default {
        name: 'ItemList',
        components: {Item},
        props: {
            title: {
                type: String
            }
        },
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
            onItemClick(item) {
                item.isUpdated = true
            }
        },
        async created() {
            const items = await (await fetch('https://jsonplaceholder.typicode.com/photos')).json()
            this.items = items.map(item => ({...item, isUpdated: false})).slice(0, 100)
        },
        updated() {
            console.log('list updated')
        }
    }
</script>

<style scoped>

</style>
