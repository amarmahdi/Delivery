<template>
  <div>
    <div class="hero min-h-screen bg-base-200">
      <div class="flex-col justify-center hero-content lg:flex-row w-1/2">
        <div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <div class="card-body">
            <form>
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Name"
                  class="input input-bordered"
                  v-model="name"
                />
              </div>
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Email</span>
                </label>
                <input
                  type="text"
                  placeholder="Email"
                  v-model="email"
                  class="input input-bordered"
                />
              </div>
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Phone</span>
                </label>
                <input
                  type="text"
                  placeholder="Phone"
                  v-model="phone"
                  class="input input-bordered"
                />
              </div>
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Address</span>
                </label>
                <input
                  type="text"
                  v-model="address"
                  placeholder="Address"
                  class="input input-bordered"
                />
              </div>
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Password</span>
                </label>
                <input
                  type="text"
                  v-model="password"
                  placeholder="password"
                  class="input input-bordered"
                />
                <label class="label">
                  <a href="#" class="label-text-alt">Forgot password?</a>
                </label>
              </div>
              <div class="form-control mt-6">
                <button
                  @click="register"
                  class="btn btn-primary"
                >
                Register...
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import { defineComponent } from '@vue/composition-api'
import Authentication from "./../services/Authentication";

export default {

  created(){
    console.log(this.$store.state)
    if(this.$store.state.isUserLoggedIn){
      this.$router.push('/dashboard')
    }
  },
  
  data(){
    return {
      email: "",
      name: '',
      phone: '',
      address: '',
      password: '',
      error: null
    }
  },

  methods: {
    async register(e){
      e.preventDefault()
      try {
        const response = await Authentication.register({
          'name': this.name,
          'email': this.email,
          'streetAddress': this.address,
          'phone': this.phone,
          'password': this.password
        })
        console.log(response)
        this.$store.dispatch('setToken', response.data.token)
      } catch (error) {
        this.error = error
        console.log(error)
      }
      // console.log(this.email, this.name, this.phone, this.address, this.password)
    }
  },

  mounted(){
    console.log(this.$store.state)
  },
};
</script>
