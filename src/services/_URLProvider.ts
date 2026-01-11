// dev = true, prod = false
const isDev = true; // Dev/Prod toggle

const baseURL = isDev ? "http://localhost:8000/api" : "https://job-application-tracker-api.onrender.com";

export default baseURL;