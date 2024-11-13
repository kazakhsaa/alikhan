import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5001/api',
  withCredentials: false, // Если используете cookies, установите true
});

export default instance;
