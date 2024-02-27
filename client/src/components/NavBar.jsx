import React, { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../main";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "../css/main.css";
import { Button, Col, Row } from "react-bootstrap";
import {
  ADMINPAGE_ROUTE,
  BASKET_ROUTE,
  MAIN_ROUTE,
  SHOP_ROUTE,
  MODERPAGE_ROUTE,
  SALES_ROUTE,
  NEW_ROUTE,
  USER_ROUTE,
} from "../utils/consts";
import { LOGIN_ROUTE } from "../utils/consts";
import { useNavigate } from "react-router-dom";
import { login } from "../http/userAPI";
import { fetchOrderByUser } from "../http/productAPI";
const NavBar = observer(() => {
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [hasPendingOrders, setHasPendingOrders] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (user.id) {
          // Используйте id из параметров, а не из контекста пользователя
          const prod = await fetchOrderByUser(user.id);
          setOrders(prod);
          if (prod) {
            const pendingOrderExists = prod.some(
              (order) => order.status === "Ожидает оплаты"
            );
            setHasPendingOrders(pendingOrderExists);
          }
        }
      } catch (error) {
        console.log("Ошибка получения товаров пользователя:", error.message);
      }
    };
    fetchOrder();
  }, [user.id]);

  const logOutUser = () => {
    localStorage.removeItem("token");
    const loginGuest = async () => {
      try {
        login("guest", "guest");
      } catch (error) {
        alert("Error :", error.message);
      }
    };
    user.setUser(false);
    user.setIsAuth(false);
    user.setRole("");
    user.setIdUser("");

    navigate(MAIN_ROUTE);
    loginGuest();
  };

  return (
    <Navbar
      style={{ background: "white", fontFamily: "Roboto Slab, serif" }}
      expand="md"
    >
      <Container>
        <Navbar.Brand
          onClick={() => navigate(MAIN_ROUTE)}
          style={{
            fontSize: "30px",
            fontWeight: "700",
            textTransform: "uppercase",
            color: "#000",
          }}
          href={MAIN_ROUTE}
        >
          Album.by
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link className="navlink" href={SHOP_ROUTE}>
              SHOP
            </Nav.Link>
            <Nav.Link className="navlink" href={SALES_ROUTE}>
              SALES
            </Nav.Link>
            <Nav.Link className="navlink" href={NEW_ROUTE}>
              NEW
            </Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            {user.isAuth ? (
              <Nav className="ml-auto" style={{ color: "white" }}>
                {user.role === "ADMIN" ? (
                  <Button
                    variant={"outline-light"}
                    onClick={() => navigate(ADMINPAGE_ROUTE)}
                    className="but"
                  >
                    Admin panel
                  </Button>
                ) : user.role === "MODERATOR" ? (
                  <Button
                    variant={"outline-light"}
                    onClick={() => navigate(MODERPAGE_ROUTE)}
                    className="but"
                  >
                    Moderator panel
                  </Button>
                ) : (
                  <Row>
                    <Col>
                      <Button
                        className="but"
                        variant={"outline-light"}
                        onClick={() => navigate(BASKET_ROUTE)}
                      >
                        Cart
                      </Button>
                    </Col>
                    <Col>
                      <Button
                        className="but parrent"
                        variant={"outline-light"}
                        onClick={() => navigate(USER_ROUTE)}
                      >
                        My page{" "}
                        {hasPendingOrders && (
                          <span className="notification-circle"></span>
                        )}
                      </Button>
                    </Col>
                  </Row>
                )}
                <Row>
                  <Col>
                    <Button
                      className="but"
                      variant={"outline-light"}
                      onClick={() => logOutUser()}
                    >
                      Log out
                    </Button>
                  </Col>
                </Row>
              </Nav>
            ) : (
              <Nav className="ml-auto" style={{ color: "white" }}>
                <Button
                  className="but "
                  variant={"outline-light"}
                  onClick={() => navigate(LOGIN_ROUTE)}
                >
                  Log in
                </Button>
              </Nav>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
});

export default NavBar;
