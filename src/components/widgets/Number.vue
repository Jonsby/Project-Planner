<template>
  <div class="widget-item number-widget">
    <input type="number" :value="componentValue" @change="updateValue" />
  </div>
</template>

<script>
export default {
  props: {
    componentIndex: Number,
    componentValue: Number,
    updateComponentValueFn: Function,
  },
  methods: {
    updateValue(event) {
      let numberValue = parseFloat(event.target.value);
      this.updateComponentValueFn(this.componentIndex, "number", numberValue);
    },
  },
};
</script>

<style lang="scss">
</style>