<template>
    <div class="row justify-content-center pt-5 mx-0">
        <div class="col-12 text-center">

            <Snake :bound="400" :cell="50" :speed="500"/>

        </div>
    </div>
</template>

<script>
    import Snake from '@/components/Snake'

    export default {
        name: 'Home',
        components: {Snake}
    }
</script>
