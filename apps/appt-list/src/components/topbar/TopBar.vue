<template>
    <section :class="$style.wrapper">
        <div :class="$style.items">
            <router-link :class="$style.item" :to="{ name: 'list-view' }">
                List view
            </router-link>
            <router-link :class="$style.item" :to="{ name: 'calendar-view' }" >
                Calendar view
            </router-link>
        </div>
    </section>
</template>

<script>
export default {
    name: 'TopBar',
}
</script>

<style module src="./TopBar.css" />