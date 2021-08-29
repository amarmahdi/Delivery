<template>
  <div>
    <v-app-bar dense dark height="70">
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-toolbar-title>Pizza Delivery</v-toolbar-title>

      <v-spacer></v-spacer>
      <v-btn to="/"> Home </v-btn>
      <v-btn to="/login" v-if="!authenticated"> LogIn </v-btn>
      <v-btn to="/signup" v-if="!authenticated"> SignUp </v-btn>
      <v-btn :to="'/dashbord?userId='+userId" v-if="authenticated"> Dashbord </v-btn>
      <v-btn :to="'/accountSettings?userId='+userId" v-if="authenticated"> Account Settings </v-btn>
      <v-btn :to="'/profile?userId='+userId" v-if="authenticated"> Profile </v-btn>
      <v-btn to="/logout"  v-if="authenticated"> Logout </v-btn>
      <v-btn :to="'/cart?userId='+userId"  v-if="authenticated"> Cart </v-btn>
    </v-app-bar>
  </div>
</template>
<script>
import auth from '../utils.js'
export default {
  data: () => ({
    drawer: false,
    group: null,
    authenticated: false,
    userId: null
  }),
  created () {
    if (auth.authenticated()) {
      this.authenticated = true
      this.userId = localStorage.getItem('userId')
    } else {
      this.authenticated = false
    }
  }
}
</script>
<style>
.li {
  list-style-type: none;
}
.li a {
  text-decoration: none;
  text-align: center;
  float: left;
  padding: 12px;
  color: white;
}
</style>
