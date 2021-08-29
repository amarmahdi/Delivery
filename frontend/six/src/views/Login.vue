<template>
  <div>
    <div class="hero min-h-screen bg-base-200">
      <div class="flex-col justify-center hero-content lg:flex-row">
        <div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <div class="card-body">
            <form>
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Email</span>
                </label>
                <input
                  type="text"
                  placeholder="email"
                  class="input input-bordered"
                  v-model="email"
                />
              </div>
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Password</span>
                </label>
                <input
                  type="text"
                  placeholder="password"
                  class="input input-bordered"
                  v-model="password"
                />
                <label class="label">
                  <a href="#" class="label-text-alt">Forgot password?</a>
                </label>
              </div>
              <div class="form-control mt-6">
                <button @click="login" type="button" value="Login" class="btn btn-primary">Login</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Authentication from "./../services/Authentication";

export default {

  created(){
    if(this.$store.state.isUserLoggedIn){
      this.$router.push('/dashboard')
    }
  },

  data() {
    return {
      email: "",
      password: "",
      error: null,
    };
  },

  methods: {
    async login(e) {
      e.preventDefault();
      try {
        const response = await Authentication.login({
          'email': this.email,
          'password': this.password
        });
        console.log(response.data)
        this.$store.dispatch('setToken', response.data.token)
        this.$store.dispatch('setUser', response.data.data.email)
        // console.log(this.email)
      } catch (error) {
        this.error = error
        console.log(this.error)
      }
    },
  },
};
</script>
