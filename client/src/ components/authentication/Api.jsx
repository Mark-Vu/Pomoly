import React from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  withCredentials: true,
  baseURL:"http://127.0.0.1:5000",
  // baseURL:"https://studyhub-backend.vercel.app"                         
});


api.interceptors.request.use((config) => {
  const csrfToken = Cookies.get('csrf_access_token');
  if (csrfToken) {
    config.headers['X-CSRF-TOKEN'] = csrfToken;
  }

  return config;
})


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
        await api.post("/users/auth/token-refresh", {}, {
          withCredentials: true,
          headers: {
            "X-CSRF-TOKEN": Cookies.get('csrf_refresh_token'),
          },
        });

        // Set the new csrf access token to the all the requests
        const newAccessToken = Cookies.get('csrf_access_token');
        originalRequest.headers['X-CSRF-TOKEN'] = newAccessToken;
        api.defaults.headers['X-CSRF-TOKEN'] = newAccessToken;
        return api(originalRequest);
      } catch (error) {
        // If the original request FAIL AGAIN -> session expired
        // TODO: popup alert saying the session exired, user press anything -> logout  
        // Right now these two function below need more testing, so cant be pushed 
        // localStorage.removeItem("userProfile");
        // window.location.reload();
        console.log(error)
      }
    }

    return Promise.reject(error);
  }
);

export default api;
