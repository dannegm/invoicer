<template>
    <div class="toolbar">
        <p class="buttons">
            <button class="button is-small" @click="create">
                <span>Nuevo</span>
                <span class="icon is-small">
                    <i class="fas fa-plus"></i>
                </span>
            </button>
            <button class="button is-small" @click="refresh">
                <span class="icon is-small">
                    <i class="fas fa-sync"></i>
                </span>
            </button>
        </p>
    </div>
</template>

<script>
export default {
    name: 'Toolbar',
    methods: {
        create () {
            this.$router.push ({ name: 'invoice.create' });
        },
        refresh () {
            this.$store.commit('loading', true);
            this.$store.dispatch('loadInvoices');
        },
    },
    data () {
        return {
        }
    },
}
</script>

<style lang="scss" scoped>
.toolbar {
    padding: 1rem;
}
</style>
