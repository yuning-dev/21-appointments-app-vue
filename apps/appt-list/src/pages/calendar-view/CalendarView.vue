<template>
    <div :class="$style.wrapper">
        <div :class="$style.card">
            In the Calendar view:
            <br>
            - to create an appointment, click the Add Appointment button at the bottom right of the calendar
            <br>
            - to update an appointment, double click it
        </div>
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
            <template v-if="hasPopUp">
                <div :class="$style.popUpWrapper">
                    <div :class="$style.popUp">
                        <CreateAppt :appt="appt" :hasDeleteBtn="true" :hasCloseBtn="true" @createAppt="createAppointment" @updateAppt="updateApptTitleAndTime" @deleteAppt="findAndDeleteAppt" @closePopUp="closePopUp"></CreateAppt>
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
            'apptList'
        ]),
    },
    methods: {
        ...mapActions(useApptStore, [
            'fetchApptList',
            'sendAppt',
            'updateTitleAndTime',
            'deleteAppt'
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
        async updateApptTitleAndTime(updatedTitle, updatedStart, updatedEnd, id) {
            const apptToUpdate = this.apptList.find((appt) => appt._id === id)
            console.log(apptToUpdate)
            const completion = apptToUpdate.completion
            await this.updateTitleAndTime(updatedTitle, updatedStart, updatedEnd, id, completion)
            this.hasPopUp = false
        },
        async findAndDeleteAppt(id) {
            await this.deleteAppt(id)
            this.hasPopUp = false
        }
    }
}
</script>

<style module src="./CalendarView.css"></style>