<template>
    <div class="users">
        <div class="columns is-centered">
            <div class="column is-half">
                <div class="box">
                    <div class="header">
                        <h1 class="title">Usuarios</h1>
                        <div class="actions">
                            <button class="button is-small is-info is-rounded" @click="openUserModal('email')">
                                <span>Añadir</span>
                                <span class="icon is-small">
                                    <i class="fas fa-plus"></i>
                                </span>
                            </button>
                            <button class="button is-small is-info is-rounded" @click="openUserModal('google')">
                                <span class="icon is-small">
                                    <i class="fab fa-google"></i>
                                </span>
                            </button>
                        </div>
                    </div>
                    <section class="user-list">
                        <h2>Usuarios activos</h2>
                        <UserItem
                            v-for="user in users.filter(i => i.active)"
                            :key="`${user.uid}.list`"
                            :uid="user.uid"
                            :name="user.name"
                            :email="user.email"
                            :photoURL="user.photoURL"
                            :canRemove="canRemove(user)"
                            @trash="removeUser" />
                    </section>
                    <section
                        v-if="users.filter(i => !i.active).length"
                        class="user-list">
                        <h2>Sin actividad</h2>
                        <UserItem
                            v-for="user in users.filter(i => !i.active)"
                            :key="`${user.uid}.list`"
                            :uid="user.uid"
                            :name="user.name"
                            :email="user.email"
                            :photoURL="user.photoURL"
                            :canRemove="canRemove(user)"
                            @trash="removeUser" />
                    </section>
                </div>
            </div>
        </div>

        <b-modal :active.sync="userModal.open">
            <UserCreate ref="refUserModal" :strategy="userModal.strategy" @created="onCreatedUser" />
        </b-modal>
    </div>
</template>

<script>
import uuid from 'uuid/v4';
import { db } from '@/services/firebase';
import UserItem from '@/components/UserItem';
import UserCreate from '@/views/UserCreate';

export default {
    name: 'Users',
    components: {
        UserItem,
        UserCreate,
    },
    methods: {
        canRemove (user) {
            const isMe = this.suser.uid == user.uid;
            const isGod = this.suser.role == 'god';
            const isAdmin = this.suser.role == 'admin' && user.role != 'god';
            return !isMe && (isGod || isAdmin);
        },
        async getUsers () {
            const usersSnapshot = await db.collection ('users').get ();
            this.users = usersSnapshot.docs.map (doc => doc.data());
            this.loaded = true;
        },
        async removeUser (uid) {
            if (confirm ('Eliminando', '¿Estás seguro de eliminar este usuario?')) {
                await db.collection ('users').doc (uid).delete ();
                await this.getUsers ();
            }
        },

        openUserModal (strategy) {
            this.userModal.strategy = strategy;
            this.userModal.open = true;
        },
        async onCreatedUser () {
            await this.getUsers ();
            this.userModal.open = false;
        },
    },
    async mounted () {
        await this.getUsers ();
    },
    computed: {
        suser () {
            return this.$store.state.user;
        },
    },
    data () {
        return {
            userModal: {
                open: false,
                strategy: '',
            },
            users: [],
            newUserName: '',
            newUserEmail: '',
        }
    },
}
</script>

<style lang="scss" scoped>
.users {
    padding-top: 2em;
    padding-bottom: 6em;
    .box {
        border-radius: 0;

        .header {
            display: flex;
            flex-direction: row;
            justify-content: space-between;

            h1 {
                font-size: 1.6em;
            }

            .actions {
                .button {
                    margin-left: .4em;
                }
            }
        }

        .user-list {
            margin-bottom: 0.5em;
            h2 {
                font-size: 0.8em;
                font-weight: 600;
                color: #888;
                text-transform: uppercase;
                margin: .5em 0;
            }
        }
    }
}
</style>