// src/App.jsx
import { useEffect, useState } from "react";
import Router from "./router/Router";
import publicRoutes from "./router/routes/publicRoutes";
import { getRoutes } from "./router/routes";
import { useDispatch, useSelector } from "react-redux";
import { get_user_info } from "./store/Reducers/authReducer";

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  // התחל עם publicRoutes כדי שהאפליקציה לא תהיה ריקה לפני טעינת הנתיבים
  const [allRoutes, setAllRoutes] = useState([...publicRoutes]);

  // 1. אחרי שהקומפוננטה נטענת, מוסיפים את הנתיב הראשי (root) שמגיע מ-getRoutes
  useEffect(() => {
    setAllRoutes((prev) => {
      const rootRoute = getRoutes();
      return [...prev, rootRoute];
    });
  }, []);

  // 2. אם יש token – נבדוק מול השרת האם המשתמש מחובר באמת
  useEffect(() => {
    if (token) {
      dispatch(get_user_info());
    }
  }, [token, dispatch]);

  return <Router allRoutes={allRoutes} />;
}

export default App;
