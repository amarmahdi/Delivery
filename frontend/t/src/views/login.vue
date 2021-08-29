<template>
  <v-app>
    <navbar />
    <v-card class="mx-auto my-12" width="500" outlined>
      <v-form ref="form" @submit="loginUser" v-model="valid" lazy-validation style="padding: 20px">

        <v-text-field
          v-model="posts.email"
          label="E-mail"
          required
        ></v-text-field>

        <v-text-field
          v-model="posts.password"
          label="Password"
          required
        ></v-text-field>

        <v-btn
          color="success"
          class="mr-4"
          type="submit"
        >
          Log in
        </v-btn>
      </v-form>
    </v-card>
  </v-app>
</template>
<script>
import Navbar from '../components/navBar.vue'
import auth from '../utils.js'
import axios from 'axios'
export default {
  components: {
    Navbar
  },
  data: () => ({
    valid: true,
    posts: {
      email: null,
      password: null
    },
    name: '',
    nameRules: [
      (v) => !!v || 'Name is required',
      (v) => (v && v.length <= 10) || 'Name must be less than 10 characters'
    ],
    email: '',
    emailRules: [
      (v) => !!v || 'E-mail is required',
      (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid'
    ],
    select: null,
    items: ['Item 1', 'Item 2', 'Item 3', 'Item 4'],
    checkbox: false
  }),
  created () {
    if (auth.authenticated()) {
      this.$router.push('/dashbord')
    }
  },
  methods: {
    validate () {
      this.$refs.form.validate()
    },
    reset () {
      this.$refs.form.reset()
    },
    resetValidation () {
      this.$refs.form.resetValidation()
    },
    loginUser (e) {
      e.preventDefault()
      var headers = {
        'Content-Type': 'text/plain;charset=utf-8'
      }
      axios
        .post('http://localhost:4000/login', this.posts, { headers })
        .then((data) => {
          localStorage.setItem('token', data.data.token)
          localStorage.setItem('userEmail', data.data.userEmail)
          localStorage.setItem('userId', data.data.userId)
          console.log(localStorage)
          // console.log(data.data);
          this.$router.push('/dashbord?userId=' + data.data.userId)
        })
        .catch((e) => console.log(e))
    }
  }
}
</script>
