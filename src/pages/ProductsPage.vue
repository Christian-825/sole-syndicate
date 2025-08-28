<script>
    //In Composition API, there are two ways of creating "reactive states".
    //We can use reactive() method to return a reactive state. The reactive() object is used better for objects.
    //ref() also creates a reactive, trackable data within the component but is preferably used for primitive data types.

    //import both ref and reactive methods from vue
    //onMounted() can be used to run a function when the component is mounted.
    import { ref, reactive, onMounted, onBeforeMount, watch } from 'vue';
    import ProductComponent from '../components/ProductComponent.vue';
    
    import api from '../api';
    import UserView from '../components/UserView.vue';
    import AdminView from '../components/AdminView.vue';

    import { useGlobalStore } from '../stores/global.js';

    export default {
        components: {
            ProductComponent,
            UserView,
            AdminView,
        },

        /* 
          The setup() method was introduced in Vue 3 as part of the Composition API. 
          It allows developers to create reusable logic in their components. 
          It is called once, before the component is mounted and returns an object 
          containing the data, methods and other reactive elements that the component needs. 
        */
        setup() {
            const { user } = useGlobalStore();
            const products = reactive({ data: [] });

            /*onBeforeMount(async () => {
                let { data } = await api.get('/products');
                products.data = data;
            })*/

            watch([user], async () => {
                if (user.isLoading === false) {
                    if (user.isAdmin) {
                        let { data } = await api.get('/products/all');
                        products.data = data;
                    } else {
                        let { data } = await api.get('/products');
                        console.log(data);
                        products.data = data;
                    }
                }
            }, { immediate: true });

            return {
                products,
                user
            };
        }
    }
</script>

<template>
    <div class="container">
        <p v-if="user.isLoading">Loading...</p>
        <AdminView v-if="user.isAdmin && !user.isLoading" :productsData="products.data" />
        <UserView v-if="!user.isAdmin && !user.isLoading" :productsData="products.data" />
    </div>
</template>
