<template>
  <div class="widget-item text-widget">
    <input type="text" :value="componentValue" @change="updateValue" />
  </div>
</template>

<script>
export default {
  props: {
    componentIndex: Number,
    componentValue: String,
    updateComponentValueFn: Function,
  },
  methods: {
    updateValue(event) {
      this.updateComponentValueFn(
        this.componentIndex,
        "text",
        event.target.value
      );
    },
  },
};
</script>

<style lang="scss">
</style>