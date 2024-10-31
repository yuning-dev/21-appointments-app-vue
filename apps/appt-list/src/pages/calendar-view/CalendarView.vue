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
                    <!-- Add slot content for your events -->
                     <div :class="$style.eventCell">
                        
                     </div>
                </vue-cal>
                <div :class="$style.addBtnWrapper">
                    <button :class="[$style.addBtn, $style.button]" @click="getCreateApptPopUp">Add Appointment</button>
                </div>
            </div>
            <template v-if="hasPopUp">
                <div :class="$style.popUpWrapper">
                    <div :class="$style.popUp">
                        <CreateAppt :appt="appt" :isSidebar="true" @createAppt="createAppointment" @updateAppt="updateAppt" @deleteAppt="findAndDeleteAppt" @closePopUp="closePopUp"></CreateAppt>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import { mapWritableState, mapActions } from 'pinia';
import { useApptStore } from '../../stores/ApptStore';

import CreateAppt from '../../components/create-appt/CreateAppt.vue';

export default {
    name: 'CalendarView',
    components: {
        VueCal,
        CreateAppt,
    },
    data() {
        return {
            appt: {},
            hasPopUp: false,
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
    }
}
</script>

<style module src="./CalendarView.css"></style>