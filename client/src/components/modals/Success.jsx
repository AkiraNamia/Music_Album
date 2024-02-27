import React from "react";
import { Modal, Button } from "react-bootstrap";

const Success = ({ show, onHide }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Success</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>Album was successfully added to cart!</p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={onHide}>
          Okay
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Success;
