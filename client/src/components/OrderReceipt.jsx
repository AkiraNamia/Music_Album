import React from 'react';
import Card from 'react-bootstrap/Card';

const OrderReceipt = ({ orders }) => {
  return (
    <div>
      {orders.map((order, index) => (
        <Card key={index}>
          <Card.Body>
            <Card.Title>Order Receipt {index + 1}</Card.Title>
            <Card.Text>
              <p>First Name: {order.firstName}</p>
              <p>Last Name: {order.lastName}</p>
              <p>Country: {order.country}</p>
              <p>State: {order.countryRegion}</p>
              <p>City: {order.city}</p>
              <p>Address: {order.address}</p>
              <p>Zip Code: {order.zipCode}</p>
              <p>Phone Number: {order.phoneNumber}</p>
            </Card.Text>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default OrderReceipt;
