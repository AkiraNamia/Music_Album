import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { fetchOrderByUser } from "../http/productAPI";
import { changeOrderStatus } from "../http/userAPI";
const OrderHistory = observer(({ id, isNow }) => {
  const [orders, setOrders] = useState([]);
  console.log(id);
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (id) {
          // Используйте id из параметров, а не из контекста пользователя
          const prod = await fetchOrderByUser(id);
          setOrders(prod);
        }
      } catch (error) {
        console.error("Ошибка получения товаров пользователя:", error.message);
      }
    };
    fetchOrder();
  }, [id]); // Добавьте id в зависимости, чтобы useEffect вызывался при его изменении

  console.log(orders);
  const confirmOrder = async (orderId) => {
    const formData = new FormData();
    try {
      formData.append("newStatus", "Заказ оплачен");
      changeOrderStatus(orderId, formData);
      const updatedOrders = orders.map((order) => {
        if (order.id === orderId) {
          return { ...order, status: "Заказ оплачен" };
        }
        return order;
      });
      setOrders(updatedOrders);
    } catch (error) {
      console.error("Ошибка при обновлении статуса заказа:", error);
    }
  };
  return (
    <Container>
      {orders && orders.length > 0 ? (
        orders
          .sort((a, b) => a.id - b.id)
          .map((ord) => (
            <Row
              key={ord.id}
              style={{
                background: "black",
                color: "white",
                marginBottom: "20px",
              }}
            >
              {isNow && ord.status !== "Принят клиентом" && (
                <Col>
                  <p>Заказ № {ord.id}</p>
                  {ord?.info.map((info) => (
                    <p>
                      {info.country},
                      {info.countryRegion ? info.countryRegion : " "},
                      {info.city},{info.address},{info.zipCode}
                    </p>
                  ))}
                  {ord.albums?.map((album) => (
                    <Container
                      style={{
                        margin: "10px",
                        background: "black",
                        color: "white",
                      }}
                      key={album.id}
                    >
                      <Row>
                        <Col md={3}>
                          <Card.Img
                            variant="top"
                            src={"http://localhost:5000/" + album.img}
                          />
                        </Col>
                        <Col md={6}>
                          <Container>
                            <h5>{album.title}</h5>
                            <p>{album.artist.name}</p>
                            <p>Price: {album.price}</p>
                            <p>Quantity: {album.order_product.number}</p>
                          </Container>
                        </Col>
                      </Row>
                    </Container>
                  ))}
                  <hr className="hr"></hr>
                  <p>Total quantity: {ord.totalAmount}$</p>
                  <p>Payment type: {ord.paymentType}</p>
                  <p>Status: {ord.status}</p>
                  {ord.status === "Ожидает оплаты" && (
                    <Button
                      className="but"
                      onClick={() => confirmOrder(ord.id)}
                    >
                      Оплатить
                    </Button>
                  )}
                </Col>
              )}
              {!isNow && ord.status === "Принят клиентом" && (
                <Col>
                  <p>Заказ № {ord.id}</p>
                  {ord?.info.map((info) => (
                    <p>
                      {info.country},
                      {info.countryRegion ? info.countryRegion : " "},
                      {info.city},{info.address},{info.zipCode}
                    </p>
                  ))}
                  {ord.albums?.map((album) => (
                    <Container
                      style={{
                        margin: "10px",
                        background: "black",
                        color: "white",
                      }}
                      key={album.id}
                    >
                      <Row>
                        <Col md={3}>
                          <Card.Img
                            variant="top"
                            src={"http://localhost:5000/" + album.img}
                          />
                        </Col>
                        <Col md={6}>
                          <Container>
                            <h5>{album.title}</h5>
                            <p>{album.artist.name}</p>
                            <p>Price: {album.price}</p>
                            <p>Quantity: {album.order_product.number}</p>
                          </Container>
                        </Col>
                      </Row>
                    </Container>
                  ))}
                  <hr className="hr"></hr>
                  <p>Total quantity: {ord.totalAmount}$</p>
                  <p>Payment type: {ord.paymentType}</p>
                  <p>Status: {ord.status}</p>
                  {ord.status === "Ожидает оплаты" && (
                    <Button
                      className="but"
                      onClick={() => confirmOrder(ord.id)}
                    >
                      Оплатить
                    </Button>
                  )}
                </Col>
              )}
            </Row>
          ))
      ) : (
        <Col style={{ background: "black", color: "white" }}>
          <p>Заказов нет</p>
        </Col>
      )}
    </Container>
  );
});

export default OrderHistory;
