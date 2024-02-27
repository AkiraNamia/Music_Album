import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { changeOrderStatus } from "../../http/userAPI";

const getAvailableStatuses = (currentStatus, allStatuses) => {
  const statusIndex = allStatuses.indexOf(currentStatus);
  return allStatuses.slice(statusIndex + 1); // Возвращает статусы после текущего
};

const UpdateStatus = ({ show, onHide, order, setOrders, orders }) => {
  const allStatuses = [
    "Заказ создан",
    "Заказ принят",
    "Ожидает оплаты",
    "Заказ оплачен",
    "Отправлен на сборку",
    "В пути",
    "Доставлен",
    "Принят клиентом",
  ];
  const selectedStatus = order.status;
  const availableStatuses = getAvailableStatuses(selectedStatus, allStatuses);
  const [selectedStatusForChange, setSelectedStatusForChange] = useState(
    order.status
  );

  const updateOrderStatus = (newStatus) => {
    setSelectedStatusForChange(newStatus);
  };
  const handleSubmit = () => {
    const formData = new FormData();
    try {
      formData.append("newStatus", selectedStatusForChange);
      changeOrderStatus(order.id, formData);
      const updatedOrders = orders.map((orderItem) => {
        if (orderItem.id === order.id) {
          return { ...orderItem, status: selectedStatusForChange };
        }
        return orderItem;
      });
      setOrders(updatedOrders);
    } catch (error) {
      console.error("Ошибка при обновлении статуса заказа:", error);
    }
    onHide();
  };
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Изменение статуса заказа</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Текущий статус: {selectedStatus}</p>
        <p>Выберите новый статус:</p>
        <div>
          {availableStatuses.map((status) => (
            <div key={status}>
              <input
                type="radio"
                id={status}
                name="status"
                value={status}
                onChange={() => updateOrderStatus(status)}
              />
              <label htmlFor={status}>{status}</label>
            </div>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Закрыть
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Сохранить изменения
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateStatus;
