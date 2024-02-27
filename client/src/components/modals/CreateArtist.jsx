import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Form, Button } from "react-bootstrap";
import { createArtist } from "../../http/productAPI";
import "../../css/validation.css";

const CreateArtist = ({ show, onHide }) => {
  const [name, setName] = useState("");
  const [nameValid, setNameValid] = useState(false);
  const [nameError, setNameError] = useState("");
  const [nameTouched, setNameTouched] = useState(false);
  const [isFormValid, setIsFormValid] = useState(true);
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const addArtist = () => {
    setNameTouched(true);
    if (name.trim() === "") {
      setNameValid(false);
      setNameError("Имя не может быть пустым");
      setIsFormValid(false);
      setFormErrorMessage("Данные не корректны");
    } else {
      setNameValid(true);
      setNameError("");
      setIsFormValid(true);
      setFormErrorMessage("");
      console.log(nameValid);
  console.log(name)
      const formData = new FormData();
      formData.append('name', name);
  
      if (nameValid) {
        try {
          createArtist(name).then((data) => onHide());
        } catch (e) {
          alert(e);
        }
      }
    }
  };
  

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Add new artist
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={"Enter artist name"}
          />
          {!nameValid && <div className="invalid-feedback">{nameError}</div>}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={onHide}>
          Close
        </Button>
        <Button variant="outline-success" onClick={addArtist}>
          Add
        </Button>
        {!isFormValid && (
          <div style={{ color: "red", marginTop: "0.5rem" }}>
            {formErrorMessage}
          </div>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default CreateArtist;
