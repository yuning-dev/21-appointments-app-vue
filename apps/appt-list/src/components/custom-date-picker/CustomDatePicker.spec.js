import { describe, test, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'

import CustomDatePicker from './CustomDatePicker.vue'

describe('custom date picker component', () => {

    test('by default, DatePicker component displays and tickIcon does not', () => {
        const wrapper = shallowMount(CustomDatePicker)

        const datePicker = wrapper.find('[data-testid="timePicker"]')
        expect(datePicker.exists()).toBe(true)
        const tickIcon = wrapper.find('.tickIcon')
        expect(tickIcon.exists()).toBe(false)
    })

    test('when DatePicker gains focus, tickIcon displays', async () => {
        const wrapper = shallowMount(CustomDatePicker)

        const datePicker = wrapper.find('[data-testid="timePicker"]')
        await datePicker.trigger('show')
        const tickIcon = wrapper.find('.tickIcon')
        expect(tickIcon.exists()).toBe(true)
    })

    test('when DatePicker loses focus, tickIcon disappears', async () => {
        const wrapper = shallowMount(CustomDatePicker)

        const datePicker = wrapper.find('[data-testid="timePicker"]')
        await datePicker.trigger('show')
        await datePicker.trigger('hide')
        const tickIcon = wrapper.find('tickIcon')
        expect(tickIcon.exists()).toBe(false)
    })
})