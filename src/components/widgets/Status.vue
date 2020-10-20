<template>
  <div class="widget-item status-widget">
    <div class="status-dropdown" @click="dropdownOpen = true">
      {{ userStatusGroup[componentValue] }}
    </div>
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
      userStatusGroup: Array,
      clickedElement: null,
      dropdownOpen: false,
    };
  },
  props: {
    componentIndex: Number,
    componentValue: Number,
    updateComponentValueFn: Function,
  },
  methods: {
    updateValue(index) {
      //this.componentValue = index
      this.updateComponentValueFn(this.componentIndex, "status", index);
    },
  },
  mounted() {
    this.userStatusGroup = global.getUsersStatusGroup();

    global.$on("app-body-clicked", (event) => {
      if (
        this.dropdownOpen &&
        !event.target.classList.contains("status-dropdown")
      ) {
        this.dropdownOpen = false;
      }
    });
  },
};
</script>

<style lang="scss">
</style>