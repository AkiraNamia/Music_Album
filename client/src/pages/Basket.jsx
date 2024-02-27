import React, { useEffect, useContext, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { Context } from "../main.jsx";
import { fetchBasketProduct } from "../http/productAPI";
import BasketItem from "../components/BasketItem.jsx";
import CheckoutAccordion from "../components/CheckoutAccordion.jsx";
import OrderHistory from "../components/OrderHistory.jsx";
const Basket = observer(() => {
  const { user } = useContext(Context);
  const { order } = useContext(Context);
  const [basketProduct, setBasketProduct] = useState([]);
  console.log(user.id);

  useEffect(() => {
    const fetchProd = async () => {
      try {
        if (user.id) {
          const prod = await fetchBasketProduct(user.id);
          setBasketProduct(prod);
          console.log("Товары пользователя:", prod);
        } else {
          console.log("user.id не определён");
        }
      } catch (error) {
        console.error("Ошибка получения товаров пользователя:", error.message);
      }
    };
    fetchProd();
  }, [user.id]);

  const calculateTotal = () => {
    let total = 0;
    basketProduct.albums?.forEach((album) => {
      const price = album.price || 0;
      total += price * (album.basket_product?.number || 0);
    });
    return total;
  };

  const totalPrice = calculateTotal();
  order.setTotalAmount(totalPrice);

  return (
    <Container style={{ marginBottom: "150px" }}>
      <Row>
        {basketProduct.albums && basketProduct.albums.length > 0 ? (
          <Col style={{ background: "black", color: "white" }}>
            <Row>
              <Col>
                {basketProduct.albums?.map((album) => (
                  <Col key={album.id}>
                    <BasketItem album={album} />
                  </Col>
                ))}
              </Col>
            </Row>
            <Row>
              <p>Общая сумма заказа: {totalPrice}$</p>
            </Row>
          </Col>
        ) : (
          <Col style={{ background: "black", color: "white" }}>
            <p>Корзина пуста</p>
          </Col>
        )}
        <Col>
          {basketProduct.albums && basketProduct.albums.length > 0 ? (
            <CheckoutAccordion />
          ) : (
            <p>Чтобы оформить заказ, выберите нужный товар</p>
          )}{" "}
        </Col>
      </Row>
      <hr />
      <Row>
        <Container>OrderHistory</Container>
        <OrderHistory id={user.id} />
      </Row>
    </Container>
  );
});

export default Basket;
