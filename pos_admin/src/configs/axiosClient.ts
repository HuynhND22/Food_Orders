import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://server.aptech.io',
  timeout: 10000,
});

export default axiosClient;