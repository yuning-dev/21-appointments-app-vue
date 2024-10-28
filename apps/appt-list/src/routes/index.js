import ApptList from '@/pages/appt-list/ApptList.vue'
import test from '@/components/test.vue'

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
    }
]