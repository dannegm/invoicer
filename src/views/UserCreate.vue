<template>
    <div class="user-form">
        <div class="columns is-centered">
            <div class="column is-two-thirds">
                <div class="box">
                    <p class="title">Nuevo usuario</p>
                    <p class="description" v-if="strategy == 'google'">
                        Registra el correo de gmail que podrá utilizar esta cuenta.
                        <br />Una vez inicie sesión, sus datos serán actualizados.
                    </p>
                    <p class="description" v-if="strategy == 'email'">
                        Registra el nombre, correo y contraseña con el se podrá autenticar este usuario.
                    </p>
                    
                    <section>
                        <b-field
                            label="Nombre"
                            :message="errors.name"
                            :type="errors.name && 'is-danger'">
                            <b-input v-model="name"></b-input>
                        </b-field>

                        <b-field
                            label="Email"
                            :message="errors.email"
                            :type="errors.email && 'is-danger'">
                            <b-input v-model="email" type="email"></b-input>
                        </b-field>

                        <b-field
                            v-if="strategy == 'email'"
                            label="Contraseña"
                            :message="errors.password"
                            :type="errors.password && 'is-danger'">
                            <b-input v-model="password" type="password"></b-input>
                        </b-field>


                        <button
                            class="button is-info is-rounded"
                            :class="{
                                'is-loading': storing,
                            }"
                            @click="createUser">
                            <span>Guardar</span>
                            <span class="icon is-small">
                                <i class="fas fa-plus"></i>
                            </span>
                        </button>
                    </section>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import uuid from 'uuid/v4';
import { db, auth } from '@/services/firebase';
import { required, email } from 'vuelidate/lib/validators'

export default {
    name: 'UserCreate',
    props: {
        strategy: String,
    },
    methods: {
        async registerUser () {
            auth
            .createUserWithEmailAndPassword(this.email, this.password)
            .catch(error => {
                alert (error.message);
            });
        },
        async createUser () {
            this.storing = true;

            this.errors = {
                name: null,
                email: null,
                password: null,
            };
            this.$v.$touch ();

            const invalidPassword = this.strategy == 'email' && this.$v.password.$invalid;
            const invalidUserData = this.$v.name.$invalid || this.$v.email.$invalid;

            if (!invalidPassword && !invalidUserData) {
                const newUserData = {
                    uid: uuid (),
                    active: false,
                    role: 'none',
                    name: this.name,
                    email: this.email,
                };

                if (this.strategy == 'email') {
                    await this.registerUser ();
                }

                await db.collection ('users').doc (newUserData.uid).set (newUserData);
                this.$emit('created');
            } else {
                this.storing = false;

                if (!this.$v.name.required) this.errors.name = 'Proporcion el nombre del usuario';
                if (!this.$v.email.required) this.errors.email = 'Proporciona un correo electrónico';
                if (!this.$v.email.email) this.errors.email = 'Escribe un correo electrónico válido';
                if (!this.$v.password.required) this.errors.password = 'Escribe una contraseña';
            }
        }
    },
    async mounted () {
    },
    computed: {
        suser () {
            return this.$store.state.user;
        },
    },
    data () {
        return {
            name: '',
            email: '',
            password: '',
            storing: false,
            errors: {},
        }
    },
    validations: {
        name: {
            required,
        },
        email: {
            required,
            email,
        },
        password: {
            required,
        },
    }
}
</script>

<style lang="scss">
.user-form {
    padding-top: 2em;
    padding-bottom: 6em;
    .box {
        border-radius: 0;

        .title {
            font-size: 1.2em;
            margin-bottom: 4px;
        }
        .description {
            font-size: .85em;
            margin-bottom: 1em;
        }

        .field {
            .label {
                font-size: 0.8em;
            }
            .control {
                .input {
                    border-radius: 0;
                }
            }
        }

        .button {
            margin-top: 1em;
        }
    }
}
</style>