import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  withCredentials: true
});


api.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if it's a token expiry error
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        await axios.post("http://127.0.0.1:5000/users/auth/token-refresh", {}, {
          withCredentials: true,
          headers: {
            "X-CSRF-TOKEN": Cookies.get('csrf_refresh_token'),
            
          },
        });

        // Set the new csrf access token to the original request
        originalRequest.headers['X-CSRF-TOKEN'] = Cookies.get('csrf_access_token');
        return api(originalRequest);
      } catch (error) {
        // This means the session expired, we ask the user that the session expired 
        // TODO: popup alert saying the session exired, user press anything -> logout
        
        localStorage.removeItem("userProfile");
        window.location.reload();
        throw refreshError;
      }
    }

    // For all other errors, reject the promise
    return Promise.reject(error);
  }
);

export default api;
