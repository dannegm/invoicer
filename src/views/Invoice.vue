<template>
    <div class="invoice">
        <div class="columns is-centered">
            <div class="column is-four-fifths">
                <Summary
                    v-for="summary in summaries"
                    :key="summary.uid"
                    :uid="summary.uid"
                    :name="summary.name"
                    :items="summary.items"
                    @change="updateSummaryWith"
                    @trash="removeSummaryAt" />
                
                <button class="button" @click="addNewSummary">
                    <span>Añadir</span>
                    <span class="icon is-small">
                        <i class="fas fa-plus"></i>
                    </span>
                </button>
                <span>&nbsp;</span>
                <button class="button" @click="saveInvoice">
                    <span>Guardar</span>
                    <span class="icon is-small">
                        <i class="fas fa-save"></i>
                    </span>
                </button>

                <br />
                <br />
                <div class="box">
                    <b-field label="Total" horizontal>
                        <b-input v-model="total" disabled></b-input>
                    </b-field>
                    <b-field label="Descuento" horizontal>
                        <b-input v-model="discount" type="number"  min="0" :max="total" @focus="clear" @blur="zero"></b-input>
                    </b-field>
                    <b-field label="Subtotal" horizontal>
                        <b-input v-model="subtotal" disabled></b-input>
                    </b-field>
                    <b-field label="I.V.A." horizontal>
                        <b-input v-model="iva" type="number" min="0" max="100" expanded @focus="clear" @blur="zero"></b-input>
                        <p class="control">
                            <span class="button is-static">%</span>
                        </p>
                    </b-field>
                    <b-field label="Gran Total" horizontal>
                        <b-input v-model="final" disabled></b-input>
                    </b-field>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import uuid from 'uuid/v4';
import Summary from '@/components/Summary';

export default {
    name: 'Invoice',
    components: {
        Summary,
    },
    methods: {
        removeSummaryAt (uid) {
            this.summaries = this.summaries.filter (i => i.uid != uid);
        },
        updateSummaryWith (summary) {
            this.summaries.forEach ((item, index) => {
                if (item.uid == summary.uid) {
                    this.summaries [index] = summary;
                }
            });
            this.calculateTotals ();
        },
        addNewSummary () {
            this.summaries.push ({
                uid: uuid(),
                name: '',
                items: [],
            });
        },
        saveInvoice () {
            console.log(JSON.stringify({
                uid: uuid(),
                summaries: this.summaries,
                discount: this.discount,
                iva: this.iva,
            }, null, 4));

            this.$toast.open({
                message: 'Imprimiendo en consola',
                type: 'is-info',
                position: 'is-bottom'
            });
        },

        calculateTotal () {
            const accumulator = (acc, cur) => ({ subtotal: acc.subtotal + cur.subtotal });
            this.total = this.summaries.reduce(accumulator, { subtotal: 0 }).subtotal;
        },
        calculateSubtotal () {
            this.subtotal = this.total - this.discount;
        },
        calculateFinal () {
            const taxes = (this.subtotal * this.iva) / 100;
            this.final = this.round(this.subtotal * taxes);
        },
        calculateTotals () {
            this.calculateTotal ();
            this.calculateSubtotal ();
            this.calculateFinal ();
        },
        round (num) {
            return Math.round(num * 100) / 100;
        },
        clear (ev) {
            if (ev.target.value == 0) ev.target.value = '';
        },
        zero (ev) {
            if (ev.target.value == '') ev.target.value = 0;
        },
    },
    mounted () {
        if (!this.summaries.length) this.addNewSummary ();
    },
    watch: {
        discount () {
            this.calculateTotals ();
        },
        iva () {
            this.calculateTotals ();
        },
    },
    data () {
        return {
            summaries: [],
            total: 0,
            subtotal: 0,
            final: 0,
            discount: 0,
            iva: 16,
        }
    }
}
</script>

<style lang="scss" scoped>
.invoice {
    padding-top: 2em;
    padding-bottom: 4em;
    .summary {
        margin-bottom: 1em;
    }
}
</style>