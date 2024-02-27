import React from "react";
import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { observer } from "mobx-react-lite";
import { Button, Container } from "react-bootstrap";
import "../../css/albumTable.css";
import { changeOrderStatus, fetchOrders } from "../../http/userAPI";
import UpdateOrder from "./UpdateOrder";
import UpdateStatus from "./UpdateStatus";

const ModerTable = observer(() => {
  const [orders, setOrders] = useState([]);

  const [selectedOrder, setSelectedOrder] = useState(null); // Новое состояние
  const [orderEdVisible, setOrderEdVisible] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchOrders();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching albums:", error);
      }
    };

    fetchData();
    console.log(orders.length);
  }, [orders.length]);

  const handleRowClick = (orderId) => {
    const selected = orders.find((order) => order.id === orderId);
    setSelectedOrder(selected);
    setOrderEdVisible(true);
  };
  const updateStatusClick = async (orderId, event) => {
    event.stopPropagation();

    const selected = orders.find((order) => order.id === orderId);
    setSelectedOrder(selected);
    setShowUpdateModal(true);
  };
  const confirmOrder = async (orderId, event) => {
    event.stopPropagation();
    const formData = new FormData();
    try {
      formData.append("newStatus", "Заказ принят");
      changeOrderStatus(orderId, formData);
      const updatedOrders = orders.map((order) => {
        if (order.id === orderId) {
          return { ...order, status: "Заказ принят" };
        }
        return order;
      });
      setOrders(updatedOrders);
    } catch (error) {
      console.error("Ошибка при обновлении статуса заказа:", error);
    }
  };
  const sortedorders = orders ? orders.slice().sort((a, b) => a.id - b.id) : [];
  return (
    <Container>
      <div>
        {selectedOrder && (
          <UpdateOrder
            key={selectedOrder.id}
            show={orderEdVisible}
            onHide={() => setOrderEdVisible(false)}
            order={selectedOrder}
          />
        )}
        {selectedOrder && (
          <UpdateStatus
            show={showUpdateModal}
            onHide={() => setShowUpdateModal(false)}
            order={selectedOrder}
            setOrders={setOrders}
            orders={orders}
          />
        )}
      </div>
      <Table striped bordered hover style={{ marginBottom: "150px" }}>
        <thead>
          <tr className="headers">
            <th className="header">ID</th>
            <th>Order date</th>
            <th>User</th>
            <th>Total amount</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sortedorders?.map((order) => (
            <tr
              key={order.id}
              onClick={() => {
                handleRowClick(order.id);
              }}
            >
              <td>{order.id}</td>
              <td>{order.order_date}</td>
              <td>{order.basket.user.email}</td>
              <td>{order.totalAmount}</td>
              <td>{order.status}</td>
              <td>
                {order.status === "Заказ создан" && (
                  <Button
                    className="but"
                    onClick={(event) => confirmOrder(order.id, event)}
                  >
                    Подтвердить заказ
                  </Button>
                )}
                {order.status !== "Заказ создан" &&
                  order.status !== "Принят клиентом" && (
                    <Button
                      className="but"
                      onClick={(event) => updateStatusClick(order.id, event)}
                    >
                      Изменить статус
                    </Button>
                  )}
                {order.status === "Принят клиентом" && <p></p>}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
});

export default ModerTable;
