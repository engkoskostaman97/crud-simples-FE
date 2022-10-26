import { useContext, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { UserContext } from "./context/userContext";

import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Addstudent from "./pages/Addstudent";
import Updatestudent from "./pages/Updatestudent";

import { API, setAuthToken } from "./config/api";



// init token on axios every time the app is refreshed
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  let navigate = useNavigate();
  const [state, dispatch] = useContext(UserContext);
  console.clear();
  console.log(state);
  useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
  }, [state]);

  const checkUser = async () => {
    try {
      const response = await API.get("/check-auth");

      console.log(response);

      // If the token incorrect
      if (response.status === 404) {
        return dispatch({
          type: "AUTH_ERROR",
        });
      }

      // Get user data
      let payload = response.data.data;
      // Get token from local storage
      payload.token = localStorage.token;

      // Send data to useContext
      dispatch({
        type: "USER_SUCCESS",
        payload,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (localStorage.token) {
      checkUser();
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/addstudents" element={<Addstudent />} />
      <Route path="/updatestudents/:id" element={<Updatestudent />} />
    </Routes>
  );
}

export default App;
