<template>
    <div class="summary">
        <div class="box">
            <div class="title columns">
                <div class="column is-half">
                    <b-input size="is-medium" placeholder="Nombre" v-model="data.name"></b-input>
                </div>
                <div class="column">
                    <a v-if="canRemove" class="delete is-pulled-right" @click="$emit('trash', data.uid)"></a>
                </div>
            </div>

            <div class="headers columns is-gapless">
                <div class="column">
                    <b>Cantidad</b>
                </div>
                <div class="column is-half">
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
                <div class="column is-delete">
                </div>
            </div>

            <SummaryItem
                v-for="(item, index) in data.items"
                :key="item.uid"
                :uid="item.uid"
                :quantity="parseFloat(item.quantity)"
                :description="item.description"
                :cost="parseFloat(item.cost)"
                :days="parseFloat(item.days)"
                :canRemove="!(data.items.length <= 1 && index == 0)"
                @change="changeRowWith"
                @trash="removeRowAt" />

            <div class="buttons">
                <button class="button is-primary is-small is-rounded" @click="addNewRow">
                    <span>Añadir</span>
                    <span class="icon is-small">
                        <i class="fas fa-plus"></i>
                    </span>
                </button>
            </div>

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
        canRemove: Boolean,
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
        if (!this.data.items.length) this.addNewRow ();
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

<style lang="scss">
.summary {
    .box {
        border-radius: 0;

        .title {
            .control {
                .input {
                    border-radius: 0px;
                    box-shadow: none;
                    border: 0px;
                    border-bottom: 2px solid #dbdbdb;
                    padding-left: 0px;
                    padding-right: 0px; 
                }
            }
        }

        .headers {
            margin-bottom: .5em;

            b {
                font-size: 0.8em;
            }

            .is-delete {
                width: 20px;
                flex: none;
                margin: 6px 12px !important;
            }
        }

        .buttons {
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            padding-right: 44px;
        }
    }
}
</style>
