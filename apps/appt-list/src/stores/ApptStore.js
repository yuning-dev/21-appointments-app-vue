import { defineStore } from 'pinia'
import axios from 'axios'

export const useApptStore = defineStore('appts', {
    state: () => ({
        apptList: [],
    }),
    getters: {
        upcomingApptsList(state) {
            const timeNow = new Date()
            return state.apptList.filter((appt) => appt.end > timeNow && !appt.completion)
        },
        pastApptsList(state) {
            const timeNow = new Date()
            return state.apptList.filter((appt) => appt.end < timeNow && !appt.completion)
        },
        completedApptsList(state) {
            return state.apptList.filter((appt) => appt.completion)
        },
    },
    actions: {
        dateOfToday() {
            const today = new Date()
            const todayInString = today.toISOString()
            const dateInString = todayInString.substring(0,10)
            return dateInString
        },
        async fetchApptList() {
            const response = await axios.get('/api/appointments')
            this.apptList = response.data.map(appt => {
                return {
                    ...appt,
                    start: new Date(appt.start),
                    end: new Date(appt.end),
                }
            })
        },
        async sendAppt(newTitle, newStart, newEnd, completionStatus) {
            await axios.post('/api/appointment', {
                title: newTitle,
                start: newStart,
                end: newEnd,
                completion: completionStatus,
            })
            await this.fetchApptList()
        },
        async deleteAppt(id) {
            await axios.delete('/api/appointment/' + id)
            await this.fetchApptList()
        },
        async updateTitleAndTime(updatedTitle, updatedStart, updatedEnd, id, completionStatus) {
            await axios.put('/api/appointment/' + id, {
                title: updatedTitle,
                start: updatedStart,
                end: updatedEnd,
                completion: completionStatus
            })
            await this.fetchApptList()
        },
        async updateCompletionStatus(updatedCompletionStatus, id) {
            await axios.post('/api/appointment/' + id, {
                completion: updatedCompletionStatus
            })
            await this.fetchApptList()
        },
        async deleteMultipleItems(itemsType) {
            await axios.post('/api/appointments/delete-' + itemsType)
            await this.fetchApptList()
        }
    },
})