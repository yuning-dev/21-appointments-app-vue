import { describe, test, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'

import ModalWindow from './ModalWindow.vue'

describe('modal window', () => {
    test('clicking the close button emits the correct event', async () => {
        const wrapper = shallowMount(ModalWindow)

        const closeBtn = wrapper.find('.closeBtn')
        await closeBtn.trigger('click')

        expect(wrapper.emitted().closeModal.length).toBe(1)
    })
})