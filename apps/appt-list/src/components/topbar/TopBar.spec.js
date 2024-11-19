import { describe, test, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'

import TopBar from './TopBar.vue'

//Tests
//Each link contains the correct route

describe('top navigation bar', () => {
    test('Each router-link has the correct routing', async () => {
        const wrapper = shallowMount(TopBar)

        const listLink = wrapper.find('[data-testid="listViewLink"]')
        expect(listLink.html()).includes('to="/"')

        const calendarLink = wrapper.find('[data-testid="calendarViewLink"]')
        expect(calendarLink.html()).includes('to="/calendar-view"')
    })
})