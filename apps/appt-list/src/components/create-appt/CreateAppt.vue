<template>
    <!-- Below is for when creating a new appointment -->
    <template v-if="!appt._id">
        <div :class="$style.addItemContainer">
            <label>
                Appointment title:
                <InputText type="text" :class="$style.addItemField" v-model="newTitle" @keyup.enter="createAppt" ref="TitleInput" data-testid="TitleInput"/>
            </label>
            <div :class="$style.startEndWrapper">
                <label>
                    Start
                    <DatePicker showTime hourFormat="12" showIcon icondisplay="input" fluid :class="$style.time" v-model="newStart" data-testid="timePicker"/>
                </label>
                <label>
                    End
                    <DatePicker :minDate="earliestNewApptEnd" showTime hourFormat="12" showIcon icondisplay="input" fluid :class="$style.time" v-model="newEnd" data-testid="timePicker"/>
                </label>
            </div>
            <div v-if="hasNewEndWarning" :class="$style.endWarning">The appointment must be at least 15 minutes long.</div>
            <div :class="$style.addBtnWrapper">
                <button :class="[$style.addButton, $style.button]" @click="sendCreateAppt" data-testid="addItemBtn">
                    Create appointment
                </button>
            </div>
        </div>
    </template>

    <!-- Below is for when updating an appointment -->
    <template v-else>
        <div :class="$style.addItemContainer">
            <label>
                Appointment title:
                <InputText type="text" v-model="editedTitle" :class="$style.addItemField"  @keyup.enter="createAppt" ref="TitleInput" data-testid="TitleInput"/>
            </label>
            <div :class="$style.startEndWrapper">
                <label>
                    Start
                    <DatePicker v-model="editedStart" showTime hourFormat="12" showIcon icondisplay="input" fluid :class="$style.time" data-testid="timePicker"/>
                </label>
                <label>
                    End
                    <DatePicker v-model="editedEnd" :minDate="earliestUpdatedApptEnd" showTime hourFormat="12" showIcon icondisplay="input" fluid :class="$style.time" data-testid="timePicker"/>
                </label>
            </div>
            <div v-if="hasEditedEndWarning" :class="$style.endWarning">The appointment must be at least 15 minutes long.</div>
            <div :class="$style.addBtnWrapper">
                <button :class="[$style.addButton, $style.button]" @click="sendUpdateAppt" data-testid="updateItemBtn">
                    Update appointment
                </button>
            </div>
        </div>
    </template>

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
            //newTitle etc is the default when creating new appointments
            newTitle: '',
            newStart: '',
            newEnd: '',
            isCompleted: false,
            hasNewEndWarning: false,
            //editedTitle etc: the original value is the current value before editing
            //after editing it carries the updated value that is sent to the api request 
            editedTitle: this.appt.title,
            editedStart: this.appt.start,
            editedEnd: this.appt.end,
            hasEditedEndWarning: false
        }
    },
    watch: {
        newEnd(newEnd, oldEnd) {
            if (newEnd < addMinutes(this.newStart, 15)) {
                this.hasNewEndWarning = true
            } else {
                this.hasNewEndWarning = false
            }
        },
        editedEnd(newEditedEnd, oldEditedEnd) {
            if (newEditedEnd < addMinutes(this.editedStart, 15)) {
                this.hasEditedEndWarning = true
            } else {
                this.hasEditedEndWarning = false
            }
        }
    },
    computed: {
        earliestNewApptEnd() {
            return addMinutes(this.newStart, 15)

        },
        earliestUpdatedApptEnd() {
            return addMinutes(this.editedStart, 15)
        }
    },
    methods: {
        sendCreateAppt() {
            if (this.newEnd >= addMinutes(this.newStart, 15)) {
                this.$emit('createAppt', this.newTitle, this.newStart, this.newEnd, this.isCompleted)
                this.newTitle = ''
            }
        },
        sendUpdateAppt() {
            if (this.editedEnd >= addMinutes(this.editedStart, 15)) {
                this.$emit('updateAppt', this.editedTitle, this.editedStart, this.editedEnd, this.appt._id)
                this.$emit('closeModal')
            }
        },
    }
}
</script>

<style module src="./CreateAppt.css"></style>