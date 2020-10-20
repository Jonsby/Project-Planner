<template>
  <div class="widget-container d-inline-flex">
    <!-- <div class="widget col" v-for="(widget, index) in task.widgets" :key="index">
            <component :is="widget.type" :componentIndex="index" :componentValue="widget.value" :updateComponentValueFn="updateComponentValue"></component>
        </div> -->
    <div
      class="widget col"
      v-for="(widgetColumn, index) in userWidgetColumns"
      :key="index"
    >
      <!-- {{ widgetSettings[widgetColumn.type].type }} - {{ index }} {{ outputWidgetValue(widgetColumn) }} -->
      <component
        :is="widgetSettings[widgetColumn.type].type"
        :componentIndex="widgetColumn.id"
        :componentValue="outputWidgetValue(widgetColumn)"
        :updateComponentValueFn="updateComponentValue"
      ></component>
    </div>
    <div class="widget delete-task">
      <font-awesome-icon icon="trash" />
    </div>
  </div>
</template>

<script>
import Project from "./widgets/Project";
import Text from "./widgets/Text";
import Number from "./widgets/Number";
import Date from "./widgets/Date";
import Time from "./widgets/Time";
import DateTime from "./widgets/DateTime";
import Status from "./widgets/Status";
import Stage from "./widgets/Stage";
import Dropdown from "./widgets/Dropdown";
import db from "../firebase/init";
import { global } from "../main";

export default {
  props: {
    task: Object,
    userWidgetColumns: Array,
    widgetSettings: Object,
  },
  data() {
    return {};
  },
  methods: {
    updateComponentValue(index, type, newValue) {
      const newWidgets = this.task.widgets;

      let widgetValueExists = false;
      for (let i = 0; i < newWidgets.length; i++) {
        if (newWidgets[i].columnId === index) {
          newWidgets[i].value = newValue;
          widgetValueExists = true;
        }
      }

      if (!widgetValueExists) {
        newWidgets.push({
          columnId: index,
          type: type,
          value: newValue,
        });
      }
      db.collection("Tasks")
        .doc(this.task.id)
        .update({
          widgets: newWidgets,
        })
        .then(() => {
          console.log("successfully updated");
        })
        .catch((error) => {
          console.log("error updating doc: " + error);
        });
    },
    outputWidgetValue(widgetColumn) {
      let widgetResult = this.task.widgets.find(
        (item) => item.columnId === widgetColumn.id
      );
      //console.log("widgetValue", widgetResult)
      if (widgetResult) {
        return widgetResult.value;
      } else {
        return this.widgetSettings[widgetColumn.type].default;
      }
      //console.log(this.task.widgets[0])
      //TODO This currently just outputs whatevers in the list. Doesn't work for columns that don't exist in the list.
      //so will need to check the column against the widget type to see if it's correct.
      //This is where the widgets might need id's to ensure data lines up correctly.
    },
    deleteTask() {},
  },
  mounted() {},
  components: {
    appProject: Project,
    appText: Text,
    appNumber: Number,
    appDate: Date,
    appTime: Time,
    appDateTime: DateTime,
    appStatus: Status,
    appStage: Stage,
    appDropdown: Dropdown,
  },
};
</script>

<style lang="scss">
.delete-task i {
  color: red;
}
.delete-task {
  width: 30px;
  text-align: center;
  cursor: pointer;
}
</style>