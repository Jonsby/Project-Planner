<template>
  <div class="widget-item date-widget">
    <input
      type="datetime-local"
      :value="componentValue"
      @change="updateValue"
    />
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
      let dateValue = event.target.value;
      this.updateComponentValueFn(this.componentIndex, "dateTime", dateValue);
    },
  },
};
</script>