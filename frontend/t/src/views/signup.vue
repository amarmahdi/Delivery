<template>
  <v-app>
    <navbar />
    <v-card class="mx-auto my-12" width="500" outlined>
      <v-form
        ref="form"
        method="post"
        @submit="registerUser"
        v-model="valid"
        lazy-validation
        style="padding: 20px"
      >
        <v-text-field
          v-model="posts.name"
          :counter="100"
          :rules="nameRules"
          label="Name"
          required
        ></v-text-field>

        <v-text-field
          v-model="posts.email"
          :rules="emailRules"
          label="E-mail"
          required
        ></v-text-field>

        <v-text-field
          v-model="posts.phone"
          label="Phone"
          required
        ></v-text-field>

        <v-text-field
          v-model="posts.password"
          label="Password"
          required
        ></v-text-field>

        <v-text-field
          v-model="posts.streetAddress"
          label="Address"
          required
        ></v-text-field>

        <v-btn color="success" class="mr-4" type="submit"> Sign Up </v-btn>
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
    posts: {
      name: null,
      email: null,
      password: null,
      phone: null,
      streetAddress: null
    },
    token: null,
    userId: null,
    valid: true,
    name: '',
    nameRules: [
      (v) => !!v || 'Name is required',
      (v) => (v && v.length <= 100) || 'Name must be less than 10 characters'
    ],
    email: '',
    emailRules: [
      (v) => !!v || 'E-mail is required',
      (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid'
    ],
    password: '',
    phone: '',
    stAddress: ''
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
    registerUser (e) {
      e.preventDefault()
      var headers = {
        'Content-Type': 'text/plain;charset=utf-8'
      }
      axios
        .post('http://localhost:4000/users', this.posts, { headers })
        .then((data) => {
          console.log(data)
          this.userId = data.data.userId
          var tokenObject = {
            'userEmail': this.posts.email,
            'password': this.posts.password
          }
          axios
            .post('http://localhost:4000/token', tokenObject, { headers })
            .then((data) => {
              localStorage.setItem('token', data.data.token)
              this.$router.push('/dashbord')
              console.log(data)
            })
        })
        .catch((e) => console.log(e))
      console.log('success')
    }
  }
  // mounted(){
  //   console.log(this.posts)
  // }
}
</script>
