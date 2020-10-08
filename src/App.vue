<template>
  <div id="app" @click="bodyClicked">
    <nav-bar></nav-bar>
    <router-view/>
  </div>
</template>

<script>
import NavBar from './components/NavBar'

import { global } from './main'

export default {
  components: {
    NavBar
  },
  methods: {
    bodyClicked(event) {
      global.$emit('app-body-clicked', event)
    }
  }
}
</script>

<style>
html,body,#app{
  height: 100%;
}
</style>
