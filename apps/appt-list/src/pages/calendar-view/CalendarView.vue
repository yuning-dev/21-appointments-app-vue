<template>
    <div :class="$style.wrapper">
        <div :class="$style.card">
            In the Calendar view, double click to create appointments.
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
                :cell-click-hold="false"
                :drag-to-create-event="false"
                editable-events
                @cell-dblclick="$refs.vuecal.createEvent(
                    $event,
                    120,
                    { title: 'New Event', class: 'blue-event' }
                )">
            </vue-cal>
            <template v-if="hasPopUp">
                <div :class="$style.popUpWrapper">
                    <div :class="$style.popUp">
                        <CreateAppt :appt="appt" @createAppt="createAppointment"></CreateAppt>
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
        CreateAppt
    },
    data() {
        return {
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

        ]),
        getCreateApptPopUp(event) {
            this.hasPopUp = true
        },
        async createAppointment(title, start, end, completionStatus) {
            if (title !== '' && start !== '' && end !== '') {
                await this.sendAppt(title, start, end, completionStatus)
            }
            this.hasPopUp = false
        }
    }
}
</script>

<style module src="./CalendarView.css"></style>