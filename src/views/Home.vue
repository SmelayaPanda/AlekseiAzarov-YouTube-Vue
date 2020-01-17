<template>
    <div class="row justify-content-center pt-5">
        <div class="col-12 text-left" style="max-width: 300px">


            <BaseInput
                v-model="value"
                id="base_input"
                type="text"
                label="First input"
                placeholder="Type..."
                class="text-success"
                :autofocus="false"
                autocomplete="off"
                :required="true"
                :disabled="false"
                @change="onChange"
                @focus="onFocus"
                @blur="onBlur"
                @submit="onSubmit"
                @keyup.esc.native="onEscape"/>


        </div>
    </div>
</template>

<script>
    import BaseInput from '@/components/BaseInput'

    export default {
        name: 'Home',
        components: {BaseInput},
        data() {
            return {
                value: ''
            }
        },
        methods: {
            onInput(val) {
                console.log('onInput', val)
            },

            onChange(val) {
                console.log('onChange', val)
            },

            onFocus() {
                console.log('onFocus')
            },

            onBlur() {
                console.log('onBlur')
            },

            onEscape() {
                console.log('onEscape')
            },

            onSubmit() {
                console.log('onSubmit')
            }
        }
    }
</script>
