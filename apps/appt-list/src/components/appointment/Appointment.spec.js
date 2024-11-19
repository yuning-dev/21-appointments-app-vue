import { describe, test, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { add } from 'date-fns'

import Appointment from './Appointment.vue'

//tests
//  - displays the appointment title and the start and end dates in the correct format
//  - isInEditMode is false by default; the modal window component is not displayed
//  - displays the completed, edit and delete buttons
//  - clicking the completed button emits the correct event and payload
//  - clicking the edit button triggers the following:
//      - isInEditMode is updated to true
//      - a Modal Window displays
//  - clicking the delete button emits the correct event and payload

describe('appointment component', () => {
    let wrapper
    const startDate = new Date()
    const endDate = add(new Date(), { days: 1 })

    beforeEach(() => {
        wrapper = shallowMount(Appointment, {
            props: {
                appt: {
                    _id: 15,
                    title: 'go to florist',
                    start: startDate,
                    end: endDate,
                    completion: false
                }
            }
        })
    })

    test('it displays the appointment title and the start and end dates in the correct format', () => {
        expect(wrapper.text().includes('go to florist')).toBe(true)

        function formatDate(date) {
            const dateString = date.toISOString()
            return `${dateString.slice(8, 10)}-${dateString.slice(5, 7)}-${dateString.slice(0, 4)} ${dateString.slice(11, 16)}`
        }

        expect(wrapper.text().includes(`${ formatDate(startDate) }`))
        expect(wrapper.text().includes(`${ formatDate(endDate) }`))
    })

    test('isInEditMode is false by default and the modal window component is not displayed', () => {
        expect(wrapper.vm.isInEditMode).toBe(false)
        expect(wrapper.find('[data-testid="modalWindow"]').exists()).toBe(false)
    })

    test('it displays the completed, edit and delete buttons', async () => {
        expect(wrapper.find('[data-testid="completedBtn"]').exists()).toBe(true)
        expect(wrapper.find('[data-testid="editBtn"]').exists()).toBe(true)
        expect(wrapper.find('[data-testid="deleteBtn"]').exists()).toBe(true)
    })

    test('clicking the completed button triggers the correct event', async () => {
        const completedBtn = wrapper.find('[data-testid="completedBtn"]')
        await completedBtn.trigger('click')

        expect(wrapper.emitted().moveToCompleted.length).toBe(1)
    })

    test('clicking the edit button changes state of isInEditMode and opens the modal window component', async () => {
        expect(wrapper.vm.isInEditMode).toBe(false)
        expect(wrapper.find('[data-testid="modalWindow"]').exists()).toBe(false)
        
        const editBtn = wrapper.find('[data-testid="editBtn"]')
        await editBtn.trigger('click')

        expect(wrapper.vm.isInEditMode).toBe(true)
        expect(wrapper.find('[data-testid="modalWindow"]').exists()).toBe(true)
    })

    test('clicking the delete button triggers the correct event and payload', async () => {
        const deleteBtn = wrapper.find('[data-testid="deleteBtn"]')
        await deleteBtn.trigger('click')

        expect(wrapper.emitted().delete.length).toBe(1)
        expect(wrapper.emitted().delete).toEqual([[15]])
    })
})