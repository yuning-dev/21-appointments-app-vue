import { describe, test, expect, beforeEach, vi } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { useApptStore } from '@/stores/ApptStore'
import { nextTick } from 'vue'

import ApptList from './ApptList.vue'
import CreateAppt from '../../components/create-appt/CreateAppt.vue'
import DatePicker from 'primevue/datepicker'
import InputText from 'primevue/inputtext'
import Appointment from '../../components/appointment/Appointment.vue'
import ModalWindow from '../../components/modal-window/ModalWindow.vue'

// Things to test
    // Displays the title and introduction text
    // Displays the CreateAppt component
    // Displays the correct amount of appointments under each section (depending on appts in the store)
    // Clicking delete upcoming/past/completed/all appointments makes the modal window appear with the appropriate text
    //  clicking the cancel button closes the modal
    //  clicking the yes button sends the right call to the store

//  All done; only outstanding
    // When clicking 'click here', routes to the calendar view

describe('appointments list view', () => {
    let router
    let mountOptions

    beforeEach(() => {
        router = {
            push: vi.fn()
        }

        mountOptions = {
            global: {
                plugins: [
                    createTestingPinia({
                        createSpy: vi.fn,
                        initialState: {
                            apptList: []
                        }
                    },
                    router
                )],
                stubs: {
                    DatePicker: true,
                    InputText: true
                },
                mocks: {
                    $router: router
                }
            }
        }
    })

    const sampleApptList = [
        {
            _id: "672df3c2fef1e2f7f9b0fce6",
            title: "go scuba diving",
            start: new Date("2024-11-01T09:17:44.000Z"),
            end: new Date("2024-11-01T10:32:44.000Z"),
            completion: true,
            sessionId: "OkKn_OT-1F-BOvieBVBAAoAuRSV5L1sP",
            __v: 0
        },
        {
            _id: "672df3b1fef1e2f7f9b0fce3",
            title: "have donuts",
            start: new Date("2024-11-08T09:17:44.000Z"),
            end: new Date("2024-11-08T10:32:44.000Z"),
            completion: false,
            sessionId: "OkKn_OT-1F-BOvieBVBAAoAuRSV5L1sP",
            __v: 0
        },
        {
            _id: "672df373fef1e2f7f9b0fce0",
            title: "have coffee",
            start: new Date("2080-11-30T11:17:44.000Z"),
            end: new Date("2080-11-30T12:32:44.000Z"),
            completion: false,
            sessionId: "OkKn_OT-1F-BOvieBVBAAoAuRSV5L1sP",
            __v: 0
        }
    ]


    function addSampleAppts() {
        const store = useApptStore()
        store.apptList = sampleApptList
    }

    test('it displays the title and introduction text', () => {
        const wrapper = shallowMount(ApptList)

        expect(wrapper.text().includes('Snazzy Appointments App')).toBe(true)
        expect(wrapper.text().includes('Managing appointments has never been easier. Begin by entering your appointment details below.')).toBe(true)
    })

    test('by default, it displays the CreateAppt component and does not display the Appointment and ModalWindow components', () => {
        const wrapper = shallowMount(ApptList)

        const createAppt = wrapper.findComponent(CreateAppt)
        const appointment = wrapper.findComponent(Appointment)
        const modalWindow = wrapper.findComponent(ModalWindow)

        expect(createAppt.exists()).toBe(true)
        expect(appointment.exists()).toBe(false)
        expect(modalWindow.exists()).toBe(false)
    })

    // Find how to either trigger the link "click here" (and then check that router.push has been called)
    // Or how to test that the router-link html contains the path?? 
    // test('clicking the "click here" link routes the user to the calendar view page', async () => {
    //     const wrapper = shallowMount(ApptList, mountOptions)

    //     const link = wrapper.find('[data-testid="calViewLink"]')
    //     expect(JSON.stringify(link.html())).includes(`<router-link :to="{ name: 'calendar-view' }" data-testid="calViewLink">`)
    // })

    test('it displays the correct amount of appointments under each section (based on store data)', () => {
        addSampleAppts()
        const store = useApptStore()
        expect(store.apptList.length).toBe(3)
        expect(store.upcomingApptsList.length).toBe(1)
        expect(store.pastApptsList.length).toBe(1)
        expect(store.completedApptsList.length).toBe(1)

        const wrapper = shallowMount(ApptList)
        expect(wrapper.findAllComponents(Appointment).length).toBe(3)

        const upcomingSection = wrapper.find('.upcomingApptsSection')
        expect(upcomingSection.findAllComponents(Appointment).length).toBe(1)

        const pastSection = wrapper.find('.pastApptsSection')
        expect(pastSection.findAllComponents(Appointment).length).toBe(1)

        const completedSection = wrapper.find('.completedApptsSection')
        expect(completedSection.findAllComponents(Appointment).length).toBe(1)
    })

    test('clicking delete upcoming/past/completed/all appointments buttons makes a modal appear with the appropriate text', async () => {
        addSampleAppts()

        const wrapper = mount(ApptList, mountOptions)
        expect(wrapper.findComponent(ModalWindow).exists()).toBe(false)

        const deleteUpcomingBtn = wrapper.find('[data-testid="deleteUpcomingBtn"]')
        await deleteUpcomingBtn.trigger('click')
        expect(wrapper.findComponent(ModalWindow).exists()).toBe(true)
        expect(wrapper.text().includes('Are you sure you want to delete all the upcoming appointments?'))
        
        const cancelBtn = wrapper.find('.cancelButton')
        await cancelBtn.trigger('click')
        expect(wrapper.findComponent(ModalWindow).exists()).toBe(false)

        const deletePastBtn = wrapper.find('[data-testid="deletePastBtn"]')
        await deletePastBtn.trigger('click')
        expect(wrapper.findComponent(ModalWindow).exists()).toBe(true)
        expect(wrapper.text().includes('Are you sure you want to delete all the past appointments?'))
        
        await cancelBtn.trigger('click')
        expect(wrapper.findComponent(ModalWindow).exists()).toBe(false)

        const deleteCompletedBtn = wrapper.find('[data-testid="deleteCompletedBtn"]')
        await deleteCompletedBtn.trigger('click')
        expect(wrapper.findComponent(ModalWindow).exists()).toBe(true)
        expect(wrapper.text().includes('Are you sure you want to delete all the completed appointments?'))
        
        await cancelBtn.trigger('click')
        expect(wrapper.findComponent(ModalWindow).exists()).toBe(false)

        const deleteAllBtn = wrapper.find('.deleteAllBtn')
        await deleteAllBtn.trigger('click')
        expect(wrapper.findComponent(ModalWindow).exists()).toBe(true)
        expect(wrapper.text().includes('Are you sure you want to delete all the appointments?'))
        
        await cancelBtn.trigger('click')
        expect(wrapper.findComponent(ModalWindow).exists()).toBe(false)
    })

    test('in the modal window that appears after clicking the Delete upcoming appointments button, clicking Yes sends the right call to the store', async () => {
        addSampleAppts()
        const store = useApptStore()
        const wrapper = mount(ApptList, mountOptions)

        const upcomingSection = wrapper.find('.upcomingApptsSection')
        expect(upcomingSection.findAllComponents(Appointment).length).toBe(1)
        const deleteUpcomingBtn = wrapper.find('[data-testid="deleteUpcomingBtn"]')
        await deleteUpcomingBtn.trigger('click')
        expect(wrapper.findComponent(ModalWindow).exists()).toBe(true)
        const yesBtn = wrapper.find('.yesButton')
        await yesBtn.trigger('click')
        await nextTick()
        expect(store.deleteMultipleItems).toHaveBeenCalledWith('upcoming')
    })

    test('in the modal window that appears after clicking the Delete past appointments button, clicking Yes sends the right call to the store', async () => {
        addSampleAppts()
        const store = useApptStore()
        const wrapper = mount(ApptList, mountOptions)

        const pastSection = wrapper.find('.pastApptsSection')
        expect(pastSection.findAllComponents(Appointment).length).toBe(1)
        const deletePastBtn = wrapper.find('[data-testid="deletePastBtn"]')
        await deletePastBtn.trigger('click')
        expect(wrapper.findComponent(ModalWindow).exists()).toBe(true)
        const yesBtn = wrapper.find('.yesButton')
        await yesBtn.trigger('click')
        await nextTick()
        expect(store.deleteMultipleItems).toHaveBeenCalledWith('past')
    })

    test('in the modal window that appears after clicking the Delete completed appointments button, clicking Yes sends the right call to the store', async () => {
        addSampleAppts()
        const store = useApptStore()
        const wrapper = mount(ApptList, mountOptions)

        const completedSection = wrapper.find('.completedApptsSection')
        expect(completedSection.findAllComponents(Appointment).length).toBe(1)
        const deleteCompletedBtn = wrapper.find('[data-testid="deleteCompletedBtn"]')
        await deleteCompletedBtn.trigger('click')
        expect(wrapper.findComponent(ModalWindow).exists()).toBe(true)
        const yesBtn = wrapper.find('.yesButton')
        await yesBtn.trigger('click')
        await nextTick()
        expect(store.deleteMultipleItems).toHaveBeenCalledWith('completed')
    })

    test('in the modal window that appears after clicking the Delete all appointments button, clicking Yes sends the right call to the store', async () => {
        addSampleAppts()
        const store = useApptStore()
        const wrapper = mount(ApptList, mountOptions)

        expect(wrapper.findAllComponents(Appointment).length).toBe(3)
        const deleteAllBtn = wrapper.find('.deleteAllBtn')
        await deleteAllBtn.trigger('click')
        expect(wrapper.findComponent(ModalWindow).exists()).toBe(true)
        const yesBtn = wrapper.find('.yesButton')
        await yesBtn.trigger('click')
        await nextTick()
        expect(store.deleteMultipleItems).toHaveBeenCalledWith('all')
    })

})