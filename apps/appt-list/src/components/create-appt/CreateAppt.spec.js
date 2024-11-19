import { describe, test, expect } from "vitest";
import { mount, shallowMount } from "@vue/test-utils";
import { add } from 'date-fns'
import { nextTick } from 'vue'

import CreateAppt from "./CreateAppt.vue";

//tests
//InputText, 2 DatePicker components (start and end) and Create appointment button display
//If no props are passed, default value of title etc is undefined
//Clicking Create Appointment emits the correct event and payload
//Clicking Update Appointment emits the correct event and payload
//Not sure if I could set isInEditMode to be true and test the edit mode stuff??

describe('create appointment component', () => {
    const startDate = new Date()
    const endDate = add(new Date(), { days: 1 })

    test('it displays the InputText component, start and end datepickers', () => {
        const wrapper = shallowMount(CreateAppt)

        const inputText = wrapper.find('[data-testid="TitleInput"]')
        const startDatePicker = wrapper.find('[data-testid="startDatePicker"]')
        const endDatePicker = wrapper.find('[data-testid="endDatePicker"]')

        expect(inputText.exists()).toBe(true)
        expect(startDatePicker.exists()).toBe(true)
        expect(endDatePicker.exists()).toBe(true)
    })

    test('if there are no props, isInEditMode is falsy and the Create appointment button displays', () => {
        const wrapper = shallowMount(CreateAppt)

        expect(wrapper.vm.isInEditMode).toBe(undefined)
        expect(wrapper.find('[data-testid="addItemBtn"]').exists()).toBe(true)
        expect(wrapper.find('[data-testid="updateItemBtn"]').exists()).toBe(false)    
    })

    test('if no props are passed, default values of title, start, end, completion are undefined', async () => {
        const wrapper = shallowMount(CreateAppt)

        expect(wrapper.vm.title).toBe(undefined)
        expect(wrapper.vm.start).toBe(undefined)
        expect(wrapper.vm.end).toBe(undefined)
        expect(wrapper.vm.isCompleted).toBe(undefined)
    })

    test('clicking the Create appointment button emits the correct event', async () => {
        const wrapper = shallowMount(CreateAppt) 

        wrapper.setData({
            title: 'go see dentist',
            start: startDate,
            end: endDate,
            completion: false
        })

        const addItemBtn = wrapper.find('[data-testid="addItemBtn"]')
        await addItemBtn.trigger('click')
        expect(wrapper.emitted().createAppt).toEqual([['go see dentist', startDate, endDate, false ]])
        expect(wrapper.vm.title).toBe('')
    })

    // Below are tests for updating appointments
    test('if appt is passed in as a prop (with an _id), isInEditMode is truthy and Update appointment button displays', () => {
        const wrapper = shallowMount(CreateAppt, {
            props: {
                appt: {
                    _id: 1,
                    title: 'go see dentist',
                    start: startDate,
                    end: endDate,
                    completion: false
                }
            }
        })

        expect(wrapper.vm.isInEditMode).toBe(1)
        expect(wrapper.find('[data-testid="addItemBtn"]').exists()).toBe(false)
        expect(wrapper.find('[data-testid="updateItemBtn"]').exists()).toBe(true)    
    })

    test('if an appt object is passed as a prop, its values become the values of title, start, end and completion', async () => {
        const wrapper = shallowMount(CreateAppt, {
            props: {
                appt: {
                    title: 'go see dentist',
                    start: startDate,
                    end: endDate,
                    completion: false
                }
            }
        })

        expect(wrapper.vm.title).toBe('go see dentist')
        expect(wrapper.vm.start).toBe(startDate)
        expect(wrapper.vm.end).toBe(endDate)
        expect(wrapper.vm.isCompleted).toBe(false)
    })

    test('clicking Update appointment button emits the correct event', async () => {        
        const wrapper = shallowMount(CreateAppt, {
            props: {
                appt: {
                    _id: 1,
                    title: 'go see dentist',
                    start: startDate,
                    end: endDate,
                    completion: false
                }
            }
        })

        expect(wrapper.vm.isInEditMode).toBe(1)

        const updateBtn = wrapper.find('[data-testid="updateItemBtn"]')
        await updateBtn.trigger('click')

        expect(wrapper.emitted().updateAppt).toEqual([[ wrapper.vm.title, wrapper.vm.start, wrapper.vm.end, wrapper.vm.isCompleted, 1 ]])
    })
})