<template>
    <div :class="$style.wrapper">
        <template v-if="!isInEditMode">
            <div data-testid="title" :class="$style.apptTitleContainer">
                {{ appt.title }}
            </div>
            <div v-if="!isPast && !appt.completion" data-testid="startEndDates">
            <!-- :class="{ [$style.orange]: isOrange, [$style.red]: isRed } -->
                <div :class="$style.startEndWrapper">
                    <div><span :class="$style.timeTitle">Start:</span> {{ formattedStart }}</div>
                    <div><span :class="$style.timeTitle">End:</span> {{ formattedEnd }}</div>
                </div>
            </div>
            <div v-else>
                <div :class="$style.startEndWrapper">
                    <div><span :class="$style.timeTitle">Start:</span> {{ formattedStart }}</div>
                    <div><span :class="$style.timeTitle">End:</span> {{ formattedEnd }}</div>
                </div>
            </div>
        </template>

        <!-- If in Edit mode, modal window appears allowing for editing -->
        <template v-else>
            <ModalWindow @closeModal="closeModal">
                <template v-slot>
                    <CreateApp />
                </template>
            </ModalWindow>
        </template>

        <div>
            <button data-testid="completedBtn" :class="$style.button" v-if="!appt.completion" @click="moveToCompletedButtonClicked" :disabled="isButtonDisabled">Completed</button>
            <button data-testid="makeActiveBtn" :class="$style.button" v-if="appt.completion" @click="makeActiveButtonClicked">Make active</button>
            <button data-testid="editBtn" :class="$style.button" v-if="!appt.completion" @click="editButtonClicked" :disabled="isButtonDisabled">Edit</button>
            <button :class="$style.button" v-if="appt.completion" @click="editButtonClicked" :disabled="isButtonDisabled">Edit title</button>
            <button data-testid="deleteBtn" :class="$style.button" @click="deleteButtonClicked">Delete</button>
        </div>

        <!-- <template v-else>
            <div>
                Title <InputText type="text" data-testid="editTitleInput" v-model="editedTitle" />
            </div>
            <div v-if="!appt.completion">
                Start <DatePicker showTime hourFormat="12" fluid data-testid="editStart" v-model="editedStart" />
                End <DatePicker showTime hourFormat="12" fluid data-testid="editEnd" v-model="editedEnd" />
            </div>
            <div v-if="appt.completion">
                Start: {{ formattedStart }}
                End: {{ formattedEnd }}
            </div>
            <button data-testid="editCompleteBtn" :class="[$style.editCompleteBtn, $style.button]" @click="editCompleteBtnClicked">Edit complete</button>
        </template> -->
        <!-- <div>
            <button data-testid="completedBtn" :class="$style.button" v-if="!appt.completion" @click="moveToCompletedButtonClicked" :disabled="isButtonDisabled">Completed</button>
            <button data-testid="makeActiveBtn" :class="$style.button" v-if="appt.completion" @click="makeActiveButtonClicked">Make active</button>
            <button data-testid="editBtn" :class="$style.button" v-if="!appt.completion" @click="editButtonClicked" :disabled="isButtonDisabled">Edit</button>
            <button :class="$style.button" v-if="appt.completion" @click="editButtonClicked" :disabled="isButtonDisabled">Edit title</button>
            <button data-testid="deleteBtn" :class="$style.button" @click="deleteButtonClicked">Delete</button>
        </div> -->
    </div>
</template>

<script>
import DatePicker from 'primevue/datepicker'
import InputText from 'primevue/inputtext'

import CreateApp from '../create-appt/CreateAppt.vue'
import ModalWindow from '../modal-window/ModalWindow.vue';

export default {
    name: 'Appointment',
    components: {
        DatePicker,
        InputText,
        CreateApp,
        ModalWindow
    },
    props: {
        appt: Object,
    },
    data() {
        return {
            editedTitle: this.appt.title,
            editedStart: this.appt.start,
            editedEnd: this.appt.end,
            isInEditMode: false,
            isButtonDisabled: false,
        }
    },
    computed: {
        // daysToDeadline() {
        //     const deadline = Date.parse(this.appt.dueDate)
        //     const timeNow = Date.now()
        //     const dateNow = timeNow - (timeNow % 86400000)
        //     const daysToDeadline = (deadline - dateNow) / 1000 / 60 / 60 / 24
        //     return daysToDeadline
        // },
        // isOrange() {
        //     return 0 < this.daysToDeadline && this.daysToDeadline <= 1
        // },
        // isRed() {
        //     return this.daysToDeadline <= 0
        // },
        isPast() {
            const timeNow = new Date()
            return this.appt.end < timeNow
        },
        formattedStart() {
            const dateString = this.appt.start.toISOString()
            return `${dateString.slice(8, 10)}-${dateString.slice(5, 7)}-${dateString.slice(0, 4)} ${dateString.slice(11, 16)}`
        },
        formattedEnd() {
            const dateString = this.appt.end.toISOString()
            return `${dateString.slice(8, 10)}-${dateString.slice(5, 7)}-${dateString.slice(0, 4)} ${dateString.slice(11, 16)}`
        }
    },
    methods: {
        editButtonClicked() {
            this.isButtonDisabled = true
            this.isInEditMode = true
            this.$emit('editMode', this.editedTitle, this.editedStart, this.editedEnd, this.appt._id)
        },
        // editCompleteBtnClicked() {
        //     this.isInEditMode = false
        //     this.isButtonDisabled = false
        //     console.log(this.editedTitle, this.editedStart, this.editedEnd, this.appt._id)
        //     this.$emit('updateAppt', this.editedTitle, this.editedStart, this.editedEnd, this.appt._id)
        // },
        closeModal() {
            this.isInEditMode = false
        },
        deleteButtonClicked() {
            this.$emit('delete', this.appt._id)
        },
        moveToCompletedButtonClicked() {
            this.$emit('moveToCompleted', this.appt._id)
        },
        makeActiveButtonClicked() {
            this.$emit('moveToActive', this.appt._id)
        },
        dateOfToday() {
            const today = new Date()
            const todayInString = today.toISOString()
            const dateInString = todayInString.substring(0,10)
            return dateInString
        },
    },
}
</script>

<style module src="./Appointment.css" />