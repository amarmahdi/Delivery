<template>
  <v-app>
    <navbar />
    <v-container>
      <v-row>
        <v-card
          :loading="loading"
          class="mx-4 my-4"
          max-width="357"
          v-for="i in foods"
          :key="i"
        >
          <template slot="progress">
            <v-progress-linear
              color="deep-purple"
              height="10"
              indeterminate
            ></v-progress-linear>
          </template>

          <v-img
            height="250"
            src="https://cdn.vuetifyjs.com/images/cards/cooking.png"
          ></v-img>

          <v-card-title>{{ i.name }}</v-card-title>

          <v-card-text>
            <v-row align="center" class="mx-0">
              <v-rating
                :value="4.5"
                color="amber"
                dense
                half-increments
                readonly
                size="14"
              ></v-rating>
            </v-row>

            <div class="my-4 text-subtitle-1">$ • {{ i.price }}</div>

            <div>{{ i.desc }}.</div>
          </v-card-text>

          <v-divider class="mx-4"></v-divider>

          <v-card-title v-if="i.available">Available</v-card-title>
           <v-card-subtitle>when you are done adding to your cart click done</v-card-subtitle>  

          <v-card-actions>
            <v-btn color="deep-purple lighten-2" text @click="reserve(i)">
              Add to orders
            </v-btn>
            <v-spacer></v-spacer>
            <button type="submit" color="deep-purple lighten-2" text @click="addToCart">
              Done
            </button>
          </v-card-actions>
        </v-card>
      </v-row>
    </v-container>
  </v-app>
</template>
<script>
/* eslint-disable */
import Navbar from "../components/navBar.vue";
import axios from "axios";
import auth from "./../utils";

export default {
  components: {
    Navbar,
  },
  // eslint-disable
  data: () => ({
    loading: false,
    selection: 1,
    userId: null,
    foods: null,
    cart: [],
    cartObject: {
      userId: null,
      items: null,
      email: null
    }
  }),
  created() {
    if (!auth.authenticated()) {
      this.$router.push("/login");
    }
    var headers = {
      token: localStorage.getItem("token"),
      "Content-Type": "text/plain",
    };
    axios
      .get(
        "http://127.0.0.1:4000/foods?userId=" +
          this.$router.app.$route.query.userId,
        { headers }
      )
      .then((data) => {
        this.foods = data.data;
        // console.log(this.foods)
      })
      .catch((e) => console.log(e));
  },
  methods: {
    reserve(index) {
      this.loading = true;
      setTimeout(() => (this.loading = false), 2000);
      this.cart.push(index.name)
      // localStorage.setItem('items', this.cart)
      console.log(this.cart)
    },
    addToCart(e){
      e.preventDefault()
      var headers = {
        'Content-Type': 'text/plain;charset=utf-8'
      };
      this.cartObject.userId = this.$router.app.$route.query.userId
      this.cartObject.email = localStorage.getItem('userEmail')
      this.cartObject.items = this.cart
      axios.post("http://127.0.0.1:4000/cart", this.cartObject,{headers}).then((data)=>{
        console.log(data.data)
        this.$router.push('/cart')
      }).catch(e=>console.log(e))
      
    }
  },
};
</script>
