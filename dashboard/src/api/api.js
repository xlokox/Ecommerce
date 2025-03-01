import axios from "axios";

// יצירת אינסטנס של axios עם ההגדרות הבסיסיות
const api = axios.create({
    baseURL: 'http://localhost:5001/api', // שנה לפורט של השרת שלך
    withCredentials: true, // שולח cookies עם הבקשות
});

// פונקציה להוספת טוקן לכל הבקשות כברירת מחדל
export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common["Authorization"];
    }
};

// קבלת הטוקן מה-localStorage והגדרתו כברירת מחדל
const token = localStorage.getItem("token");
setAuthToken(token);

export default api;
