<template>
    <div :class="$style.addItemContainer">
                <label>
                    Appointment title:
                    <InputText type="text" :class="$style.addItemField" v-model="newTitle" @keyup.enter="createAppt" ref="TitleInput" data-testid="TitleInput"/>
                </label>
                <div :class="$style.startEndWrapper">
                    <label>
                        Start
                        <DatePicker showTime hourFormat="12" showIcon icondisplay="input" fluid :class="$style.time" v-model="newStart" data-testid="timePicker"/>
                    </label>
                    <label>
                        End
                        <DatePicker :minDate="this.newStart" showTime hourFormat="12" showIcon icondisplay="input" fluid :class="$style.time" v-model="newEnd" data-testid="timePicker"/>
                    </label>
                </div>
                <div>
                    <button :class="[$style.addButton, $style.button]" @click="createAppt" data-testid="addItemBtn">
                        Create appointment
                    </button>
                </div>
            </div>
</template>

<script>
import InputText from 'primevue/inputtext'
import DatePicker from 'primevue/datepicker'

export default {
    name: 'CreateAppt',
    components: {
        InputText,
        DatePicker
    },
    props: {
        appt: Object
    }
}
</script>

<style module src="./CreateAppt.css"></style>