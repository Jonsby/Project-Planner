<template>
  <div class="widget-item project-widget">
    <dropdown-search
      :title="'Project'"
      :type="'project'"
      :dataGroupName="'projectGroup'"
      :dataGroup="userProjectGroup"
      :componentIndex="componentIndex"
      :componentValue="componentValue"
      :updateComponentValueFn="updateComponentValueFn"
    ></dropdown-search>
  </div>
</template>

<script>
import { global } from "../../main";
import DropdownSearch from "./widgetComponents/dropdownSearch";

export default {
  data() {
    return {
      userProjectGroup: Array,
    };
  },
  props: {
    componentIndex: Number,
    componentValue: Number,
    updateComponentValueFn: Function,
  },
  components: { DropdownSearch },
  beforeMount() {
    this.userProjectGroup = global.getUsersProjects();
  },
};
</script>

<style lang="scss" scoped>
</style>