<template>
    <section :class="$style.wrapper">
        <div :class="$style.items">
            <router-link :class="$style.item" to="/" data-testid="listViewLink">
                List view
            </router-link>
            <router-link :class="$style.item" to="/calendar-view" data-testid="calendarViewLink">
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