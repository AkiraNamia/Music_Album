import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Button, Form } from "react-bootstrap";
import { addModerator } from "../../http/userAPI";
import { observer } from "mobx-react-lite";
import "../../css/validation.css";

const AddModerator = observer(({ show, onHide }) => {
  const [email, setMail] = useState([]);
  const [name, setName] = useState([]);
  const [nameValid, setNameValid] = useState(false);
  const [nameError, setNameError] = useState("");
  const [nameTouched, setNameTouched] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [isFormValid, setIsFormValid] = useState(true);
  const [formErrorMessage, setFormErrorMessage] = useState("");

  //   const selectFile = (e) => {
  //     setFile(e.target.files[0]);
  //   };
  const addModerators =async() => {
    setNameTouched(true);
    setEmailTouched(true);
    try {
      let data;

    if (name === "" || name === " ") {
      setNameValid(false);
      setNameError("Имя не может быть пустым");
    } else {
      setNameValid(true);
      setNameError("");
    }
    const emailRegex = /\S+@\S+\.\S+/;

    if (!emailRegex.test(email)) {
      setEmailValid(false);
      setEmailError("Укажите корректную почту");
    } else {
      setEmailValid(true);
      setEmailError("");
    }
    const formData = new FormData();
    if (nameValid && emailValid) {
      
        formData.append("name", name);
        formData.append("email", email);
        addModerator(name, email).then((data) => onHide());

        setIsFormValid(true);
        setFormErrorMessage(" ");
      } else {
      setIsFormValid(false);
      setFormErrorMessage("Данные не корректны");
    }}catch (e) {
      if (e.response && e.response.data && e.response.data.message) {
        alert(e.response.data.message);
      } else {
        alert("Error: " + e.message);
      }      }
    
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Добавить модератора
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Control
            className="mt-3"
            placeholder={"Введите имя"}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {!nameValid && <div className="invalid-feedback">{nameError}</div>}
          <Form.Control
            value={email}
            onChange={(e) => setMail(e.target.value)}
            placeholder={"Введите почту"}
            className="mt-3"
          />
        </Form>
        {!emailValid && <div className="invalid-feedback">{emailError}</div>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={onHide}>
          Закрыть
        </Button>
        <Button variant="outline-success" onClick={addModerators}>
          Добавить
        </Button>
        {!isFormValid && (
          <div style={{ color: "red", marginTop: "0.5rem" }}>
            {formErrorMessage}
          </div>
        )}
      </Modal.Footer>
    </Modal>
  );
});

export default AddModerator;
