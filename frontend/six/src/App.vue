<template>
  <div id="nav" class="bg-gray-900 w-full h-screen relative">
    <div
      class="
        navbar
        mb-2
        shadow-lg
        bg-neutral
        text-neutral-content
        fixed
        w-full
        z-50
      "
    >
      <div class="flex-1 hidden px-2 mx-2 lg:flex navbar-start">
        <span class="text-lg font-bold"> DeliveryApp </span>
      </div>

      <div class="hidden navbar-center lg:flex pl-40">
        <div class="flex items-stretch">
          <router-link to="/" class="btn btn-ghost btn-sm rounded-btn"
            >Home</router-link
          >
          <router-link to="/login" v-if="!$store.state.isUserLoggedIn" class="btn btn-ghost btn-sm rounded-btn"
            >Log-In</router-link
          >
          <router-link to="/register" v-if="!$store.state.isUserLoggedIn" class="btn btn-ghost btn-sm rounded-btn"
            >Register</router-link
          >
          <router-link v-if="$store.state.isUserLoggedIn" to="/dashboard" class="btn btn-ghost btn-sm rounded-btn"
            >Dashboard</router-link
          >
        </div>
      </div>
      <div class="flex-1 navbar-end">
        <div class="form-control">
          <input type="text" placeholder="Search" class="input input-ghost" />
        </div>
      </div>

      <div class="flex-none">
        <button class="btn btn-square btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="inline-block w-6 h-6 stroke-current"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </button>
      </div>
      <div v-if="$store.state.isUserLoggedIn" class="flex-none">
        <button @click="ToCart" class="btn btn-square btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="inline-block w-6 h-6 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="{2}"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </button>
      </div>
      <div class="dropdown dropdown-end rounded-full" v-if="$store.state.isUserLoggedIn" >
        <div tabindex="0" class="m-1 btn rounded-full hover:bg-transparent border-0">
          <div class="flex-none">
            <div class="avatar">
              <div class="rounded-full w-10 h-10 m-1">
                <img src="https://i.pravatar.cc/500?img=32" />
              </div>
            </div>
          </div>
        </div>
        <ul
          tabindex="0"
          class="
            p-2
            shadow
            menu
            dropdown-content
            bg-base-100
            rounded-box
            w-52
            mt-48
            text-black
          "
        >
          <li>
            <router-link to="/profile">Profile</router-link>
          </li>
          <li>
            <router-link to="/settings">Settings</router-link>
          </li>
        </ul>
      </div>
    </div>
    <router-view />
  </div>
</template>
<script>
// import { Icon } from "@iconify/vue";

export default {
  components: {
    // Icon,
  },
  methods: {
    ToCart(){
      this.$router.push('/cart')
      // console.log('hey there')
    }
  }
};
</script>
