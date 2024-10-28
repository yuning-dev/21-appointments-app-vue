<template>
    <div :class="$style.wrapper">
        <DatePicker v-model="date" dateFormat="dd/mm/yy" showIcon fluid iconDisplay="input" />
        <button @click="submitDate">Submit date</button>

        <DatePicker v-model="start" timeOnly fluid /> 
        <DatePicker v-model="end" timeOnly fluid />
        <button @click="submitTime">Submit time</button>
    </div>
</template>

<script>
import DatePicker from 'primevue/datepicker';

export default {
    name: 'test',
    components: {
        DatePicker
    },
    data() {
        return {
            date: null,
            start: null,
            end: null
        }
    },
    methods: {
        submitDate() {
            // console.log(this.date)   // Mon Oct 28 2024 00:00:00 GMT+0000 (Greenwich Mean Time)
            // console.log(typeof this.date)  //object
        },
        submitTime() {
            // console.log(this.start)   // Assumes the date of today; Mon Oct 28 2024 10:24:48 GMT+0000 (Greenwich Mean Time)
            // console.log(typeof this.start)   //object
            this.createDateObject(this.start)
            // this.createDateObject(this.end)
        },
        createDateObject(time) {
            //example: 2015-03-04T00:00:00.000Z
            //time refers to start or end
            console.log(this.date.toISOString)
            const year = this.date.toISOString().slice(0, 4)
            const month = this.date.toISOString().slice(5, 7)
            const day = this.date.toISOString().slice(8, 10)
            const hour = time.toISOString().slice(11, 13)
            const minutes = time.toISOString().slice(14, 16)

            const dateISOString = `${year}-${month}-${day}T${hour}:${minutes}:00`

            console.log(dateISOString)
            console.log(new Date(dateISOString))

            return new Date(dateISOString)
        }
    }
}
</script>

<style module src="./test.css"></style>