<template>
  <div class="d-inline-flex header">
    <draggable
      class="widget-columns d-inline-flex"
      ghost-class="ghost"
      :move="checkMove"
      @update="onUpdate"
      :list="userWidgetColumns"
    >
      <div
        class="col d-inline-flex"
        v-for="(widget, index) in userWidgetColumns"
        :key="index"
      >
        <input
          type="text"
          :ref="widget.id"
          :class="{ 'disabled no-borders': widget.id !== renameID }"
          :disabled="widget.id !== renameID"
          :value="widget.label"
          @blur="renameWidgetColumn($event, widget.id)"
        />
        <b-dropdown text="" class="m-md-2">
          <b-dropdown-item @click="enableRename(widget.id, widget.label)"
            >Rename</b-dropdown-item
          >
          <b-dropdown-divider></b-dropdown-divider>
          <b-dropdown-item @click="deleteWidgetColumn(widget.id)"
            >Delete Column</b-dropdown-item
          >
        </b-dropdown>
      </div>
    </draggable>
    <div class="col add-widget">
      <span class="widget-dropdown" @click="dropdownOpen = true">+</span>
      <div class="task-dropdown" v-if="dropdownOpen">
        <div class="list-group widget-dropdown dropdown-list">
          <button
            type="button"
            class="list-group-item list-group-item-action"
            v-for="(widget, index) in widgetSettings"
            :key="index"
            @click="newWidgetColumn(widget.slug, widget.header)"
          >
            {{ widget.header }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { global } from "../main";
import draggable from "vuedraggable";

export default {
  components: {
    draggable,
  },
  props: {
    userWidgetColumns: Array,
    widgetSettings: Object,
  },
  data() {
    return {
      dropdownOpen: false,
      renameID: Number,
      originalTitle: String,
      dragging: false,
      dragID: Number,
      widgetList: Object,
    };
  },
  methods: {
    newWidgetColumn(type, label) {
      global.$emit("new-widget-column", type, label);
    },
    deleteWidgetColumn(id) {
      global.$emit("delete-widget-column", id);
    },
    enableRename(id, label) {
      this.renameID = id;
      this.originalTitle = label;

      const dc = this;
      setTimeout(function () {
        dc.$refs[id][0].focus();
      }, 10);
    },
    renameWidgetColumn(event, id) {
      this.renameID = -1;
      if (event.target.value !== this.originalTitle) {
        global.$emit("rename-widget-column", event.target.value, id);
      }
    },
    onUpdate(event) {
      let widgetColumns = this.userWidgetColumns;
      for (let i = 0; i < widgetColumns.length; i++) {
        widgetColumns[i].order = i;
      }
      global.$emit("update-widget-columns", widgetColumns);
    },
    checkMove: function (e) {
      window.console.log(
        "Future index: " + Object(e.draggedContext.futureIndex)
      );
    },
  },
  mounted() {
    global.$on("app-body-clicked", (event) => {
      if (
        this.dropdownOpen &&
        !event.target.classList.contains("widget-dropdown")
      ) {
        this.dropdownOpen = false;
      }
    });
  },
};
</script>

<style lang="scss">
.task-dropdown {
  position: relative;
  z-index: 1;
}
.dropdown-list {
  position: absolute;
  width: 200px;
}
.widget-container .add-widget,
.header .add-widget {
  background-color: #eeeeee;
  width: 30px;
  flex-grow: 0;
}
</style>

<style lang="scss" scoped>
.widget-columns {
  width: 100%;
}
.ghost {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>