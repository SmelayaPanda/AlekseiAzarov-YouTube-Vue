<template>
    <li class="media my-3">
        <img :src="item.url" class="item-image mr-3" :alt="item.title">
        <div class="media-body">
            <h6 class="mt-0 mb-1">
                {{ item.id }}.
                {{ getTitle(item) }}
            </h6>
        </div>
    </li>
</template>

<script>
    export default {
        name: 'Item',
        props: {
            item: {
                type: Object,
                required: true
            }
        },
        methods: {
            getTitle(item) {
                console.log(item.id)
                return item.title.toLowerCase()
            }
        },
        beforeUpdate() {
            console.log('updated', this.item.id)
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
