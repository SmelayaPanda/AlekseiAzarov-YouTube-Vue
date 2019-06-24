<template>
    <div class="container">

        <!-- 1 -->
        <button @click="create" class="btn btn-primary" :disabled="isLoading">
            <span v-if="isLoading" class="row justify-content-center">
                <span class="spinner-border spinner-border-sm align-self-center"></span>
            </span>
            <span v-else>
                Create
            </span>
        </button>

        <hr class="mt-3">

        <!-- 2 -->
        <button v-loading.btn="isUpdating" @click="update" class="btn btn-primary">
            Update
        </button>

        <hr class="mt-3">   
        <button v-loading.btn="isLoading" @click="create" class="btn btn-primary">
            Delete
        </button>
    </div>
</template>

<script>
    import Vue from 'vue'

    const state = new WeakMap()

    Vue.directive('loading', {
        bind: (el) => {
            state.set(el, el.innerText.trim())
        },
        update: (el, binding) => {
            console.log(binding)
            if (binding.value) { // isLoading = true
                el.disabled = true
                if (binding.modifiers.spinner) {
                    el.innerHTML = `
                        <span class="row justify-content-center">
                            <span class="spinner-border spinner-border-sm align-self-center"></span>
                        </span>
                    `
                } else {
                    el.innerHTML = 'Loading...'
                }
            } else { // isLoading = false
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
                isLoading: false,
                isUpdating: false
            }
        },
        methods: {
            create() {
                this.isLoading = true
                setTimeout(() => {
                    this.isLoading = false
                }, 2000)
            },

            update() {
                this.isUpdating = true
                setTimeout(() => {
                    this.isUpdating = false
                }, 2000)
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
