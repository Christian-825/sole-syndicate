<script setup>
    import { watch, ref, onBeforeMount } from 'vue';
    import { Notyf } from 'notyf';
    import { useGlobalStore } from '../stores/global';
    import { useRouter } from 'vue-router'
    import axios from 'axios';
    import api from '../api';

    const email = ref("");
    const password = ref("");
    const isEnabled = ref(false);

    const notyf = new Notyf();
    const {getUserDetails, user} = useGlobalStore();
    const router = useRouter();

    watch([email,password], (currentValue, oldValue) => {

        if(currentValue.every(input => input !== "")){
            isEnabled.value = true
        } else {
            isEnabled.value = false
        }
    });

    async function handleSubmit(e){
        e.preventDefault();

        try {

            /*let res = await axios({
                method: 'post',
                url: 'http://localhost:4000/users/login',
                data: {
                    email: email.value,
                    password: password.value
                }
            })*/

            let res = await api.post('users/login', {
                email: email.value,
                password: password.value
            })

            console.log(res)

            if(res.data){
                notyf.success("Login Successful");

                localStorage.setItem("token", res.data.access);

                getUserDetails(res.data.access)

                email.value = "";
                password.value = "";

                
                router.push({path: '/'})
            }

        } catch(err) {

            if(err.response.status === 404 || err.response.status === 401 || err.response.status === 400){
                notyf.error(err.response.data.message)
            } else {
                notyf.error("Login Failed. Please contact administrator")
            }
        }   
    }

    onBeforeMount(() => {
        if(user.token){
            router.push({path: '/products'})
        }
    })
</script>

<template>
  <div class="container-fluid">
    <div class="row d-flex justify-content-center mt-5"> <div class="col-md-4 border border-black rounded-3 mx-auto p-4 shadow-sm">
        <h3 class="mb-3 text-dark text-center fw-bold">Login</h3>
        <form @submit="handleSubmit">
          <div class="mb-3">
            <label for="emailInput" class="form-label">Email Address</label>
            <input type="email" class="form-control border border-black" id="emailInput" v-model="email" />
          </div>
          <div class="mb-3">
            <label for="passwordInput" class="form-label">Password</label>
            <input type="password" class="form-control border border-black" id="passwordInput" v-model="password" />
          </div>
          <div class="d-grid mt-4">
            <button
              type="submit"
              class="btn btn-dark btn-block"
              v-if="isEnabled"
            >
              Login
            </button>
            <button
              type="submit"
              class="btn btn-outline-dark btn-block"
              disabled
              v-else
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>