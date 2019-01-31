<template>
    <div class="sidebar">
        <Toolbar />
        <Item
            v-for="item in invoices"
            :key="item.uid"
            :uid="item.uid"
            :title="item.event.name"
            :subtitle="item.executive.name"
            :meta="item.event.date"
            :selected="selected == item.uid"
            @click="go (item.uid)" />

        <div v-if="!invoices.length" class="notification is-info">
            <p>Sin invoices</p>
        </div>
    </div>
</template>

<script>
import uuid from 'uuid/v4';
import Toolbar from '@/components/Toolbar';
import Item from '@/components/Item';

export default {
    name: 'Sidebar',
    components: {
        Toolbar,
        Item,
    },
    methods: {
        go (uid) {
            this.$router.push ({ path: `/invoice/view/${uid}` });
        },
    },
    computed: {
        selected () {
            return this.$route.params.uid;
        },
        invoices () {
            return this.$store.state.invoices;
        },
    },
}
</script>

<style lang="scss" scoped>
.sidebar {
    .toolbar {
        border-bottom: 1px solid whitesmoke;
    }
    .notification {
        margin: 1em;
    }
}
</style>
