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

library.add(faTrash);

Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false;
Vue.use(BootstrapVue);

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
          default: "Assign to Project",
          static: true
        },
        title: {
          type: "appTitle",
          header: "Title",
          slug: "title",
          default: "no title",
          static: true
        },
        text: {
          type: "appText",
          header: "Text",
          slug: "text",
          default: "no text",
          static: false
        },
        number: {
          type: "appNumber",
          header: "Number",
          slug: "number",
          default: 0,
          static: false
        },
        status: {
          type: "appStatus",
          header: "Status",
          slug: "status",
          default: 0,
          static: false,
          defaultOptions: ["In Progress", "Problem", "Done"]
        }
      },
      userData: Object,
      userProjects: Array,
      userStatusGroup: Array,
      userWidgetColumns: Array
    };
  },
  methods: {
    mapFirebaseResults(doc) {
      return { id: doc.id, ...doc.data() };
    },
    getUserData() {
      db.collection("User")
        .doc("Settings")
        .get()
        .then((snapshot) => {
          console.log("Successfully got user data");
          this.userData = snapshot.data();
          this.userProjects = this.userData.projects;
          this.userStatusGroup = this.userData.statusGroup;
          this.userWidgetColumns = this.userData.widgetColumns;
          global.$emit("got-user-data");
        })
        .catch((error) => {
          console.log("Error getting document ", error);
        });
    },
    getUsersProjects() {
      return this.userProjects;
    },
    getUsersStatusGroup() {
      //TODO: Database
      return this.userStatusGroup;
    },
    getUsersWidgetColumns() {
      return this.userWidgetColumns;
      // return [
      //   { type: 'title', id: '000000' },
      //   { type: 'text', id: '000001' },
      //   { type: 'number', id: '000002' },
      //   { type: 'status', id: '000003' }
      // ]
    }
  }
}); //For Event bus communications

new Vue({
  router,
  render: function (h) {
    return h(App);
  }
}).$mount("#app");
