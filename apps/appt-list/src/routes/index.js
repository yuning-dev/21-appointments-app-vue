import ApptList from '@/pages/appt-list/ApptList.vue'
import test from '@/components/test.vue'
import CalendarView from '../pages/calendar-view/CalendarView.vue'

export default [
    {
        path: '/',
        name: 'appt-list',
        component: ApptList
    },
    {
        path: '/test',
        name: 'test',
        component: test
    },
    {
        path: '/calendar-view',
        name: 'calendar-view',
        component: CalendarView
    }
]