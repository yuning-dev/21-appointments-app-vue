<template>
    <div :class="$style.wrapper">
        <section :class="[$style.header, $style.card]">
            <div :class="$style.title">
                Snazzy Appointments App
            </div>
            <p :class="$style.intro">
                Managing appointments has never been easier. Begin by entering your appointment details below.
            </p>
            <CreateAppt :appt="appt" @createAppt="createAppointment" @updateAppt="updateAppt" />
            <p :class="$style.switchViewDisclaimer">
                Prefer the calendar view? To switch please <router-link to="/calendar-view" data-testid="calViewLink">click here</router-link>.
            </p>
        </section>
        <section :class="[$style.upcomingApptsSection, $style.card]">
            <div :class="$style.listHeader">
                <h2>
                    Upcoming Appointments
                </h2>
                <button :class="$style.button" @click="deleteUpcomingBtnClicked" data-testid="deleteUpcomingBtn">Delete upcoming apppointments</button>
            </div>
            <template v-for="appt in upcomingApptsList">
                <Appointment :appt="appt" @editMode="" @delete="findAndDeleteAppt" @updateAppt="updateAppt" @moveToCompleted="findApptToMoveToCompleted" />
            </template>
        </section>
        <template v-if="modalDeleteUpcoming">
            <ModalWindow @closeModal="closeModal">
                <template v-slot>
                    <div :class="$style.modalText">
                        Are you sure you want to delete all the upcoming appointments?
                    </div>
                    <div :class="$style.modalBtnContainer">
                        <button :class="[$style.button, $style.yesButton]" @click="deleteUpcomingAppts" data-testid="yesBtn">Yes</button>
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
                <Appointment :appt="appt" @delete="findAndDeleteAppt" @updateAppt="updateAppt" @moveToCompleted="findApptToMoveToCompleted" />
            </template>
        </section>
        <template v-if="modalDeletePast">
            <ModalWindow @closeModal="closeModal">
                <template v-slot>
                    <div :class="$style.modalText">
                        Are you sure you want to delete all the past appointments?
                    </div>
                    <div :class="$style.modalBtnContainer">
                        <button :class="[$style.button, $style.yesButton]" @click="deletePastAppts" data-testid="yesBtn">Yes</button>
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
                <Appointment :appt="appt" @delete="findAndDeleteAppt" @updateAppt="updateAppt" @moveToActive="findApptToMoveToActive"/>
            </template>
        </section>
        <template v-if="modalDeleteCompleted">
            <ModalWindow @closeModal="closeModal">
                <template v-slot>
                    <div :class="$style.modalText">
                        Are you sure you want to delete all the completed appointments?
                    </div>
                    <div :class="$style.modalBtnContainer">
                        <button :class="[$style.button, $style.yesButton]" @click="deleteCompletedAppts" data-testid="yesBtn">Yes</button>
                        <button :class="[$style.button, $style.cancelButton]" @click="closeModal">Cancel</button>
                    </div>
                </template>
            </ModalWindow>
        </template>
        <section>
            <button :class="[$style.button, $style.deleteAllBtn]" @click="deleteAllBtnClicked">Delete all appointments</button>
        </section>
        <template v-if="modalDeleteAll">
            <ModalWindow @closeModal="closeModal">
                <template v-slot>
                    <div :class="$style.modalText">
                        Are you sure you want to delete all the appointments?
                    </div>
                    <div :class="$style.modalBtnContainer">
                        <button :class="[$style.button, $style.yesButton]" @click="deleteAllAppts" data-testid="yesBtn">Yes</button>
                        <button :class="[$style.button, $style.cancelButton]" @click="closeModal">Cancel</button>
                    </div>
                </template>                
            </ModalWindow>
        </template>
    </div>
</template>


<script>
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
    },
    data() {
        return {
            appt: {},
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
            'updateApptDetails',
            'updateCompletionStatus',
            'deleteMultipleItems',
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
        async updateAppt(updatedTitle, updatedStart, updatedEnd, updatedCompletion, id) {
            await this.updateApptDetails(updatedTitle, updatedStart, updatedEnd, updatedCompletion, id)
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