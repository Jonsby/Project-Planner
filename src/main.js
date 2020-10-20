import Vue from "vue";
import App from "./App.vue";
import router from "./router";

import { BootstrapVue } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import db from "./firebase/init";
import firebase from "firebase";

library.add(faTrash);

Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false;
Vue.use(BootstrapVue);

//JS Object Functions
Object.filter = (obj, predicate) =>
  Object.keys(obj)
    .filter((key) => predicate(obj[key]))
    .reduce((res, key) => ((res[key] = obj[key]), res), {});

Object.size = function (obj) {
  var size = 0,
    key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

export const global = new Vue({
  data() {
    return {
      // widgets: {
      //   text: 'appText',
      //   number: 'appNumber',
      //   status: 'appStatus'
      // },
      // widgetDefaults: {
      //   text: 'secy',
      //   number: '22',
      //   status: 0
      // },
      widgets: {
        project: {
          type: "appProject",
          header: "Project",
          slug: "project",
          property: "projectGroup",
          default: -1,
          defaultOptions: [],
          static: true,
          requiresSetup: true,
          data: []
        },
        text: {
          type: "appText",
          header: "Text",
          slug: "text",
          default: "",
          static: false
        },
        number: {
          type: "appNumber",
          header: "Number",
          slug: "number",
          default: undefined,
          static: false
        },
        date: {
          type: "appDate",
          header: "Date",
          slug: "date",
          default: "",
          static: false
        },
        time: {
          type: "appTime",
          header: "Time",
          slug: "time",
          default: "",
          static: false
        },
        dateTime: {
          type: "appDateTime",
          header: "Date Time",
          slug: "dateTime",
          default: "",
          static: false
        },
        status: {
          type: "appStatus",
          header: "Status",
          slug: "status",
          property: "statusGroup",
          default: 0,
          static: false,
          defaultOptions: ["In Progress", "Problem", "Done"],
          requiresSetup: true,
          data: []
        },
        stage: {
          type: "appStage",
          header: "Stage",
          slug: "stage",
          property: "stageGroup",
          default: 0,
          static: false,
          defaultOptions: ["Scope", "Design", "Build"],
          requiresSetup: true,
          data: []
        },
        dropdown: {
          type: "appDropdown",
          header: "Dropdown",
          slug: "dropdown",
          property: "dropdownGroup",
          default: -1,
          static: false,
          defaultOptions: [],
          requiresSetup: false,
          data: []
        }
      },
      userData: Object,
      lastWidgetColumnId: 10001,
      userWidgetColumns: Array,
      lastDataUpdate: firebase.firestore.Timestamp.fromDate(new Date())
    };
  },
  methods: {
    mapFirebaseResults(doc) {
      return { id: doc.id, ...doc.data() };
    },
    getUserData() {
      return new Promise((resolve, reject) => {
        const dc = this;
        db.collection("User")
          .doc("Settings")
          .get()
          .then((snapshot) => {
            console.log("Successfully got user data");
            this.userData = snapshot.data();
            dc.lastWidgetColumnId = this.userData.lastWidgetColumnId;
            dc.widgets.project.data = this.userData.projectGroup;
            dc.widgets.status.data = this.userData.statusGroup;
            dc.widgets.stage.data = this.userData.stageGroup;
            dc.userWidgetColumns = this.userData.widgetColumns;
            global.$emit("got-user-data");

            resolve();
          })
          .catch((error) => {
            console.log("Error getting document ", error);

            reject(error);
          });
      });
    },
    getUsersProjects() {
      return this.widgets.project.data;
    },
    getUsersStatusGroup() {
      //TODO: Database
      return this.widgets.status.data;
    },
    getUsersStageGroup() {
      return this.widgets.stage.data;
    },
    getUsersDropdownGroup(dataGroup) {
      return this.userData[dataGroup];
    },
    getUsersWidgetColumns() {
      return this.userWidgetColumns;
    },
    updateDataTimestamp() {
      let currentDate = new Date();
      db.collection("User").doc("Updates").update({
        lastDataUpdate: currentDate
      });
    },
    userSetup() {
      this.getUserData().then(() => {
        let requirePropertySetup = false;
        let dataObject = {};

        let filteredWidgets = Object.filter(
          this.widgets,
          (widget) => widget.requiresSetup
        );
        for (const widget in filteredWidgets) {
          if (
            filteredWidgets[widget].data === undefined ||
            filteredWidgets[widget].data.length === 0
          ) {
            let property = filteredWidgets[widget].property;
            dataObject[property] = filteredWidgets[widget].defaultOptions;

            requirePropertySetup = true;
          }
        }
        if (requirePropertySetup) {
          this.setupUserData(dataObject);
        }
      });
    },
    setupUserData(dataObject) {
      const dc = this;
      db.collection("User")
        .doc("Settings")
        .update(dataObject)
        .then(() => {
          console.log("Successfully setup Users Data");
          dc.getUserData();
        })
        .catch((error) => {
          console.log("Failed to setup Users data - Error: " + error);
        });
    },
    setupUserWidget(widget) {
      db.collection("User")
        .doc("Settings")
        .update({
          [widget.type]: widget.defaultOptions
        })
        .then(() => {
          console.log("Successfully setup Users " + widget.type);
        })
        .catch((error) => {
          console.log(
            "Failed to setup Users " + widget.type + " - Error: " + error
          );
        });
    }
  }
}); //For Event bus communications

new Vue({
  router,
  render: function (h) {
    return h(App);
  }
}).$mount("#app");
