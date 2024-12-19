<template>
    <section :class="$style.wrapper">
        <div :class="$style.innerWrapper">
            <div :class="$style.items">
                <router-link :class="{[$style.item]: true, [$style.highlight]: isListView}" to="/" data-testid="listViewLink" @click="updateViewInfo">
                    List view
                </router-link>
                <router-link :class="{[$style.item]: true, [$style.highlight]: isCalendarView}" to="/calendar-view" data-testid="calendarViewLink" @click="updateViewInfo">
                    Calendar view
                </router-link>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: 'TopBar',
    data() {
        return {
            isListView: true,
            isCalendarView: false
        }
    },
    methods: {
        updateViewInfo() {
            this.isListView = !this.isListView
            this.isCalendarView = !this.isCalendarView
        }
    }
}
</script>

<style module src="./TopBar.css" />