<template>
    <div :class="$style.addItemContainer">
        <label>
            Appointment title:
            <InputText type="text" :class="$style.addItemField" v-model="title" @keyup.enter="sendCreateAppt" ref="TitleInput" data-testid="TitleInput"/>
        </label>
        <div :class="$style.startEndWrapper">
            <label>
                Start
                <DatePicker showTime hourFormat="12" showIcon icondisplay="input" fluid :class="$style.time" v-model="start" data-testid="timePicker"/>
            </label>
            <label>
                End
                <DatePicker :minDate="earliestApptEnd" showTime hourFormat="12" showIcon icondisplay="input" fluid :class="$style.time" v-model="end" data-testid="timePicker"/>
            </label>
        </div>
        <div v-if="!isInEditMode" :class="$style.addBtnWrapper">
            <button :class="[$style.addButton, $style.button]" @click="sendCreateAppt" data-testid="addItemBtn">
                Create appointment
            </button>
        </div>
        <div v-if="isInEditMode" :class="$style.addBtnWrapper">
            <button :class="[$style.addButton, $style.button]" @click="sendUpdateAppt" data-testid="updateItemBtn">
                Update appointment
            </button>
        </div>
    </div>
</template>

<script>
import InputText from 'primevue/inputtext'
import DatePicker from 'primevue/datepicker'
import { addMinutes } from 'date-fns'

export default {
    name: 'CreateAppt',
    components: {
        InputText,
        DatePicker
    },
    emits: ['createAppt', 'updateAppt'],
    props: {
        appt: Object
    },
    data() {
        return {
            title: this.appt?.title,
            start: this.appt?.start,
            end: this.appt?.end,
            isCompleted: false,
        }
    },
    watch: {
        end(newEnd, oldEnd) {
            if (newEnd < addMinutes(this.start, 15)) {
                this.end = addMinutes(this.start, 15)
            }
        },
    },
    computed: {
        isInEditMode() {
            return this.appt?._id
        },
        earliestApptEnd() {
            return addMinutes(this.start, 15)
        }
    },
    methods: {
        sendCreateAppt() {
            if (this.end >= addMinutes(this.start, 15)) {
                this.$emit('createAppt', this.title, this.start, this.end, this.isCompleted)
                this.title = ''
            }
        },
        sendUpdateAppt() {
            if (this.end >= addMinutes(this.start, 15)) {
                this.$emit('updateAppt', this.title, this.start, this.end, this.appt._id)
                this.$emit('closeModal')
            }
        },
    }
}
</script>

<style module src="./CreateAppt.css"></style>