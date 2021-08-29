<template>
  <v-main>
    <nav-bar/>
    <parallox/>
  </v-main>
</template>

<script>

import NavBar from '../components/navBar.vue'
import parallox from '../components/parallox.vue'
export default {
  components: {
    NavBar,
    parallox
  },
  created () {
    console.log(localStorage)
  },
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data () {
    return {
      HeaderText: 'Hello World!!!'
    }
  }

}
</script>
