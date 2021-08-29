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
        </v-card>
      </v-row>
      <v-card class="mx-auto" max-width="344" outlined>
        <v-list-item three-line>
          <v-list-item-content>
            <div class="text-overline mb-4">$ {{ totalPrice }}</div>
            <v-list-item-title class="text-h5 mb-1"> Order </v-list-item-title>
            <v-list-item-subtitle>Order now and enjoy</v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-avatar tile size="80" color="grey"></v-list-item-avatar>
        </v-list-item>

        <v-card-actions>
          <v-btn
            outlined
            rounded
            text
            color="success"
            type="submit"
            @click="order"
          >
            Order Now
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-app>
</template>
<script>
import Navbar from "../components/navBar.vue";
import axios from "axios";
import auth from "./../utils";

export default {
  components: {
    Navbar,
  },
  // eslint-disable-next-line no-dupe-keys
  data: () => ({
    loading: false,
    selection: 1,
    userId: null,
    foods: null,
    totalPrice: null,
    cartObject: {
      cartId: null,
      userId: null,
      userEmail: null,
    },
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
        "http://127.0.0.1:4000/cart?userId=" +
          this.$router.app.$route.query.userId,
        { headers }
      )
      .then((data) => {
        this.totalPrice =
          data.data.items[data.data.items.length - 1].totalPrice;
        console.log(this.totalPrice);
        this.foods = data.data.items;
        this.foods.pop();
        this.cartObject.userId = data.data.userId,
        this.cartObject.cartId = data.data.cartId,
        this.cartObject.userEmail = data.data.userEmail
      })
      .catch((e) => console.log(e));
  },
  methods: {
    reserve() {
      this.loading = true;
      setTimeout(() => (this.loading = false), 2000);
    },
    order(e) {
      e.preventDefault();
      var headers = {
        "Content-Type": "text/plain;charset=utf-8",
      };
      axios
        .post("http://127.0.0.1:4000/order?userId=" +
          this.$router.app.$route.query.userId, this.cartObject, { headers })
        .then((data) => {
          console.log(data.data);
          this.$router.push("/order?userId="+this.$router.app.$route.query.userId);
        })
        .catch((e) => console.log(e));
    },
  },
};
</script>
