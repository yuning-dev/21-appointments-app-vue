<template>
    <div :class="$style.wrapper">
        <section :class="[$style.header, $style.card]">
            <h1 :class="$style.title">
                Snazzy Appointments App
            </h1>
            <p :class="$style.intro">
                With our snazzy appointment app, managing appointments has never been easier. Begin by entering your appointment details below.
            </p>
            <CreateAppt :appt="appt" @createAppt="createAppointment" @updateAppt="updateApptTitleAndTime" />
        </section>
        <section :class="[$style.upcomingApptsSection, $style.card]">
            <div :class="$style.listHeader">
                <h2>
                    Upcoming Appointments
                </h2>
                <button :class="$style.button" @click="deleteUpcomingBtnClicked" data-testid="deleteUpcomingBtn">Delete upcoming apppointments</button>
            </div>
            <template v-for="appt in upcomingApptsList">
                <Appointment :appt="appt" @editMode="" @delete="findAndDeleteAppt" @updateAppt="updateApptTitleAndTime" @moveToCompleted="findApptToMoveToCompleted" />
            </template>
        </section>
        <template v-if="modalDeleteUpcoming">
            <ModalWindow @closeModal="closeModal">
                <template v-slot>
                    Are you sure you want to delete all the upcoming appointments?
                    <div :class="$style.modalBtnContainer">
                        <button :class="$style.button" @click="deleteUpcomingAppts" data-testid="yesBtn">Yes</button>
                        <button :class="[$style.button, $style.cancelButton]" @click="closeModal">Cancel</button>
                    </div>
                </template>
            </ModalWindow>
        </template>
        <section :class="[$style.pastApptsSection, $style.card]">
            <div :class="$style.listHeader">
                <h2>
                    Past Appointments
                </h2>
                <button :class="$style.button" @click="deletePastBtnClicked" data-testid="deletePastBtn">Delete past apppointments</button>
            </div>
            <template v-for="appt in pastApptsList">
                <Appointment :appt="appt" @delete="findAndDeleteAppt" @updateAppt="updateApptTitleAndTime" @moveToCompleted="findApptToMoveToCompleted" />
            </template>
        </section>
        <template v-if="modalDeletePast">
            <ModalWindow @closeModal="closeModal">
                <template v-slot>
                    Are you sure you want to delete all the past appointments?
                    <div :class="$style.modalBtnContainer">
                        <button :class="$style.button" @click="deletePastAppts" data-testid="yesBtn">Yes</button>
                        <button :class="[$style.button, $style.cancelButton]" @click="closeModal">Cancel</button>
                    </div>
                </template>
            </ModalWindow>
        </template>
        <section :class="[$style.completedApptsSection, $style.card]">
            <div :class="$style.listHeader">
                <h2>
                    Done and dusted
                </h2>
                <button :class="$style.button" @click="deleteCompletedBtnClicked" data-testid="deleteCompletedBtn">Delete completed appointments</button>
            </div>
            <template v-for="appt in completedApptsList">
                <Appointment :appt="appt" @delete="findAndDeleteAppt" @updateAppt="updateApptTitleAndTime" @moveToActive="findApptToMoveToActive"/>
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
        <section>
            <button :class="[$style.button, $style.deleteAllButton]" @click="deleteAllBtnClicked">Delete all appointments</button>
        </section>
        <template v-if="modalDeleteAll">
            <ModalWindow @closeModal="closeModal">
                <template v-slot>
                    Are you sure you want to delete all the appointments?
                    <div :class="$style.modalBtnContainer">
                        <button :class="$style.button" @click="deleteAllAppts" data-testid="yesBtn">Yes</button>
                        <button :class="[$style.button, $style.cancelButton]" @click="closeModal">Cancel</button>
                    </div>
                </template>                
            </ModalWindow>
        </template>
    </div>
</template>


<script>
import DatePicker from 'primevue/datepicker'
import InputText from 'primevue/inputtext'

import { mapStores } from 'pinia'
import { mapState, mapWritableState } from 'pinia'
import { mapActions } from 'pinia'
import { useApptStore } from '@/stores/ApptStore'

import Appointment from '../../components/appointment/Appointment.vue'
import ModalWindow from '../../components/modal-window/ModalWindow.vue'
import CreateAppt from '../../components/create-appt/CreateAppt.vue'

export default {
    name: 'ApptList',
    components: {
        Appointment,
        ModalWindow,
        CreateAppt,
        DatePicker,
        InputText
    },
    data() {
        return {
            appt: {},
            // newTitle: '',
            // newStart: '',
            // newEnd: '',
            // isCompleted: false,
            modalDeleteAll: false,
            modalDeleteUpcoming: false,
            modalDeletePast: false,
            modalDeleteCompleted: false,
        }
    },
    async mounted() {
        await this.fetchApptList()
    },
    computed: {
        ...mapStores(useApptStore),
        ...mapState(useApptStore, [ 
            'completedApptsList',
            'pastApptsList',
            'upcomingApptsList', 
        ]),
        ...mapWritableState(useApptStore, [
            'apptList'
        ]),
    },
    methods: {
        ...mapActions(useApptStore, [
            'dateOfToday',
            'fetchApptList',
            'sendAppt',
            'deleteAppt',
            'updateTitleAndTime',
            'updateCompletionStatus',
            'deleteMultipleItems',
            'createSession'
        ]),
        async createAppointment(title, start, end, completionStatus) {
            if (title !== '' && start !== '' && end !== '') {
                await this.sendAppt(title, start, end, completionStatus)
            }
            // this.focusAddTitleInput()
        },
        // focusAddTitleInput() {
        //     this.$refs.TitleInput.focus()
        // },
        async updateApptTitleAndTime(updatedTitle, updatedStart, updatedEnd, id) {
            const apptToUpdate = this.apptList.find((appt) => appt._id === id)
            console.log(apptToUpdate)
            const completion = apptToUpdate.completion
            await this.updateTitleAndTime(updatedTitle, updatedStart, updatedEnd, id, completion)
        },
        async findAndDeleteAppt(id) {
            await this.deleteAppt(id)
        },
        async findApptToMoveToCompleted(id) {
            await this.updateCompletionStatus('true', id)
        },
        async findApptToMoveToActive(id) {
            await this.updateCompletionStatus('false', id)
        },
        deleteUpcomingBtnClicked() {
            if (this.upcomingApptsList.length > 0) {
                this.modalDeleteUpcoming = true
            }
        },
        async deleteUpcomingAppts() {
            await this.deleteMultipleItems('upcoming')
            this.closeModal()
        },
        deletePastBtnClicked() {
            if (this.pastApptsList.length > 0) {
                this.modalDeletePast = true
            }
        },
        async deletePastAppts() {
            await this.deleteMultipleItems('past')
            this.closeModal()
        },
        deleteCompletedBtnClicked() {
            if (this.completedApptsList.length > 0) {
                this.modalDeleteCompleted = true
            }
        },
        async deleteCompletedAppts() {
            await this.deleteMultipleItems('completed')
            this.closeModal()
        },
        deleteAllBtnClicked() {
            if (this.apptList.length > 0) {
                this.modalDeleteAll = true
            }
        },
        async deleteAllAppts() {
            await this.deleteMultipleItems('all')
            this.closeModal()
        },
        closeModal() {
            this.modalDeleteAll = false
            this.modalDeleteUpcoming = false
            this.modalDeletePast = false
            this.modalDeleteCompleted = false
        },
    },
}
</script>

<style module src="./ApptList.css" />