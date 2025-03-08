// src/App.jsx
import { useEffect, useState } from "react";
import Router from "./router/Router";
import { getRoutes } from "./router/routes";
import { useDispatch, useSelector } from "react-redux";
import { get_user_info } from "./store/Reducers/authReducer";

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  // במקום להתחיל עם publicRoutes, נשתמש במבנה הנתיבים שמתקבל מ-getRoutes ישירות
  const [allRoutes, setAllRoutes] = useState(null);

  useEffect(() => {
    const routes = getRoutes();
    setAllRoutes(routes);
  }, []);

  useEffect(() => {
    if (token) {
      dispatch(get_user_info());
    }
  }, [token, dispatch]);

  if (!allRoutes) {
    return <div>טוען נתיבים...</div>;
  }

  return <Router allRoutes={allRoutes} />;
}

export default App;
