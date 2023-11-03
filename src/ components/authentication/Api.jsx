import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({});

// Add a response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
  
      // If the error status is 401 and there is no originalRequest._retry flag,
      // it means the token has expired and we need to refresh it
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
  
        try {
          await axios.post("http://127.0.0.1:5000/users/auth/token-refresh", {}, {
            withCredentials: true,
            credentials: 'same-origin',
            // Include csrf refresh token to receive new jwt tokens
            headers: {
              "X-CSRF-TOKEN": Cookies.get('csrf_refresh_token'),
            },
          });
          // Retry the original request with the new token
          return axios(originalRequest);
        } catch (error) {
          // Handle refresh token error or redirect to login
          console.error("Token refresh failed:", error);
          // unauthenticate user
          localStorage.removeItem("userProfile");

          // Reload the page
          window.location.reload();
          throw error;
        }
      }
  
      return Promise.reject(error);
    }
  );
  
export default api
