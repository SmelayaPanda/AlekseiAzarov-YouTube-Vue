<template>
    <div class="position-relative">

        <label class="d-block mb-0">
            {{ label }}
            <input
                :id="id"
                :type="type"
                :value="value"
                :required="required"
                :disabled="disabled"
                :placeholder="placeholder"
                :autofocus="autofocus"
                :autocomplete="autocomplete"
                @input="onInput"
                @change="onChange"
                @focus="onFocus"
                @blur="onBlur"
                class="form-control">
        </label>

        <!-- DROPDOWN -->
        <div v-if="dropdown" class="app-dropdown">
            <!-- mock values -->
            <div v-for="el in options">
                {{ el }}
            </div>
        </div>

        <!-- VALIDATION MESSAGE -->
        <small v-if="invalid" class="text-danger">
            Enter a valid value
        </small>
    </div>

</template>

<script>
    export default {
        name: 'BaseInput',
        props: {
            label: {
                type: String,
                required: false
            },
            value: {
                type: [String, Number, Date],
                required: true
            },
            placeholder: {
                type: String,
                required: false,
                default: 'Enter a value'
            },
            id: {
                type: String,
                required: false
            },
            type: {
                type: String,
                default: 'text',
                validator: function (value) {
                    return ['text', 'email', 'number', 'date', 'password', 'url']
                        .indexOf(value) !== -1
                }
            },
            required: {
                type: Boolean,
                required: false,
                default: false
            },
            autofocus: {
                type: Boolean,
                required: false,
                default: false
            },
            autocomplete: {
                type: String,
                required: false,
                default: 'on',
                validator: function (value) {
                    return ['on', 'off'].indexOf(value) !== -1
                }
            },
            disabled: {
                type: Boolean,
                required: false,
                default: false
            }
        },
        data() {
            return {
                invalid: true,
                dropdown: false,

                options: [
                    'one',
                    'two',
                    'three',
                    'four'
                ]
            }
        },
        methods: {
            onFocus() {
                this.$emit('focus')
                this.dropdown = true
            },

            onBlur() {
                this.$emit('blur')
                this.dropdown = false
            },

            onInput(event) {
                this.checkValidity(event.target.value)
                this.$emit('input', event.target.value)
            },

            onChange(event) {
                this.$emit('input', event.target.value)
            },

            checkValidity(val) {
                if (this.required) {
                    this.invalid = !val
                }
                // some other validation logic
            }
        }
    }
</script>

<style lang="scss" type="text/css">
    .app-dropdown {
        position: absolute;
        z-index: 100000;
        width: 100%;
        border: 1px solid #ced4da;
        border-radius: 0 0 3px 3px;
        background: white;
        padding: 5px;
    }
</style>
