import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

export const connecter = axios.create(
    {
        baseURL : apiUrl,
        headers: {
            'Content-Type': 'application/json',
        },
    }
)
