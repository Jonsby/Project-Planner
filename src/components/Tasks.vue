<template>
  <div class="tasks-view">
    <div class="container-fluid task-container" v-if="userSettingsLoaded">
      <app-widget-headers
        :userWidgetColumns="userWidgetColumns"
        :widgetSettings="widgetSettings"
      ></app-widget-headers>
      <div class="task" v-for="(task, index) in tasks" :key="index">
        <app-widget
          :task="task"
          :userWidgetColumns="userWidgetColumns"
          :widgetSettings="widgetSettings"
        ></app-widget>
      </div>
    </div>
    <div class="task-controls">
      <button @click="addTask">Add Task</button>
    </div>
  </div>
</template>

<script>
import Widget from "./Widget";
import WidgetHeaders from "./WidgetHeaders";
import { global } from "../main";
import db from "../firebase/init";
import firebase from "firebase";

export default {
  data() {
    return {
      tasks: [],
      widgetSettings: Object,
      userStatusGroup: [],
      userWidgetColumns: [],
      lastWidgetColumnId: Number,
      userSettingsLoaded: false,
      showStatusPopup: false,
      statusPosition: Object,
    };
  },
  methods: {
    mapTasks(doc) {
      return { id: doc.id, ...doc.data() };
    },
    addWidgetColumn(type, label) {
      global.getUserData().then(() => {
        let lastColumnId = global.lastWidgetColumnId;
        let newColumnId = parseInt(lastColumnId) + 1;
        let orderId = this.userWidgetColumns.length;

        db.collection("User")
          .doc("Settings")
          .update({
            lastWidgetColumnId: newColumnId,
            widgetColumns: firebase.firestore.FieldValue.arrayUnion({
              id: newColumnId,
              type: type,
              label: label,
              order: orderId,
            }),
          })
          .then((docRef) => {
            console.log("userWidgets Successfully updated");
            global.updateDataTimestamp();
          })
          .catch((error) => {
            console.log("userWidgets Error adding document ", error);
          });
      });
    },
    deleteWidgetColumn(columnId) {
      //TODO Probably safest to just delete all columns data from database aswell.
      //Would be better to leave the data and just assign a new columnID that doesn't interfere with the others
      //That way data won't be removed completely and can later on build a trash bin feature
      if (this.userWidgetColumns.length <= 1) {
        alert("Can't remove last column");
        return null;
      }
      let idIndex = this.userWidgetColumns.find((ele) => ele.id === columnId);
      let filterResult = this.userWidgetColumns.filter(
        (ele) => ele !== idIndex
      );

      for (let i = 0; i < filterResult.length; i++) {
        filterResult[i].order = i;
      }

      db.collection("User")
        .doc("Settings")
        .update({
          widgetColumns: filterResult,
        })
        .then(() => {
          console.log("Column sucessfully deleted");
          this.userWidgetColumns = filterResult;
        })
        .catch((error) => {
          console.log("Failed to delete column: " + error);
        });
    },
    addTask() {
      const newTask = {
        widgets: [],
      };
      // this.userWidgetColumns.forEach((item) => {
      //   let type = global.widgets[item.type].type;
      //   let value = global.widgets[item.type].default;
      //   let columnId = item.id;

      //   newTask.widgets.push({
      //     type: type,
      //     value: value,
      //     columnId: columnId,
      //   });
      // });

      //this.tasks.push(newTask)
      db.collection("Tasks")
        .add(newTask)
        .then((docRef) => {
          //Make sure this is a pointer instead of function otherwise 'this' doesn't work
          console.log("Document written with ID: ", docRef.id);
          newTask.id = docRef.id;
          this.tasks.push(newTask);
        })
        .catch((error) => {
          console.log("Error adding document ", error);
        });
    },
  },
  mounted() {
    console.log("starting listener");
    db.collection("User")
      .doc("Updates")
      .onSnapshot(function (doc) {
        if (doc.data().lastDataUpdate > global.lastDataUpdate) {
          global.getUserData();
        }
        global.lastDataUpdate = doc.data().lastDataUpdate;
      });

    db.collection("Tasks")
      .get()
      .then((snapshot) => {
        console.log(snapshot);
        this.tasks = snapshot.docs.map(this.mapTasks);
      });
    this.widgetSettings = global.widgets;
    //global.getUserData();
    global.userSetup();

    global.$on("app-body-clicked", (event) => {
      if (
        this.showStatusPopup &&
        !event.target.classList.contains("status-dropdown")
      ) {
        this.showStatusPopup = false;
      }
    });
    global.$on("got-user-data", () => {
      this.userStatusGroup = global.userStatusGroup;
      this.userWidgetColumns = global.userWidgetColumns;
      this.lastWidgetColumnId = global.lastWidgetColumnId;
      this.userSettingsLoaded = true;
    });
    global.$on("new-widget-column", (type, label) => {
      this.addWidgetColumn(type, label);
    });
    global.$on("delete-widget-column", (id) => {
      this.deleteWidgetColumn(id);
    });
    global.$on("update-widget-columns", (widgetColumns) => {
      db.collection("User")
        .doc("Settings")
        .update({
          widgetColumns: widgetColumns,
        })
        .then(() => {
          console.log("User Widget Columns Updates");
        })
        .catch((error) => {
          console.log("Failed to update columns: " + error);
        });
    });
    global.$on("rename-widget-column", (newValue, id) => {
      this.userWidgetColumns.forEach((item) => {
        if (item.id === id) {
          item.label = newValue;
        }
      });
      db.collection("User")
        .doc("Settings")
        .update({
          widgetColumns: this.userWidgetColumns,
        })
        .then(() => {
          console.log("User Widget Renamed");
        })
        .catch((error) => {
          console.log("Failed to rename column: " + error);
        });
    });
  },
  components: {
    appWidget: Widget,
    appWidgetHeaders: WidgetHeaders,
  },
};
</script>

<style lang="scss">
.container .row {
  flex-wrap: nowrap;
}
.tasks-view {
  .col {
    width: 200px;
    padding: 0 5px;

    input {
      width: 100%;
    }
  }
  .widget-columns {
    border-bottom: 1px solid #ccc;
  }
  .task {
    padding: 10px 0;
    border-bottom: 1px solid #ccc;
  }
}
</style>