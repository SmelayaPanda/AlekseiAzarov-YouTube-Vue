<template>
    <div class=" pt-5 mx-0 vh-100">
        <div class="text-center">
            <div class="d-inline-block" style="border: 2px solid darkgrey">

                <Snake :bound="400" :cell="25" :speed="100"/>

            </div>
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
