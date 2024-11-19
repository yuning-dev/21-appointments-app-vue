import { describe, test, expect, vi } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

import CalendarView from './CalendarView.vue'
import CreateAppt from '../../components/create-appt/CreateAppt.vue'
import VueCal from 'vue-cal'

// Tests
//  The initial text and bullet points display
//  The click here link has the route to the list view page
//  The vue-cal component displays
//  The legend displays
//  The Add Appointment button displays; clicking it launches the popup

describe('calendar view page', () => {
    let wrapper

    beforeEach(() => {
        let mountOptions = {
            global: {
                plugins: [
                    createTestingPinia({
                        createSpy: vi.fn
                    })
                ]
            }
        }

        wrapper = shallowMount(CalendarView, mountOptions)
    })

    test('the introduction text and bullet points display', () => {
        expect(wrapper.text().includes('In the Calendar view:')).toBe(true)
        expect(wrapper.text().includes('to create an appointment, click the Add Appointment button at the bottom right of the calendar')).toBe(true)
        expect(wrapper.text().includes('to update an appointment, double click it in the calendar')).toBe(true)
    })

    test('the "click here" link has the route to the list view page', () => {
        const link = wrapper.find('[data-testid="listViewLink"]')
        expect(link.html()).includes('to="/"')
    })

    test('the VueCal component displays', () => {
        expect(wrapper.findComponent(VueCal).exists()).toBe(true)
    })

    test('the legend displays', () => {
        expect(wrapper.text().includes('Done')).toBe(true)
        expect(wrapper.text().includes('Past')).toBe(true)
        expect(wrapper.text().includes('Upcoming')).toBe(true)
    })

    test('the Add Appointment displays and clicking it opens the popup', async () => {
        expect(wrapper.findComponent(CreateAppt).exists()).toBe(false)
        const addApptBtn = wrapper.find('.addBtn')
        await addApptBtn.trigger('click')
        
        expect(wrapper.findComponent(CreateAppt).exists()).toBe(true)
    })
})