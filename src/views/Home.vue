<template>
    <div class="row justify-content-center pt-5">
        <div class="col-12 text-left" style="max-width: 300px">


            <ItemList/>


        </div>
    </div>
</template>

<script>
    import ItemList from '@/components/ItemList'

    export default {
        name: 'Home',
        components: {ItemList}
    }
</script>
