import "./assets/main.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import "notyf/notyf.min.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import HomePage from "./pages/HomePage.vue";

import RegisterPage from "./pages/RegisterPage.vue";
import LoginPage from "./pages/LoginPage.vue";
import LogoutPage from "./pages/LogoutPage.vue";

import ProductsPage from "./pages/ProductsPage.vue";
import ProductsCatalog from "./pages/ProductsCatalog.vue";
import ProductDetails from "./pages/ProductDetails.vue";

import ErrorPage from "./pages/ErrorPage.vue";
import ProfilePage from "./pages/ProfilePage.vue";
import AddProduct from "./pages/AddProduct.vue";
import UpdateProduct from "./pages/UpdateProduct.vue";

import CartPage from "./pages/CartPage.vue";
import CheckoutPage from "./pages/CheckoutPage.vue";
import OrdersPage from "./pages/OrdersPage.vue";

import { createRouter, createWebHistory } from "vue-router";
import AdminOrdersPage from "./pages/AdminOrdersPage.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomePage,
    },

    {
      path: "/register",
      name: "Register",
      component: RegisterPage,
    },
    {
      path: "/login",
      name: "Login",
      component: LoginPage,
    },
    {
      path: "/logout",
      name: "Logout",
      component: LogoutPage,
    },
    {
      path: "/adminDashboard",
      name: "Products",
      component: ProductsPage,
    },
    {
      path: "/productsCatalog",
      name: "ProductsCatalog",
      component: ProductsCatalog,
    },
    {
      path: "/productsCatalog/:id",
      name: "ProductDetails",
      component: ProductDetails,
    },
    {
      path: "/profile",
      name: "Profile",
      component: ProfilePage,
    },
    {
      path: "/addProduct",
      name: "AddProduct",
      component: AddProduct,
    },
    {
      path: "/updateProduct/:productId",
      name: "UpdateProduct",
      component: UpdateProduct,
    },
    {
      path: "/cart",
      name: "Cart",
      component: CartPage,
    },
    {
      path: "/checkout",
      name: "Checkout",
      component: CheckoutPage,
    },
    {
      path: "/orders",
      name: "Orders",
      component: OrdersPage,
    },
    {
      path: "/admin/orders",
      name: "AdminOrders",
      component: AdminOrdersPage,
    },
    {
      path: "/:catchAll(.*)",
      component: ErrorPage,
    },
  ],
});

/* 
    - Every Vue application starts by creating a new application instance with the createApp function.
    - We then pass the App component into the createApp method. 
    - The App component is a "root component" that can contain other components as its children.    
    - The mount() method is used to render/inject the root component into the selected element from the DOM by its id.
*/
const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount("#app");
