import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Button, Row, Col, Image, Container, Card } from "react-bootstrap";
import { observer } from "mobx-react-lite";

const UpdateOrder = observer(({ show, onHide, order }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteVisible, setIsDeleteVisible] = useState(false);
  const [isEditVisible, setIsEditVisible] = useState(true);
  console.log(order);
  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Подробная информация
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <p>Order id: {order.id}</p>
          <p>Order date: {order.order_date}</p>

          <p>Total amount: {order.totalAmount}</p>
          <p>Status: {order.status}</p>
          <p>Payment type: {order.paymentType}</p>
          <Card>
            <Card.Body>
              <Card.Title>Products:</Card.Title>
              <Card.Text>
                {order.albums?.map((album) => (
                  <Row key={order.id}>
                    <Col md={6}>
                      <div>
                        <p>
                          <span>Title: </span>
                          {album.title}
                        </p>
                      </div>
                      <div>
                        <p>
                          <span>Artist: </span>
                          {album.artist.name}
                        </p>
                      </div>
                      <div>
                        <p>
                          <span>Price: </span>
                          {album.price}
                        </p>
                      </div>
                      <div>
                        <p>
                          <span>Quantity: </span>
                          {album.order_product.number}
                        </p>
                      </div>
                      <div>
                        <p>
                          <span>Balance: </span>
                          {album.balance}
                        </p>
                      </div>
                    </Col>
                    <Col md={6}>
                      <Image
                        width={200}
                        height={200}
                        src={"http://localhost:5000/" + album.img}
                      />
                    </Col>
                    <hr />
                  </Row>
                ))}
              </Card.Text>

              <Card.Title>Order Info</Card.Title>
              <Card.Text>
                {order.info?.map((orderInfo) => (
                  <Row key={order.id}>
                    <div>
                      <p>
                        <span>First name: </span>
                        {orderInfo.firstName}
                      </p>
                    </div>
                    <div>
                      <p>
                        <span>Last name: </span>
                        {orderInfo.lastName}
                      </p>
                    </div>
                    <div>
                      <p>
                        <span>Delivery address: </span>
                        {orderInfo.country}, {orderInfo.countryRegion},{" "}
                        {orderInfo.city}, {orderInfo.address},{" "}
                        {orderInfo.zipCode}
                      </p>
                    </div>

                    <div>
                      <p>
                        <span>Phone number: </span>
                        {orderInfo.phoneNumber}
                      </p>
                    </div>
                  </Row>
                ))}
              </Card.Text>
            </Card.Body>
          </Card>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button className="but" variant="outline-danger" onClick={onHide}>
          Close
        </Button>
        <Button
          onClick={() => {
            setIsEditing(true);
            setIsDeleteVisible(true);
            setIsEditVisible(false);
          }}
          className="but"
          variant="outline-success"
          style={{ display: isEditVisible ? "block" : "none" }}
        >
          Edit
        </Button>

        <Button
          className="but"
          variant="outline-danger"
          style={{ display: isEditing ? "block" : "none" }}
          onClick={() => {
            setIsEditing(false);
            setIsDeleteVisible(false);
            setIsEditVisible(true);
          }}
        >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default UpdateOrder;
