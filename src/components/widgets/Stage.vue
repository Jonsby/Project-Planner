<template>
  <div class="widget-item project-widget">
    <dropdown-search
      :title="title"
      :type="type"
      :dataGroupName="dataGroupName"
      :dataGroup="userStageGroup"
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
      title: "Stage",
      type: "stage",
      dataGroupName: "stageGroup",
      userStageGroup: Array,
    };
  },
  props: {
    componentIndex: Number,
    componentValue: Number,
    updateComponentValueFn: Function,
  },
  components: { DropdownSearch },
  beforeMount() {
    this.title = global.widgets.stage.header;
    this.dataGroupName = global.widgets.stage.property;
    this.userStageGroup = global.getUsersStageGroup();
  },
};
</script>