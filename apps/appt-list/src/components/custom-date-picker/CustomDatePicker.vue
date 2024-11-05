<template>
    <div :class="$style.wrapper" >
        <DatePicker :minDate="minDate" :modelValue="modelValue" @update:modelValue="onDateChanged" showTime dateFormat="dd/mm/yy" hourFormat="12" showIcon icondisplay="input" fluid @show="isDateFocused = true" @hide="isDateFocused = false" :class="$style.time" v-model="dateAndTime" data-testid="timePicker" />
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
    props: {
        modelValue: String,
        minDate: Date
    },
    emits: ['update:modelValue'],
    data() {
        return {
            dateAndTime: null,
            isDateFocused: false
        }
    },
    methods: {
        onDateChanged(date) {
            this.$emit('update:modelValue', date)
        }
    }
}

</script>

<style module src="./CustomDatePicker.css"></style>