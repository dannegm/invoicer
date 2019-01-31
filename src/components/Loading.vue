<template>
    <div class="loading">
        <div class="pageloader has-background-info"
            :class="{ 'is-active': show }">
            <span class="title">Cargando</span>
        </div>
    </div>
</template>

<script>
import 'bulma-pageloader';
export default {
    name: 'Loading',
    props: {
        show: Boolean,
    }
}
</script>