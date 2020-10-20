<template>
  <div class="widget-item time-widget">
    <input type="time" :value="componentValue" @change="updateValue" />
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
      let inputValue = event.target.value;
      this.updateComponentValueFn(this.componentIndex, "time", inputValue);
    },
  },
};
</script>