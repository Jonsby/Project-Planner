<template>
  <div class="home">
    <app-tasks></app-tasks>
  </div>
</template>

<script>
// @ is an alias to /src
import Tasks from '@/components/Tasks.vue'

export default {
  name: 'Home',
  components: {
    appTasks: Tasks
  }
}
</script>
