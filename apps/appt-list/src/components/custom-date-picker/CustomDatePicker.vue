<template>
    <div :class="$style.wrapper" >
        <DatePicker showTime hourFormat="12" showIcon icondisplay="input" fluid @show="dateFocused" @hide="dateUnfocused" :class="$style.time" v-model="start" data-testid="timePicker" />
        <img v-if="isDateFocused" src="@/assets/checkbox.svg" height="32" :class="$style.tickIcon"/>
    </div>
</template>

<script>
import DatePicker from 'primevue/datepicker'

export default {
    name: 'CustomDatePicker',
    components: {
        DatePicker
    },
    data() {
        return {
            start: null,
            isDateFocused: false
        }
    },
    methods: {
        dateFocused() {
            this.isDateFocused = true
        },
        dateUnfocused() {
            this.isDateFocused = false
        }
    }
}

</script>

<style module src="./CustomDatePicker.css"></style>