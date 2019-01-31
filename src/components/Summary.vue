<template>
    <div class="summary">
        <div class="box">
            <a class="delete" @click="$emit('trash', data.uid)"></a>
            <b-field label="Name">
                <b-input v-model="data.name"></b-input>
            </b-field>

            <div class="columns">
                <div class="column">
                    <b>Cantidad</b>
                </div>
                <div class="column">
                    <b>Descripción</b>
                </div>
                <div class="column">
                    <b>Importe</b>
                </div>
                <div class="column">
                    <b>Días</b>
                </div>
                <div class="column">
                    <b>Subtotal</b>
                </div>
                <div class="column">
                </div>
            </div>

            <SummaryItem
                v-for="item in data.items"
                :key="item.uid"
                :uid="item.uid"
                :quantity="parseFloat(item.quantity)"
                :description="item.description"
                :cost="parseFloat(item.cost)"
                :days="parseFloat(item.days)"
                @change="changeRowWith"
                @trash="removeRowAt" />

            <br />
            <button class="button" @click="addNewRow">
                <span>Añadir</span>
                <span class="icon is-small">
                    <i class="fas fa-plus"></i>
                </span>
            </button>

        </div>
    </div>
</template>

<script>
import uuid from 'uuid/v4';
import SummaryItem from '@/components/SummaryItem';

export default {
    name: 'Summary',
    props: {
        uid: String,
        name: String,
        items: Array,
    },
    components: {
        SummaryItem,
    },
    methods: {
        removeRowAt (uid) {
            this.data.items = this.data.items.filter (i => i.uid != uid);
        },
        changeRowWith (item) {
            this.data.items.forEach ((i, index) => {
                if (i.uid == item.uid) {
                    this.data.items [index] = item;
                }
            });
            this.calculateSubtotal ();
        },
        addNewRow () {
            this.data.items.push ({
                uid: uuid(),
                quantity: 0,
                description: '',
                cost: 0,
                days: 0,
            });
        },
        calculateSubtotal () {
            const accumulator = (acc, cur) => ({ subtotal: acc.subtotal + cur.subtotal });
            this.data.subtotal = this.items.reduce(accumulator, { subtotal: 0 }).subtotal;
        },
    },
    mounted () {
        this.data.uid = this.uid;
        this.data.name = this.name;
        this.data.items = this.items;
        this.addNewRow ();
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
                name: '',
                items: [],
                subtotal: 0,
            }
        }
    },
}
</script>

<style lang="scss" scoped>
.summary {
    .box {
        border-radius: 0;
    }
}
</style>
