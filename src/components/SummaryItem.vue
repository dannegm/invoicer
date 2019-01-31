<template>
    <div class="summary-item">
        <div class="columns is-gapless">
            <div class="column first">
                <b-input v-model="data.quantity" type="number" @focus="clear" @blur="zero"></b-input>
            </div>
            <div class="column is-half">
                <b-input v-model="data.description"></b-input>
            </div>
            <div class="column">
                <b-input v-model="data.cost" type="number" @focus="clear" @blur="zero"></b-input>
            </div>
            <div class="column">
                <b-input v-model="data.days" type="number" @focus="clear" @blur="zero"></b-input>
            </div>
            <div class="column last">
                <b-input v-model="subtotal" type="number" disabled></b-input>
            </div>
            <div class="column is-delete">
                <a v-if="canRemove" class="delete is-small" @click="$emit('trash', data.uid)"></a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SummaryItem',
    props: {
        uid: String,
        quantity: Number,
        description: String,
        cost: Number,
        days: Number,
        canRemove: Boolean,
    },
    methods: {
        clear (ev) {
            if (ev.target.value == 0) ev.target.value = '';
        },
        zero (ev) {
            if (ev.target.value == '') ev.target.value = 0;
        },
        round (num) {
            return Math.round(num * 100) / 100;
        },
    },
    computed: {
        subtotal: {
            get () {
                return this.round(this.data.quantity * this.data.cost * this.data.days);
            },
            set (value) {
                this.data.subtotal = value;
            }
        }
    },
    mounted () {
        this.data.uid = this.uid;
        this.data.quantity = this.quantity;
        this.data.description = this.description;
        this.data.cost = this.cost;
        this.data.days = this.days;
    },
    watch: {
        data: {
            deep: true,
            handler: function (newD, oldD) {
                this.$emit('change', newD);
            },
        }
    },
    data () {
        return {
            data: {
                uid: '',
                quantity: 0,
                description: '',
                cost: 0,
                days: 0,
                subtotal: 0,
            }
        }
    }
}
</script>

<style lang="scss">
.summary-item {
    margin-bottom: .5em; 

    .is-delete {
        width: 20px;
        flex: none;
        margin: 9px 12px !important;
        margin-bottom: 4px !important;
    }
    .control {
        .input {
            border-radius: 0px;
            box-shadow: none;
            border-color: #dbdbdb;
            border-left: 0px;
            background-color: #fff;
            color: #363636;

            &[type="number"] {
                text-align: right;
            }
        }

        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
    }

    .first input {
        border-left: 1px solid #dbdbdb !important;
        border-radius: 6px 0px 0px 6px !important;
    }
    .last input {
        border-left: 1px solid #dbdbdb !important;
        border-radius: 0px 6px 6px 0px !important;
    }
}
</style>
