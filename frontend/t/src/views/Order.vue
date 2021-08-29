<template>
  <v-app>
    <navbar />
    <v-container>
      <v-row>
        <v-card class="mx-auto" width="500" outlined>
          <v-list-item three-line>
            <v-list-item-content>
              <div class="text-overline mb-4">$ {{ totalPrice }}</div>
              <v-list-item-title class="text-h5 mb-1">
                Order Items {{ orders }}
              </v-list-item-title>
              <v-list-item-subtitle>Pay </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-avatar
              tile
              size="80"
              color="grey"
            ></v-list-item-avatar>
          </v-list-item>
          <v-list-item>
            <v-text-field
              width="20"
              v-model="payloadObjects.creditCard"
              label="Credit Card Number"
              required
            ></v-text-field>

            <v-text-field
              v-model="payloadObjects.expMonth"
              label="Expiration Month"
              required
            ></v-text-field>

            <v-text-field
              v-model="payloadObjects.expYear"
              label="Expiration Year"
              required
            ></v-text-field>

            <v-text-field v-model="payloadObjects.cvc" label="CVC" required></v-text-field>
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
              Check out
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-row>
    </v-container>
  </v-app>
</template>
<script>
import Navbar from "../components/navBar.vue";
import axios from "axios";
import auth from "../utils";

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
    orders: null,
    payloadObjects: {
      expMonth: null,
      expYear: null,
      creditCard: null,
      cvc: null,
      email: null,
      orderId: null,
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
        this.orders = data.data.items.length;
        this.payloadObjects.email = data.data.userEmail
        console.log(data.data.userEmail);
      })
      .catch((e) => console.log(e));
    axios
      .get(
        "http://127.0.0.1:4000/order?userId=" +
          this.$router.app.$route.query.userId,
        { headers }
      )
      .then((data) => {
        console.log(data.data);
        this.payloadObjects.orderId = data.data.orderId
      })
      .catch((e) => console.log(e));
  },
  methods: {
    reserve() {
      this.loading = true;
      setTimeout(() => (this.loading = false), 2000);
    },
    order(e) {
      e.preventDefault()
      var headers = {
        'Content-Type': 'text/plain;charset=utf-8'
      };
      console.log(this.payloadObjects)
      axios.post("http://127.0.0.1:4000/pay?userId=" +
          this.$router.app.$route.query.userId, 
          this.payloadObjects,{headers}).then((data)=>{
        console.log(data.data)
        this.$router.push('/')
      }).catch(e=>console.log(e))
      // console.log(this.payloadObjects)
    },
  },
};
</script>
