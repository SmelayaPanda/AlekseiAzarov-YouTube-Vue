<template>
    <div class="row justify-content-center pt-5">
        <div class="col-12 text-left" style="max-width: 300px">


            <ItemList :title="title" @click.native="updateTitle"/>


        </div>
    </div>
</template>

<script>
    import ItemList from '@/components/ItemList'

    export default {
        name: 'Home',
        components: {ItemList},
        data() {
            return {
                title: 'Click me to update'
            }
        },
        methods: {
            updateTitle( ) {
                this.title = new Date().toLocaleString()
            }
        }
    }
</script>
