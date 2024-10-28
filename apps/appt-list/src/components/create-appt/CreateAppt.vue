<template>
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
                    <DatePicker :minDate="this.newStart" showTime hourFormat="12" showIcon icondisplay="input" fluid :class="$style.time" v-model="newEnd" data-testid="timePicker"/>
                </label>
            </div>

            <div :class="$style.addBtnWrapper">
                <button :class="[$style.addButton, $style.button]" @click="sendCreateAppt" data-testid="addItemBtn">
                    Create appointment
                </button>
            </div>
        </div>
    </template>

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
                    <DatePicker v-model="editedEnd" :minDate="this.newStart" showTime hourFormat="12" showIcon icondisplay="input" fluid :class="$style.time" data-testid="timePicker"/>
                </label>
            </div>
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
            newTitle: '',
            newStart: '',
            newEnd: '',
            isCompleted: false,
            editedTitle: this.appt.title,
            editedStart: this.appt.start,
            editedEnd: this.appt.end
        }
    },
    methods: {
        sendCreateAppt() {
            console.log(this.newTitle, this.newStart)
            this.$emit('createAppt', this.newTitle, this.newStart, this.newEnd, this.isCompleted)
            this.newTitle = ''
        },
        sendUpdateAppt() {
            console.log(this.editedTitle, this.editedStart)
            this.$emit('updateAppt', this.editedTitle, this.editedStart, this.editedEnd, this.appt._id)
            this.$emit('closeModal')
        }
    }
}
</script>

<style module src="./CreateAppt.css"></style>