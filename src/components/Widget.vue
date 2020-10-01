<template>
    <div class="widget-container row">
        <!-- <div class="widget col" v-for="(widget, index) in task.widgets" :key="index">
            <component :is="widget.type" :componentIndex="index" :componentValue="widget.value" :updateComponentValueFn="updateComponentValue"></component>
        </div> -->
        <div class="widget col" v-for="(widgetColumn, index) in userWidgetColumns" :key="index">
            <!-- {{ widgetSettings[widgetColumn.type].type }} - {{ index }} {{ outputWidgetValue(widgetColumn) }} -->
            <component :is="widgetSettings[widgetColumn.type].type" :componentIndex="index" :componentValue="outputWidgetValue(widgetColumn)" :updateComponentValueFn="updateComponentValue"></component>
        </div>
        <div class="widget col add-widget">

        </div>
    </div>
</template>

<script>
    import Title from './widgets/Title'
    import Text from './widgets/Text'
    import Number from './widgets/Number'
    import Status from './widgets/Status'
    import db from '../firebase/init'
    import { global } from '../main'

    export default {
        props: {
            task: Object,
            userWidgetColumns: Array,
            widgetSettings: Object
        },
        data() {
            return {

            }
        },
        methods: {
            updateComponentValue(index, newValue){
                //TODO: Database - Complete API UPDATE 
                const newWidgets = this.task.widgets
                newWidgets[index].value = newValue
                db.collection('Tasks').doc(this.task.id).update({
                    widgets: newWidgets
                }).then(() => {
                    console.log("successfully updated")
                }).catch((error) => {
                    console.log('error updating doc: ' + error)
                })
            },
            outputWidgetValue(widgetColumn){
                let widgetResult = this.task.widgets.find(item => item.columnId === widgetColumn.id)
                //console.log("widgetValue", widgetResult)
                if(widgetResult){
                    return  widgetResult.value
                }else{
                    return this.widgetSettings[widgetColumn.type].default
                }
                //console.log(this.task.widgets[0])
                //TODO This currently just outputs whatevers in the list. Doesn't work for columns that don't exist in the list.
                //so will need to check the column against the widget type to see if it's correct. 
                //This is where the widgets might need id's to ensure data lines up correctly.
            }
        },
        mounted() {

        },
        components: {
            appTitle: Title,
            appText: Text,
            appNumber: Number,
            appStatus: Status
        }
    }
</script>

<style lang="scss">

</style>