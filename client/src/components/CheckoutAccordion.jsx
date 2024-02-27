import React, { useState, useContext } from "react";
import { Accordion, Card, Button } from "react-bootstrap";
import PaymentForm from "./PaymentForm";
import SubmitForm from "./SubmitForm";
import "../css/basket.css";
import { observer } from "mobx-react-lite";
import { Context } from "../main.jsx";
import { createOrder } from "../http/productAPI";
import OrderReceipt from "./OrderReceipt";

const CheckoutAccordion = observer(() => {
  const { order } = useContext(Context);
  const [activeStep, setActiveStep] = useState(1);
  const handleContinue = () => {
    setActiveStep(activeStep + 1);
  };

  const handleStepChange = (step) => {
    if (activeStep >= step) {
      setActiveStep(step);
    }
  };
  console.log(JSON.stringify(order.infos));

  const handleOrder = async () => {
    if (Array.isArray(order.infos)) {
      const formData = new FormData();
      try {
        formData.append("basketId", order.basketId);
        formData.append("info", JSON.stringify(order.infos));
        formData.append("paymentType", order.paymentType);
        formData.append("totalAmount", order.totalAmount);
        createOrder(formData);
        window.location.reload();
      } catch (error) {
        console.error("Error creating order:", error.message);
      }
    } else {
      console.error("Order information is not an array");
    }
  };

  return (
    <Accordion activeKey={activeStep}>
      <Card className="newCard">
        <Accordion.Item eventKey={1} className="newItem">
          <Accordion.Header>Step 1: Address</Accordion.Header>
          <Accordion.Body>
            <SubmitForm handleContinue={handleContinue} />
          </Accordion.Body>
        </Accordion.Item>
      </Card>

      <Card className="newCard">
        <Accordion.Item eventKey={2} className="newItem">
          <Accordion.Header>Step 2: Payment</Accordion.Header>
          <Accordion.Body>
            <PaymentForm
              handleContinue={handleContinue}
              handleStepChange={() => handleStepChange(1)}
            />
          </Accordion.Body>
        </Accordion.Item>
      </Card>

      <Card className="newCard">
        <Accordion.Item eventKey={3} className="newItem">
          <Accordion.Header>Step 3: Confirmation</Accordion.Header>
          <Accordion.Body>
            <OrderReceipt orders={order.infos} />
            <Button className="but" onClick={() => handleStepChange(2)}>
              Previous
            </Button>
            <Button className="but" onClick={handleOrder}>
              Order
            </Button>
          </Accordion.Body>
        </Accordion.Item>
      </Card>
    </Accordion>
  );
});
export default CheckoutAccordion;
