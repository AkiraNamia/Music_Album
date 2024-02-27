import React, { useContext, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Tab,
  Tabs,
  FloatingLabel,
} from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { Context } from "../main.jsx";

const PaymentForm = observer(({ handleContinue, handleStepChange }) => {
  const { order } = useContext(Context);
  const [cardName, setCardName] = useState("");
  const [cardNameValid, setCardNameValid] = useState(false);
  const [cardNameError, setCardNameError] = useState("");
  const [cardNameTouched, setCardNameTouched] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardNumberValid, setCardNumberValid] = useState(false);
  const [cardNumberError, setCardNumberError] = useState("");
  const [cardNumberTouched, setCardNumberTouched] = useState(false);
  const [cardDate, setCardDate] = useState("");
  const [cardDateValid, setCardDateValid] = useState(false);
  const [cardDateError, setCardDateError] = useState("");
  const [cardDateTouched, setCardDateTouched] = useState(false);
  const [cardCode, setCardCode] = useState("");
  const [cardCodeValid, setCardCodeValid] = useState(false);
  const [cardCodeError, setCardCodeError] = useState("");
  const [cardCodeTouched, setCardCodeTouched] = useState(false);
  const [isFormValid, setIsFormValid] = useState(true);
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const formatCardNumber = (input) => {
    const cardNumber = input.replace(/\D/g, "");

    let formattedCardNumber = "";
    for (let i = 0; i < 16; i++) {
      if (i > 0 && i % 4 === 0) {
        formattedCardNumber += " ";
      }
      formattedCardNumber += cardNumber.charAt(i);
    }

    return formattedCardNumber.trim();
  };

  const formatCardDate = (input) => {
    const cardDate = input.replace(/\D/g, "");

    let formattedCardDate = "";
    for (let i = 0; i < cardDate.length && i < 4; i++) {
      if (i === 2 && cardDate.length > 2) {
        formattedCardDate += " / ";
      }
      formattedCardDate += cardDate.charAt(i) || "";
    }

    return formattedCardDate.trim();
  };

  const formatCVC = (input) => {
    return input.replace(/\D/g, "").substring(0, 3);
  };
  const formatName = (input) => {
    return input.toUpperCase();
  };
  const validateCardDate = (input) => {
    const [monthInput, yearInput] = input
      .split(" / ")
      .map((entry) => parseInt(entry.trim(), 10));

    if (isNaN(monthInput) || isNaN(yearInput)) {
      return false;
    }

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const currentFullYear = parseInt(currentYear.toString().slice(2, 4), 10);
    console.log(currentFullYear < yearInput);
    if (
      monthInput < 1 ||
      monthInput > 12 ||
      yearInput < currentFullYear ||
      yearInput > currentFullYear + 10 ||
      (currentFullYear === yearInput && monthInput < currentMonth)
    ) {
      return false;
    }

    return true;
  };

  const handleCardDateChange = (event) => {
    const inputValue = event.target.value;
    console.log("Input value:", inputValue);

    const formattedDate = formatCardDate(inputValue);
    console.log("Formatted date:", formattedDate);
    console.log("валидате date:", validateCardDate(formattedDate));

    if (validateCardDate(formattedDate)) {
      setCardDate(formattedDate);
      setCardDateValid(true);
      setCardDateError("");
    } else {
      setCardDate(formattedDate);
      setCardDateValid(false);
      setCardDateError("Некорректный срок действия карты");
    }
  };

  const handlePaymentSubmit = () => {
    setCardCodeTouched(true);
    setCardDateTouched(true);
    setCardNameTouched(true);
    setCardNumberTouched(true);

    if (!cardName.trim()) {
      setCardNameValid(false);
      setCardNameError("Укажите держателя карты");
    } else {
      setCardNameValid(true);
      setCardNameError("");
    }
    if (cardNumber.toString().length < 19) {
      setCardNumberValid(false);
      setCardNumberError("Укажите номер карты");
    } else {
      setCardNumberValid(true);
      setCardNumberError("");
    }
    if (!cardDate.trim()) {
      setCardDateValid(false);
      setCardDateError("Укажите срок действия карты");
    } else {
      setCardDateValid(true);
      setCardDateError("");
    }
    if (cardCode.toString().length !== 3) {
      setCardCodeValid(false);
      setCardCodeError("Укажите CVC-код карты");
    } else {
      setCardCodeValid(true);
      setCardCodeError("");
    }
    if (cardCodeValid && cardDateValid && cardNameValid && cardNumberValid) {
      try {
        order.setPaymentType("By card");
        handleContinue();
        setIsFormValid(true);
        setFormErrorMessage("");
      } catch (error) {
        console.error("Error:", error.message);
      }
    } else {
      setIsFormValid(false);
      setFormErrorMessage("Данные не корректны");
    }
  };
  const handlePaymentCashSubmit = () => {
    try {
      order.setPaymentType("By cash");
      handleContinue();
    } catch (error) {
      console.error("Error:", error.message);
    }
  };
  return (
    <Container>
      <Tabs
        defaultActiveKey="card"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="card" title="Card">
          <Form>
            <Form.Group className="mb-3" controlId="formGridName">
              <FloatingLabel controlId="floatingInputGrid" label="Name on card">
                <Form.Control
                  placeholder="Name on Card"
                  onChange={(e) => setCardName(formatName(e.target.value))}
                  value={formatName(cardName)}
                />
              </FloatingLabel>
              {!cardNameValid && (
                <div className="invalid-feedback">{cardNameError}</div>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formGridCardNumber">
              <FloatingLabel controlId="floatingInputGrid" label="Card number">
                <Form.Control
                  placeholder="1111 1111 1111 1111"
                  onChange={(e) =>
                    setCardNumber(formatCardNumber(e.target.value))
                  }
                  value={formatCardNumber(cardNumber)}
                />
              </FloatingLabel>{" "}
              {!cardNumberValid && (
                <div className="invalid-feedback">{cardNumberError}</div>
              )}
            </Form.Group>

            <Row className="mb-3">
              <Form.Group as={Col} className="mb-3" controlId="formGridDate">
                <FloatingLabel controlId="floatingInputGrid" label="Expiration">
                  <Form.Control
                    placeholder="MM / YY"
                    onChange={handleCardDateChange}
                    value={formatCardDate(cardDate)}
                  />
                </FloatingLabel>{" "}
                {!cardDateValid && (
                  <div className="invalid-feedback">{cardDateError}</div>
                )}
              </Form.Group>

              <Form.Group as={Col} className="mb-3" controlId="formGridCvc">
                <FloatingLabel controlId="floatingInputGrid" label="CVC">
                  <Form.Control
                    placeholder="CVC"
                    onChange={(e) => setCardCode(formatCVC(e.target.value))}
                    value={formatCVC(cardCode)}
                    maxLength={3} // Устанавливаем максимальную длину поля ввода
                  />
                </FloatingLabel>{" "}
                {!cardCodeValid && (
                  <div className="invalid-feedback">{cardCodeError}</div>
                )}
              </Form.Group>
            </Row>
            <Row>
              <Button
                as={Col}
                className="but"
                onClick={() => handlePaymentSubmit("By card")}
              >
                Submit
              </Button>
              {!isFormValid && (
                <div style={{ color: "red", marginTop: "0.5rem" }}>
                  {formErrorMessage}
                </div>
              )}
              <Button as={Col} className="but" onClick={handleStepChange}>
                Previous
              </Button>
            </Row>
          </Form>
        </Tab>
        <Tab eventKey="cash" title="Cash">
          If you have chosen the "Cash" payment type, you will pay for the
          parcel at the post office.
          <Button
            className="mt-3 but"
            onClick={() => handlePaymentCashSubmit()}
          >
            Submit
          </Button>
          <Button className="but" onClick={handleStepChange}>
            Previous
          </Button>
        </Tab>
      </Tabs>
    </Container>
  );
});

export default PaymentForm;
