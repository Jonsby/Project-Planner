<template>
  <div class="widget-item project-widget">
    <dropdown-search
      :title="title"
      :type="type"
      :dataGroupName="dataGroupName"
      :dataGroup="userDropdownGroup"
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
  components: { DropdownSearch },
  data() {
    return {
      title: "Dropdown",
      type: "dropdown",
      dataGroupName: "dropdownGroup",
      userDropdownGroup: Array,
    };
  },
  props: {
    componentIndex: Number,
    componentValue: Number,
    updateComponentValueFn: Function,
  },
  beforeMount() {
    this.dataGroupName = global.widgets.dropdown.property + this.componentIndex;
    this.title = global.widgets.dropdown.header;
    this.dataGroupName = this.dataGroupName;
    this.userDropdownGroup = global.getUsersDropdownGroup(this.dataGroupName);
  },
};
</script>