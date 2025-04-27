import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://phuctv.local:9999',
  timeout: 30000,
});

export default axiosClient;