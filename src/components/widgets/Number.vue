<template>
    <div class="widget-item number-widget">
        <input type="number" :value="componentValue" @change="updateValue">
    </div>
</template>

<script>
    export default {
        props: {
            componentIndex: Number,
            componentValue: String,
            updateComponentValueFn: Function
        },
        methods: {
            updateValue(event){
                this.updateComponentValueFn(this.componentIndex, event.target.value)
            }
        }
    }
</script>

<style lang="scss">
    
</style>