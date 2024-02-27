import React from "react";
import { Modal, Button } from "react-bootstrap";

const Success = ({ show, onHide }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Sorry...</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>You need to log in to add album to cart.</p>
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
