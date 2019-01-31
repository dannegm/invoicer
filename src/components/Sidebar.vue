<template>
    <div class="sidebar">
        <Toolbar />
    </div>
</template>

<script>
import Toolbar from '@/components/Toolbar';
export default {
    name: 'Sidebar',
    components: {
        Toolbar,
    },
    data () {
        return {
        }
    },
}
</script>

<style lang="scss" scoped>
.sidebar {
    .toolbar {
        border-bottom: 1px solid whitesmoke;
    }
}
</style>
