<template>
    <li class="media">
        <img :src="item.url" class="item-image mr-3" :alt="item.title">
        <div class="media-body">
            <h6 class="mt-0 mb-1">{{ item.title }}</h6>
            {{ item.id }}
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
