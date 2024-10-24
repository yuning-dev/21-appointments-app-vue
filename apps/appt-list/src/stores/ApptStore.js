import { defineStore } from 'pinia'
import axios from 'axios'

export const useApptStore = defineStore('appts', {
    state: () => ({
        apptList: [],
    }),
    getters: {
        // logic need to be updated!!
        upcomingApptsList(state) {
            const timeNow = new Date()
            return state.apptList.filter((appt) => appt.end > timeNow)
        },
        pastApptsList(state) {
            const timeNow = new Date()
            return state.apptList.filter((appt) => appt.end < timeNow)
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
        compareDates(date1, date2) {
            //accepts ISO 8601 string format (as this is what we get from the DB)
            //example: 2015-03-04T00:00:00.000Z
            //return true if date1 is earlier than date2 or the same

            const yearDate1 = Number(date1.slice(0, 4))
            const yearDate2 = Number(date2.slice(0, 4))
            const monthDate1 = Number(date1.slice(5, 7))
            const monthDate2 = Number(date2.slice(5, 7))
            const dayDate1 = Number(date1.slice(8, 10))
            const dayDate2 = Number(date2.slice(8, 10))

            // if (yearDate1 < yearDate2) {
            //     return true
            // } else if (yearDate1 === yearDate2) {
            //     if (monthDate1 < monthDate2) {
            //         return true
            //     } else if (monthDate1 === monthDate2) {
            //         if (dayDate1 < dayDate2) {
            //             return true
            //         } else if (dayDate1 === dayDate2) {
            //             if 
            //         }
            //     }
            // }

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
            // const formattedApptList = response.data.map((appt) => {
            //     const formattedAppt = {
            //         ...appt,
            //         start: appt.start.toISOString().slice(0, 10),
            //         end: appt.end.slice(0, 10)
            //     }
            //     // will come back to the date later
            //     return formattedAppt
            // })
            // this.apptList = formattedApptList
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