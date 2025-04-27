import axios from 'axios';

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: 30000,
});
console.log('wethrnymht', process.env.REACT_APP_API_BASE_URL)

export default axiosClient;