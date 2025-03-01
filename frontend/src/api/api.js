import axios from "axios";
const local = 'http://localhost:5001'
const production = ''
const api = axios.create({
    baseURL : `${local}/api`
})

export default api

