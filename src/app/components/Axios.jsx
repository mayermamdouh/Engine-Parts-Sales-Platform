import axios from "axios";


const api = axios.create({
  baseURL: "http://localhost:3001", 
//   timeout: 10000, // Set timeout limit for requests (optional)
});

// Request interceptor to attach the token to each request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach the token to headers
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); // Handle request error
  }
);

// Response interceptor to handle token expiry and other errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized (401) errors, e.g., token expiry
      alert("Session expired. Please log in again.");
      localStorage.removeItem("token");
      localStorage.removeItem("isVerified");
      window.location.href = "/"; 
    } else {
      // Handle other types of errors
      console.error(
        "API Error:",
        error.response?.data.message || error.message
      );
    }
    return Promise.reject(error);
  }
);

export default api;
