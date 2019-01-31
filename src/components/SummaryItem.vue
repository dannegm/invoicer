<template>
    <div class="summary-item">
        <div class="columns">
            <div class="column">
                <b-input v-model="data.quantity" type="number" @focus="clear" @blur="zero"></b-input>
            </div>
            <div class="column">
                <b-input v-model="data.description"></b-input>
            </div>
            <div class="column">
                <b-input v-model="data.cost" type="number" @focus="clear" @blur="zero"></b-input>
            </div>
            <div class="column">
                <b-input v-model="data.days" type="number" @focus="clear" @blur="zero"></b-input>
            </div>
            <div class="column">
                <b-input v-model="subtotal" disabled></b-input>
            </div>
            <div class="column">
                <button class="button is-danger" @click="$emit('trash', data.uid)">
                    <span class="icon is-small">
                        <i class="fas fa-trash"></i>
                    </span>
                </button>
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
    },
    methods: {
        clear (ev) {
            if (ev.target.value == 0) ev.target.value = '';
        },
        zero (ev) {
            if (ev.target.value == '') ev.target.value = 0;
        }
    },
    computed: {
        subtotal: {
            get () {
                return this.data.quantity * this.data.cost * this.data.days;
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

<style lang="scss" scoped>
.summary-item {
}
</style>
