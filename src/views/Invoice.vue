<template>
    <div class="invoice">
        <div class="columns is-centered">
            <div class="column is-four-fifths is-full-print">
                <div class="columns">
                    <div class="column is-half">
                        <div class="box">
                            <b-field label="Ejecutivo SP">
                                <b-input
                                    v-model="executive.name"
                                    size="is-medium"
                                    icon-pack="fas"
                                    icon="briefcase">
                                </b-input>
                            </b-field>
                            <b-field label="Fecha del evento">
                                <b-input
                                    v-model="event.date"
                                    size="is-medium"
                                    icon-pack="fas"
                                    icon="calendar-alt">
                                </b-input>
                            </b-field>
                            <b-field label="Evento">
                                <b-input
                                    v-model="event.name"
                                    size="is-medium"
                                    icon-pack="fas"
                                    icon="award">
                                </b-input>
                            </b-field>
                        </div>
                    </div>
                </div>

                <Summary
                    v-for="(summary, index) in summaries"
                    :key="summary.uid"
                    :uid="summary.uid"
                    :name="summary.name"
                    :items="summary.items"
                    :canRemove="!(summaries.length <= 1 && index == 0)"
                    @change="updateSummaryWith"
                    @trash="removeSummaryAt" />
                
                <div class="buttons actions">
                    <button class="button is-primary is-rounded" @click="addNewSummary">
                        <span>Añadir</span>
                        <span class="icon is-small">
                            <i class="fas fa-plus"></i>
                        </span>
                    </button>
                </div>

                <div class="columns">
                    <div class="column is-half is-offset-half">
                        <div class="results notification is-info">
                            <b-field label="Total" horizontal>
                                <b-input v-model="total" type="number" disabled></b-input>
                            </b-field>
                            <b-field label="Descuento" horizontal>
                                <b-input v-model="discount" type="number" min="0" :max="total" @focus="clear" @blur="zero"></b-input>
                            </b-field>
                            <b-field label="Subtotal" horizontal>
                                <b-input v-model="subtotal" type="number" disabled></b-input>
                            </b-field>
                            <b-field label="I.V.A." horizontal>
                                <b-input v-model="iva" type="number" min="0" max="100" @focus="clear" @blur="zero"></b-input>
                                <p class="control">
                                    <span class="button is-static">%</span>
                                </p>
                            </b-field>
                            <b-field label="Gran Total" horizontal>
                                <b-input v-model="final" type="number" disabled></b-input>
                            </b-field>
                        </div>
                    </div>
                </div>

                <div class="buttons floating-actions">
                    <button class="button is-info is-rounded" @click="printInvoice">
                        <span>Imprimir</span>
                        <span class="icon is-small">
                            <i class="fas fa-print"></i>
                        </span>
                    </button>
                    <button class="button is-success is-rounded" @click="saveInvoice">
                        <span>Guardar</span>
                        <span class="icon is-small">
                            <i class="fas fa-save"></i>
                        </span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import uuid from 'uuid/v4';
import { db } from '@/services/firebase';
import Summary from '@/components/Summary';

export default {
    name: 'Invoice',
    components: {
        Summary,
    },
    methods: {
        printInvoice () {
            window.print();
        },
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
            this.uid = !!this.uid ? this.uid : uuid();
            const invoiceModel = {
                uid: this.uid,
                event: this.event,
                executive: this.executive,
                customer: this.customer,
                summaries: this.summaries,
                discount: this.discount,
                iva: this.iva,
            };
            this.$store.dispatch('saveInvoice', invoiceModel);
            this.$router.push ({ path: `/invoice/view/${invoiceModel.uid}` });
            this.$toast.open ({
                message: 'Invoice guardado',
                type: 'is-success',
            })

        },
        async loadInvoice () {
            this.newInvoice ();
            if (typeof this.$route.params.uid != 'undefined') {
                this.uid = this.$route.params.uid;
                const invoicesSnapshot = await db.collection ('invoices')
                    .where('uid', '==', this.uid).get ();
                const invoice = invoicesSnapshot.docs[0].data();

                this.executive = invoice.executive;
                this.customer = invoice.customer;
                this.event = invoice.event;
                this.discount = invoice.discount;
                this.iva = invoice.iva;
                this.summaries = invoice.summaries;
            }
        },
        newInvoice () {
            this.executive = {
                name: '',
            };
            this.customer = {
                name: '',
                email: '',
                phone: '',
            };
            this.event = {
                date: '',
                name: '',
                place: '',
            };
            this.summaries = [];
            this.discount = 0;
            this.iva = 16;
            this.addNewSummary ();
        },

        calculateTotal () {
            const accumulator = (acc, cur) => ({ subtotal: acc.subtotal + cur.subtotal });
            this.total = this.round(this.summaries.reduce(accumulator, { subtotal: 0 }).subtotal);
        },
        calculateSubtotal () {
            this.subtotal = this.round(this.total - this.discount);
        },
        calculateFinal () {
            const taxes = this.subtotal * this.iva / 100;
            this.final = this.round(this.subtotal + taxes);
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
        this.loadInvoice ();
        if (!this.summaries.length) this.addNewSummary ();
    },
    watch: {
        async $route () {
            await this.loadInvoice ();
        },
        discount () {
            this.calculateTotals ();
        },
        iva () {
            this.calculateTotals ();
        },
    },
    data () {
        return {
            uid: null,
            executive: {
                name: '',
            },
            customer: {
                name: '',
                email: '',
                phone: '',
            },
            event: {
                date: '',
                name: '',
                place: '',
            },
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

<style lang="scss">
.invoice {
    padding-top: 2em;
    padding-bottom: 6em;
    .summary {
        margin-bottom: 1em;
    }
    .actions {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
    }
    .results {
        .field {
            .field-label {
                width: 60% !important;
                flex: none !important;
                label {
                    color: #fff;
                }
            }
            .control {
                .input {
                    background: none;
                    color: #fff;
                    border: 0;
                    border-radius: 0;
                    border-bottom: 1px solid #fff;
                    text-align: right;
                }
                .button {
                    background: none;
                    color: #fff;
                    border: 0;
                    border-radius: 0;
                    font-weight: 600;
                    margin-left: -1.5em;
                }
                input::-webkit-outer-spin-button,
                input::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
            }
        }
    }
    .floating-actions {
        position: fixed;
        left: 25%;
        width: 75%;
        bottom: 0;
        padding: 1em;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        background: #fff;
        box-shadow: 0 -2px 0 0 whitesmoke;
    }
}
</style>