<template>
    <!-- Below is the layout for the list view -->
    <template v-if="!isSidebar">
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
            <div v-if="isInEditMode" :class="$style.updateBtnWrapper">
                <button :class="[$style.addButton, $style.button]" @click="sendUpdateAppt" data-testid="updateItemBtn">
                    Update appointment
                </button>
            </div>
        </div>
    </template>

    <!-- Below is the layout for the calendar view, where the items will appear in a sidebar -->
    <template v-else>
        <div :class="$style.addItemContainerSB">
            <div>
                <button :class="$style.closeBtn" @click="closeBtnClicked">&times;</button>
            </div>
            <label>
                Appointment title:
                <InputText type="text" :class="$style.addItemFieldSB" v-model="title" @keyup.enter="sendCreateAppt" ref="TitleInput" data-testid="TitleInput"/>
            </label>
            <div :class="$style.startEndWrapperSB">
                <label>
                    Start
                    <DatePicker showTime hourFormat="12" showIcon icondisplay="input" fluid :class="$style.time" v-model="start" data-testid="timePicker"/>
                </label>
                <label>
                    End
                    <DatePicker :minDate="earliestApptEnd" showTime hourFormat="12" showIcon icondisplay="input" fluid :class="$style.time" v-model="end" data-testid="timePicker"/>
                </label>
                <template v-if="isInEditMode">
                    <label :class="$style.markCompletion">
                        Mark as completed
                        <input type="checkbox" :checked="isCompleted" @click="updateCompletionStatus" />
                        <!-- <template v-if="!isCompleted">
                            <font-awesome-icon data-testid="completedUnticked" icon="fa-regular fa-square" size="lg" @click="updateCompletionStatus"/>
                        </template>
                        <template v-if="isCompleted">
                            <font-awesome-icon data-testid="completedTicked" icon="fa-regular fa-square-check" size="lg" @click="updateCompletionStatus"/>
                        </template> -->
                    </label>
                </template>
            </div>
            <div v-if="!isInEditMode" :class="$style.addBtnWrapper">
                <button :class="[$style.addButtonSB, $style.button]" @click="sendCreateAppt" data-testid="addItemBtn">
                    Create appointment
                </button>
            </div>
            <div v-if="isInEditMode" :class="$style.updateDeleteBtnsWrapper">
                <button :class="[$style.updateButtonSB, $style.button]" @click="sendUpdateAppt" data-testid="updateItemBtn">
                    Update
                </button>
                <button :class="[$style.deleteButton, $style.button]" @click="sendDeleteAppt" data-testid="deleteItemBtn">
                    Delete
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
    emits: ['createAppt', 'updateAppt', 'deleteAppt'],
    props: {
        appt: Object,
        isSidebar: Boolean
    },
    data() {
        return {
            title: this.appt?.title,
            start: this.appt?.start,
            end: this.appt?.end,
            isCompleted: this.appt?.completion,
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
                this.$emit('createAppt', this.title, this.start, this.end, false)
                this.title = ''
            }
        },
        sendUpdateAppt() {
            if (this.end >= addMinutes(this.start, 15)) {
                this.$emit('updateAppt', this.title, this.start, this.end, this.isCompleted, this.appt._id)
                this.$emit('closeModal')
            }
        },
        sendDeleteAppt() {
            this.$emit('deleteAppt', this.appt._id)
        },
        closeBtnClicked() {
            this.$emit('closePopUp')
        },
        updateCompletionStatus() {
            this.isCompleted = !this.isCompleted
        }
    }
}
</script>

<style module src="./CreateAppt.css"></style>