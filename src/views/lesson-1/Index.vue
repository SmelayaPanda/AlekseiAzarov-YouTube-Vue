<template>
    <div class="container">

<!--        <button @click="create" class="btn btn-primary" :disabled="isLoading">-->
<!--            <span v-if="isLoading" class="row justify-content-center">-->
<!--                <span class="spinner-border spinner-border-sm align-self-center"></span>-->
<!--            </span>-->
<!--            <span v-else>-->
<!--                Create-->
<!--            </span>-->
<!--        </button>-->

        <button v-loading.spinner="isLoading" @click="create" class="btn btn-primary">
            Create
        </button>

        <hr>

        <button v-loading.text="isLoading" @click="create" class="btn btn-secondary">
            Delete
        </button>

    </div>
</template>

<script>
    import Vue from 'vue'

    let state = new WeakMap()

    Vue.directive('loading', {
        bind: el => {
           state.set(el, el.innerText.trim())
        },
        update: (el, binding) => {
            console.log(binding)
            if (binding.value) { // isLoading === true
                el.disabled = true
                if (binding.modifiers.spinner) {
                    el.innerHTML = `
                        <span class="row justify-content-center">
                            <span class="spinner-border spinner-border-sm align-self-center"></span>
                        </span>
                        `
                } else if (binding.modifiers.text) {
                    el.innerText = 'Loading...'
                }
            } else { // isLoading === false
                el.innerText = state.get(el)
                el.disabled = false
            }
        },
        unbind: el => {
            state.delete(el)
        }
    })

    export default {
        name: 'Index',
        data() {
            return {
                isLoading: false
            }
        },
        methods: {
            create() {
                this.isLoading = true
                setTimeout(() => {
                    this.isLoading = false
                }, 1000)
            }
        }
    }
</script>

<style scoped lang="scss">
    .container {
        margin-top: 100px;
    }

    button {
        width: 120px;
        height: 40px;
    }
</style>
