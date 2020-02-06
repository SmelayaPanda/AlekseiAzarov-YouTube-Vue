<template>
    <ul>
        <li>
            <h5 @click="onTitleClick">
                {{ date }}
            </h5>
        </li>

        <!--                v-if="!item.isUpdated"-->

        <li v-for="item in items"
            v-if="!item.isUpdated"
            :key="item.id"
            @click="onItemClick(item)"
            class="media my-3">
<!--            <img :src="item.url" class="item-image mr-3" :alt="item.title">-->
            <div class="media-body">
                <h6 class="mt-0 mb-1">
                    {{ item.id }}.
                    {{ getTitle(item) }}
                </h6>
            </div>
        </li>

        <!-- 1 -->
        <!--        <Item v-for="item in items"-->
        <!--              v-if="!item.isUpdated"-->
        <!--              :key="item.id"-->
        <!--              :item="item"-->
        <!--              @click.native="onItemClick(item)"/>-->


        <!-- 2 -->
        <!--                <Item v-for="item in filteredItems"-->
        <!--                      :key="item.id"-->
        <!--                      :item="item"-->
        <!--                      @click.native="onItemClick(item)"/>-->
    </ul>
</template>

<script>
    import Item from '@/components/Item'

    export default {
        name: 'ItemList',
        components: {Item},
        data() {
            return {
                items: [],

                date: new Date()
            }
        },
        computed: {
            filteredItems() {
                return this.items.filter(item => !item.isUpdated)
            }
        },
        methods: {
            onItemClick(item) {
                console.log('Item click')
                item.isUpdated = true
            },

            onTitleClick(item) {
                console.log('Title click')
                this.date = new Date()
            },

            getTitle(item) {
                // console.log(item.id)
                return item.title.toLowerCase()
            }
        },
        async created() {
            const items = await (await fetch('https://jsonplaceholder.typicode.com/photos')).json()
            this.items = items.map(item => ({...item, isUpdated: false}))
        },
        updated(params) {
            console.log('list updated')
        }
    }
</script>

<style scoped lang="scss">
    .item-image {
        width: 50px;
        height: 50px;
        object-fit: contain;
    }

    .media {
        &:hover {
            cursor: pointer;
        }
    }
</style>
