import { defineStore } from 'pinia'
import axios from 'axios'

export const useTaskStore = defineStore('tasks', {
    state: () => ({
        taskList: [],
    }),
    getters: {
        activeTasksList(state) {
            return state.taskList.filter((task) => !task.completion)
        },
        completedTasksList(state) {
            return state.taskList.filter((task) => task.completion)
        },
    },
    actions: {
        dateOfToday() {
            const today = new Date()
            const todayInString = today.toISOString()
            const dateInString = todayInString.substring(0,10)
            return dateInString
        },
        async fetchTodoList() {
            const response = await axios.get('/api/todo-item')
            this.taskList = response.data
        },
        async sendTodoItem(newTaskDescription, newTaskDueDate, completionStatus) {
            await axios.post('/api/todo-item', {
                description: newTaskDescription,
                dueDate: newTaskDueDate,
                completion: completionStatus
            })
            this.fetchTodoList()
        },
        async deleteTodoItem(item) {
            await axios.post('/api/todo-item/' + item._id)
            this.fetchTodoList()
        }
    },
})