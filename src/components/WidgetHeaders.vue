<template>
    <div class="row header">
        <div class="col" v-for="(widget, index) in userWidgetColumns" :key="index">
            {{ widget.type }} {{ widget.id }}
            <b-dropdown text="" class="m-md-2">
                <b-dropdown-item>First Action</b-dropdown-item>
                <b-dropdown-divider></b-dropdown-divider>
                <b-dropdown-item @click="deleteWidgetColumn(widget.id)">Delete Column</b-dropdown-item>    
            </b-dropdown>
        </div>
        <div class="col add-widget">
            <span class="widget-dropdown" @click="dropdownOpen = true">+</span>
            <div class="task-dropdown" v-if="dropdownOpen">
                <div class="list-group widget-dropdown dropdown-list">
                    <button type="button" class="list-group-item list-group-item-action" 
                        v-for="(widget, index) in widgetSettings" :key="index" 
                        @click="newWidgetColumn(widget.slug)"
                        >{{ widget.header }}</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { global } from "../main";

export default {
    props: {
        userWidgetColumns: Array,
        widgetSettings: Object
    },
    data() {
        return {
            dropdownOpen: false
        }
    },
    methods: {
        newWidgetColumn(type){
            global.$emit('new-widget-column',type)
        },
        deleteWidgetColumn(id){
            global.$emit('delete-widget-column',id)
        }
    },
    mounted(){
        global.$on('app-body-clicked', (event) => {
            if(this.dropdownOpen && !event.target.classList.contains("widget-dropdown")){
                this.dropdownOpen = false
            }
        })
    }
}
</script>

<style lang="scss">
    .task-dropdown{
        position: relative;
        z-index: 1;
    }
    .dropdown-list{
        position: absolute;
        width: 200px;
    }
    .widget-container .add-widget,
    .header .add-widget{
        background-color: #eeeeee;
        width: 30px;
        flex-grow: 0;
    }
</style>