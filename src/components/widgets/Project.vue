<template>
  <div class="widget-item project-widget">
    <div class="status-dropdown" @click="dropdownOpen = true">{{}}</div>
    <div class="task-dropdown" v-if="dropdownOpen">
      <div class="list-group status-dropdown dropdown-list">
        <button
          type="button"
          class="list-group-item list-group-item-action"
          v-for="(status, index) in userStatusGroup"
          :key="index"
          @click="updateValue(index)"
        >
          {{ status }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { global } from "../../main";

export default {
  data() {
    return {
      userProjectCollection: Array,
      dropdownOpen: false,
    };
  },
  props: {
    componentIndex: Number,
    componentValue: Number,
    updateComponentValueFn: Function,
  },
  mounted() {
    this.userProjectCollection = global.getUsersProjects();
    this.userProjectCollection = global.getUsersStatusGroup();
  },
};
</script>