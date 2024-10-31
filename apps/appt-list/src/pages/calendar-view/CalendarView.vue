<template>
    <div :class="$style.wrapper">
        <div :class="$style.card">
            In the Calendar view:
            <br>
            - to create an appointment, click the Add Appointment button at the bottom right of the calendar
            <br>
            - to update an appointment, double click it
        </div>
        <div :class="$style.calSidebarWrapper">
            <div :class="$style.cal">
                <vue-cal 
                    style="width: 1000px" 
                    ref="vuecal"
                    small
                    :events="apptList"
                    :time-from="6 * 60"
                    :time-to="23 * 60"
                    :disable-views="['years', 'year', 'day']"
                    :on-event-create="getCreateApptPopUp"
                    :on-event-dblclick="getUpdateApptPopUp"
                    :cell-click-hold="false"
                    :drag-to-create-event="false">
                </vue-cal>
                <div :class="$style.addBtnWrapper">
                    <button :class="[$style.addBtn, $style.button]" @click="getCreateApptPopUp">Add Appointment</button>
                </div>
            </div>
            <template v-if="hasPopUp">
                <div :class="$style.popUpWrapper">
                    <div :class="$style.popUp">
                        <CreateAppt :appt="appt" :isSidebar="true" @createAppt="createAppointment" @updateAppt="updateAppt" @deleteAppt="findAndDeleteAppt" @updateCompletion="updateApptCompletion" @closePopUp="closePopUp"></CreateAppt>
                    </div>
                </div>
            </template>
        </div>
        <section :class="[$style.completedApptsSection, $style.card]">
            <div :class="$style.listHeader">
                <h2>
                    Done and dusted
                </h2>
                <button :class="[$style.button, $style.deleteCompletedBtn]" @click="deleteCompletedBtnClicked" data-testid="deleteCompletedBtn">Delete completed appointments</button>
            </div>
            <template v-for="appt in completedApptsList">
                <Appointment :appt="appt" @delete="findAndDeleteAppt" @updateAppt="updateApptTitleAndTime" @moveToActive="moveApptToActive"/>
            </template>
        </section>
        <template v-if="modalDeleteCompleted">
            <ModalWindow @closeModal="closeModal">
                <template v-slot>
                    Are you sure you want to delete all the completed appointments?
                    <div :class="$style.modalBtnContainer">
                        <button :class="$style.button" @click="deleteCompletedAppts" data-testid="yesBtn">Yes</button>
                        <button :class="[$style.button, $style.cancelButton]" @click="closeModal">Cancel</button>
                    </div>
                </template>
            </ModalWindow>
        </template>
    </div>
</template>

<script>
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import { mapWritableState, mapActions } from 'pinia';
import { useApptStore } from '../../stores/ApptStore';

import CreateAppt from '../../components/create-appt/CreateAppt.vue';
import Appointment from '../../components/appointment/Appointment.vue'
import ModalWindow from '../../components/modal-window/ModalWindow.vue';

export default {
    name: 'CalendarView',
    components: {
        VueCal,
        CreateAppt,
        Appointment,
        ModalWindow
    },
    data() {
        return {
            appt: {},
            hasPopUp: false,
            modalDeleteCompleted: false
        }
    },
    async mounted() {
        await this.fetchApptList()
    },
    computed: {
        ...mapWritableState(useApptStore, [
            'apptList',
            'completedApptsList'
        ]),
    },
    methods: {
        ...mapActions(useApptStore, [
            'fetchApptList',
            'sendAppt',
            'updateApptDetails',
            'deleteAppt',
            'updateCompletionStatus',
            'deleteMultipleItems'
        ]),
        closePopUp() {
            this.hasPopUp = false
        },
        getCreateApptPopUp() {
            this.appt = {}
            this.hasPopUp = true
        },
        getUpdateApptPopUp(appt, e) {
            this.appt = appt
            this.hasPopUp = true
        },
        closeModal() {
            this.modalDeleteCompleted = false
        },
        async createAppointment(title, start, end, completionStatus) {
            if (title !== '' && start !== '' && end !== '') {
                await this.sendAppt(title, start, end, completionStatus)
            }
            this.hasPopUp = false
        },
        async updateAppt(updatedTitle, updatedStart, updatedEnd, updatedCompletion, id) {
            await this.updateApptDetails(updatedTitle, updatedStart, updatedEnd, updatedCompletion, id)
            this.hasPopUp = false
        },
        async findAndDeleteAppt(id) {
            await this.deleteAppt(id)
            this.hasPopUp = false
        },
        async updateApptCompletion(completionStatus, id) {
            await this.updateCompletionStatus(completionStatus, id)
        },
        async moveApptToActive(id) {
            await this.updateApptCompletion(false, id)
        },
        async deleteCompletedAppts() {
            await this.deleteMultipleItems('completed')
            this.closeModal()
        }
    }
}
</script>

<style module src="./CalendarView.css"></style>