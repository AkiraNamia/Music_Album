import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./components/AppRouter";
import { observer } from "mobx-react-lite";
import NavBar from "./components/NavBar";
import Bottom from "./components/Bottom";
import { check } from "./http/userAPI";
import { Context } from "./main";
import { Spinner } from "react-bootstrap";
import { login } from "./http/userAPI";

const App = observer(() => {
  const { user } = useContext(Context);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await check();
        if (data) {
          user.setUser(true);
          user.setIsAuth(true);
          user.setRole(data.role);
          user.setIdUser(data.id);

          if (user.role === "GUEST") {
            user.setIsAuth(false);
          }
        } else {
          await login("guest", "guest");
        }
      } catch (error) {
        console.error("Ошибка проверки токена:", error);
        await login("guest", "guest");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Spinner animation={"grow"} />;
  }
  return (
    <BrowserRouter>
      <NavBar />
      <AppRouter />
      <Bottom />
    </BrowserRouter>
  );
});

export default App;
