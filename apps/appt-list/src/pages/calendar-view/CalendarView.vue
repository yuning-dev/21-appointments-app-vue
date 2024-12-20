<template>
    <div :class="$style.wrapper">
        <div :class="$style.card">
            <div :class="$style.title">Snazzy Appointments App</div>
            In the Calendar view:
            <ul>
                <li>to create an appointment, click the <span :class="$style.addBtnHighlight">Add Appointment</span> button at the bottom right of the calendar</li>
                <li>to update an appointment, double click it in the calendar</li>
            </ul>
            <p :class="$style.switchViewDisclaimer">
                Prefer the list view? To switch please <router-link to="/" data-testid="listViewLink" :class="$style.switchViewLink">click here</router-link>.
            </p>
        </div>
        <div :class="$style.mainWrapper">
            <div :class="$style.calSidebarWrapper">
                <div :class="$style.cal">
                    <vue-cal 
                        :class="$style.testCal"
                        ref="vuecal"
                        small
                        :events="formattedAppts"
                        :time-from="8 * 60"
                        :time-to="21 * 60"
                        :disable-views="['years', 'year', 'day']"
                        :on-event-create="getCreateApptPopUp"
                        :on-event-dblclick="getUpdateApptPopUp"
                        :cell-click-hold="false"
                        :drag-to-create-event="false">
                    </vue-cal>
                    <div :class="$style.legendAddBtnWrapper">
                        <div :class="$style.legendWrapper">
                            <span>Done <div :class="[$style.completedLegend, this.$style.legend]"></div></span>
                            <span>Past <div :class="[$style.pastLegend, this.$style.legend]"></div></span>
                            <span>Upcoming <div :class="[$style.upcomingLegend, this.$style.legend]"></div></span>
                        </div>
                        <button :class="[$style.addBtn, $style.button]" @click="getCreateApptPopUp">Add Appointment</button>
                    </div>
                </div>
                <div v-if="hasPopUp" :class="$style.popUp">
                    <CreateAppt :appt="appt" :isSidebar="true" @createAppt="createAppointment" @updateAppt="updateAppt" @deleteAppt="findAndDeleteAppt" @closePopUp="closePopUp"></CreateAppt>
                </div>
            </div>
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
        console.log(this.testNow)
        console.log(this.formattedAppts)
    },
    computed: {
        ...mapWritableState(useApptStore, [
            'apptList',
        ]),
        formattedAppts() {
            return this.apptList.map(appt => {
                let apptClass
                const timeNow = new Date()
                if (appt.completion) {
                    apptClass = this.$style['completedAppt']
                } else if (appt.end < timeNow) {
                    apptClass = this.$style['pastAppt']
                } else {
                    apptClass = this.$style['upcomingAppt']
                }

                return {
                        ...appt,
                        class: apptClass
                }
            })
        },
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
<style src="./CalendarViewNonScoped.css"></style>