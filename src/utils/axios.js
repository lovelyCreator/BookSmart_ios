import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://booksmart-backend-rcxk.onrender.com',
  // baseURL: 'http://192.168.0.115:5000',
  headers: {
    'Content-Type': 'application/json',
    "ngrok-skip-browser-warning": "true"
  },
})

export default instance;
