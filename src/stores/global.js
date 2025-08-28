import { defineStore } from 'pinia';
import { reactive } from 'vue';
import api from '../api'; // axios instance

export const useGlobalStore = defineStore('global', () => {
  // ✅ Global reactive user state
  let user = reactive({
    token: localStorage.getItem('token'), // restore from localStorage
    name: null,         // ✅ added
    email: null,
    mobile: null,       // ✅ added
    isAdmin: null,
    isLoading: false
  });

  // ✅ Fetch user details using token
  async function getUserDetails(token) {
    if (!token) {
      // ✅ Clear state if no token
      user.token = null;
      user.name = null;       // ✅ added
      user.email = null;
      user.mobile = null;     // ✅ added
      user.isAdmin = null;
      return;
    }

    try {
      user.isLoading = true;

      // ✅ Request user details with Authorization header
      const { data } = await api.get('/users/details', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // ✅ Update global state
      user.token = token;
      user.name = data.name;       // ✅ added
      user.email = data.email;
      user.mobile = data.mobile;   // ✅ added
      user.isAdmin = data.isAdmin;
    } catch (error) {
      console.error('Failed to fetch user details:', error);

      // ✅ If token is invalid/expired, clear state
      user.token = null;
      user.name = null;       // ✅ added
      user.email = null;
      user.mobile = null;     // ✅ added
      user.isAdmin = null;
      localStorage.removeItem('token');
    } finally {
      user.isLoading = false;
    }
  }

  // ✅ Logout/reset method for convenience
  function resetUser() {
    localStorage.removeItem('token');
    user.token = null;
    user.name = null;       // ✅ added
    user.email = null;
    user.mobile = null;     // ✅ added
    user.isAdmin = null;
  }

  return {
    user,
    getUserDetails,
    resetUser
  };
});
