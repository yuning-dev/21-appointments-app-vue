import ApptList from '@/pages/appt-list/ApptList.vue'
import CalendarView from '../pages/calendar-view/CalendarView.vue'

export default [
    {
        path: '/',
        name: 'list-view',
        component: ApptList
    },
    {
        path: '/calendar-view',
        name: 'calendar-view',
        component: CalendarView
    }
]