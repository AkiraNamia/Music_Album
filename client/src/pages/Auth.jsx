import { Container, Form } from "react-bootstrap";
import React, { useContext, useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LOGIN_ROUTE,
  REGISTRATION_ROUTE,
  ADMINPAGE_ROUTE,
  MODERPAGE_ROUTE,
  MAIN_ROUTE,
} from "../utils/consts";
import { login, registration } from "../http/userAPI";
import { observer } from "mobx-react-lite";
import { Context } from "../main";
import "../css/main.css";

const Auth = observer(() => {
  const { user } = useContext(Context);
  const location = useLocation();
  const navigation = useNavigate();
  const isLogin = location.pathname === LOGIN_ROUTE;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setpasswordTouched] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);

  const click = async () => {
    try {
      let data;
      if (isLogin) {
        data = await login(email, password);
        if (data.role === "ADMIN") {
          user.setUser(user);
          user.setIsAuth(true);
          user.setRole(data.role);
          user.setIdUser(data.id);
          navigation(ADMINPAGE_ROUTE);
        }
        if (data.role === "USER") {
          user.setUser(user);
          user.setIsAuth(true);
          user.setRole(data.role);
          user.setIdUser(data.id);
          navigation(MAIN_ROUTE);
        }
        if (data.role === "MODERATOR") {
          user.setUser(user);
          user.setIsAuth(true);
          user.setRole(data.role);
          user.setIdUser(data.id);
          navigation(MODERPAGE_ROUTE);
        }
        if (data.role === "GUEST") {
          user.setUser(user);
          user.setIsAuth(false);
          user.setRole(data.role);
          user.setIdUser(data.id);
          navigation(MAIN_ROUTE);
        }
      } else {
        setpasswordTouched(true);
        setEmailTouched(true);
        if (!email.includes("@") || !email.includes(".")) {
          setEmailError("Please, enter a valid email");
          setEmailValid(false);
        } else {
          setEmailValid(true);
          setEmailError("");
        }

        if (password.length < 6) {
          setPasswordError("The password must contain at least 6 characters.");
          setPasswordValid(false);
        } else {
          setPasswordValid(true);
          setPasswordError("");
        }
        if (emailValid && passwordValid) {
          data = await registration(email, password);
          user.setUser(user);
          user.setIsAuth(true);
          user.setRole(data.role);
          user.setIdUser(data.id);
          navigation(MAIN_ROUTE);
        }
      }
      // await user.setUser(user);
      // await user.setIsAuth(true);
      // await user.setRole(data.role);
      // await user.setIdUser(data.id);
    } catch (e) {
      if (e.response && e.response.data && e.response.data.message) {
        alert(e.response.data.message);
      } else {
        alert("Error: " + e.message);
      }
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: window.innerHeight - 54 }}
    >
      <Card
        style={{ width: 600, background: "black", color: "white" }}
        className="p-5"
      >
        <h2 className="m-auto">{isLogin ? "Authorization" : "Registration"}</h2>
        <Form className="d-flex flex-column">
          <Form.Control
            className="mt-3"
            placeholder="Enter your email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <div className="error">{emailError}</div>}

          <Form.Control
            className="mt-3"
            placeholder="Enter your password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
          {passwordError && <div className="error">{passwordError}</div>}

          <Row className="d-flex justify-content-between mt-3 pl-3 pr-3">
            {isLogin ? (
              <div>
                Have no account?{" "}
                <NavLink to={REGISTRATION_ROUTE}>Register!</NavLink>
              </div>
            ) : (
              <div>
                Already have an account?{" "}
                <NavLink to={LOGIN_ROUTE}>Log in!</NavLink>
              </div>
            )}
            <Button className="but" variant={"outline-success"} onClick={click}>
              {isLogin ? "Log in" : "Register"}
            </Button>
          </Row>
        </Form>
      </Card>
    </Container>
  );
});

export default Auth;
