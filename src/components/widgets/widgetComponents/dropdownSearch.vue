<template>
  <div>
    <div class="dropdown-search" @click="dropdownOpen = true">
      {{ showDropdownValue(componentValue) }}
    </div>
    <div class="task-dropdown" v-if="dropdownOpen">
      <div class="list-group dropdown-search dropdown-list">
        <div class="wrapper">
          <button
            type="button"
            class="list-group-item list-group-item-action"
            v-for="(item, index) in dropdownList"
            :key="index"
            @click="updateSelectedValue(index)"
          >
            {{ item }}
          </button>
          <button
            type="button"
            class="list-group-item list-group-item-action disabled"
            disabled
            v-if="showEmptyLabel"
          >
            {{ emptySearchString }}
          </button>
        </div>
        <div class="list-add d-flex">
          <input
            type="text"
            class="list-add-input prevent-dropdown-close"
            v-model="inputValue"
            @input="searchForValue"
          />
          <button
            class="list-add-submit prevent-dropdown-close"
            @click="addItem"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { global } from "../../../main";
import db from "../../../firebase/init";
import firebase from "firebase";

export default {
  data() {
    return {
      emptySearchString: "Not in List",
      dropdownList: Array,
      dropdownOpen: false,
      inputValue: "",
      showEmptyLabel: false,
      userDataGroup: Array,
    };
  },
  props: {
    title: String,
    type: String,
    dataGroupName: String,
    dataGroup: Array,
    componentIndex: Number,
    componentValue: Number,
    updateComponentValueFn: Function,
  },
  updated() {
    if (this.dropdownList) {
      this.showEmptyLabel = this.dropdownList.length === 0;
    }
  },
  mounted() {
    this.userDataGroup = this.dataGroup;
    this.dropdownList = this.dataGroup;

    if (!this.userDataGroup) {
      this.userDataGroup = [`Set a ${this.title}`];
    }

    global.$on("app-body-clicked", (event) => {
      if (
        this.dropdownOpen &&
        !event.target.classList.contains("dropdown-search") &&
        !event.target.classList.contains("prevent-dropdown-close")
      ) {
        this.dropdownOpen = false;
      }
    });
  },
  methods: {
    showDropdownValue(value) {
      if (value < 0) {
        return `Select a ${this.title}`;
      } else {
        return this.userDataGroup[value];
      }
    },
    searchForValue() {
      let filteredList = this.userDataGroup.filter((item) => {
        return item.toLowerCase().includes(this.inputValue.toLowerCase());
      });
      this.dropdownList = filteredList;
    },
    addItem() {
      if (this.inputValue !== "") {
        if (this.userDataGroup.includes(this.inputValue.toLowerCase())) {
          //TODO Return error message: item already exists in list
          return;
        }

        const dc = this;
        db.collection("User")
          .doc("Settings")
          .update({
            [dc.dataGroupName]: firebase.firestore.FieldValue.arrayUnion(
              this.inputValue
            ),
          })
          .then(() => {
            console.log(`Successfully updated ${dc.dataGroupName}`);

            dc.userDataGroup.push(dc.inputValue);
            dc.dropdownList = dc.userDataGroup;
            dc.inputValue = "";
            dc.showEmptyLabel = false;

            global.updateDataTimestamp();
          })
          .catch((error) => {
            console.log(`Error updating ${dc.dataGroupName}: ` + error);
          });
      }
    },
    updateSelectedValue(index) {
      this.updateComponentValueFn(this.componentIndex, this.type, index);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../../assets/stylingVariables.scss";

input {
  width: 80%;
}
.dropdown-list .wrapper {
  max-height: 320px;
  overflow: scroll;
}
.dropdown-search {
  &:hover {
    background-color: $grey;
  }
}
</style>