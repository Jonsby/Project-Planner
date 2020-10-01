<template>
    <div class="tasks-view">
        <div class="container task-container" v-if="userSettingsLoaded">
            <app-widget-headers :userWidgetColumns="userWidgetColumns" :widgetSettings="widgetSettings"></app-widget-headers>
            <div class="task" v-for="(task, index) in tasks" :key="index">
                <app-widget :task="task" :userWidgetColumns="userWidgetColumns" :widgetSettings="widgetSettings"></app-widget>
            </div>
        </div>
        <div class="task-controls">
            <button @click="addTask">Add Task</button>
        </div>
    </div>
</template>

<script>
    import Widget from './Widget'
    import WidgetHeaders from './WidgetHeaders'
    import { global } from '../main'
    import db from '../firebase/init'

    export default {
        data(){
            return {
                tasks: [],
                widgetSettings: Object,
                userStatusGroup: [],
                userWidgetColumns: [],
                userSettingsLoaded: false,
                showStatusPopup: false,
                statusPosition: Object
            }
        },
        methods: {
            mapTasks(doc) {
                return {id: doc.id, ...doc.data()}
            },
            addWidgetColumn(type){
                let lastColumnId = this.userWidgetColumns[this.userWidgetColumns.length - 1].id
                let newColumnId = parseInt(lastColumnId) + 1
                this.userWidgetColumns.push({
                    id: newColumnId,
                    type: type
                })
                db.collection('User').doc('Settings').update({
                    widgetColumns: this.userWidgetColumns
                }).then((docRef) => {
                    console.log('userWidgets Successfully updated')
                }).catch((error) => {
                    console.log('userWidgets Error adding document ', error)
                })
                
                console.log(this.tasks)
                //TODO: Need to add a new column to each document
                let batch = db.batch()
                this.tasks.forEach(item => {
                    item.widgets.push({
                        columnId: newColumnId,
                        type: type,
                        value: this.widgetSettings[type].default
                    })
                    batch.update(
                        db.collection('Tasks').doc(item.id),
                        { 'widgets' :  item.widgets }
                    )
                })
                batch.commit().then(() => {
                    console.log('Add Column Batch committed sucessfully')
                }).catch((error) => {
                    console.log('Add Column Batch failed: ' + error)
                })
            },
            deleteWidgetColumn(columnId){
                //TODO Probably safest to just delete all columns data from database aswell.
                //Would be better to leave the data and just assign a new columnID that doesn't interfere with the others
                //That way data won't be removed completely and can later on build a trash bin feature
                let idIndex = this.userWidgetColumns.find(ele => ele.id === columnId)
                let filterResult = this.userWidgetColumns.filter(ele => ele !== idIndex)
                db.collection('User').doc('Settings').update({
                    widgetColumns: filterResult
                }).then(() => {
                    console.log("Column sucessfully deleted")
                    this.userWidgetColumns = filterResult
                }).catch((error) => {
                    console.log("Failed to delete column: " + error)
                })
            },
            addTask(){
                const newTask = {
                    title: 'new task',
                    widgets: []
                }
                this.userWidgetColumns.forEach(item => {
                    let type = global.widgets[item.type].type
                    let value = global.widgets[item.type].default
                    let columnId = item.id

                    newTask.widgets.push({
                        type: type,
                        value: value,
                        columnId: columnId
                    })
                })

                //this.tasks.push(newTask)
                db.collection('Tasks').add(newTask).then((docRef) => { //Make sure this is a pointer instead of function otherwise 'this' doesn't work
                    console.log('Document written with ID: ', docRef.id)
                    newTask.id = docRef.id
                    this.tasks.push(newTask)
                }).catch((error) => {
                    console.log('Error adding document ', error)
                })
            }
        },
        mounted() {
            db.collection('Tasks').get().then(snapshot => {
                this.tasks = snapshot.docs.map(this.mapTasks)
            })
            this.widgetSettings = global.widgets
            global.getUserData()

            global.$on('app-body-clicked', (event) => {
                if(this.showStatusPopup && !event.target.classList.contains("status-dropdown")){
                    this.showStatusPopup = false
                }
            })
            global.$on('got-user-data', () => {
                this.userStatusGroup = global.userStatusGroup
                this.userWidgetColumns = global.userWidgetColumns
                this.userSettingsLoaded = true
            })
            global.$on('new-widget-column', (type) => {
                this.addWidgetColumn(type)
            })
            global.$on('delete-widget-column', (id) => {
                this.deleteWidgetColumn(id)
            })
        },
        components: {
            appWidget: Widget,
            appWidgetHeaders: WidgetHeaders
        }
    }
</script>

<style lang="scss">
    .container .row{
        flex-wrap: nowrap;
    }
    .col:not(.add-widget){
        min-width: 200px;
    }
</style>