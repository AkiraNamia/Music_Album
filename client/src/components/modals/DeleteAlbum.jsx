import React from "react";
import Modal from "react-bootstrap/Modal";
import { observer } from "mobx-react-lite";
import {
    Button,
  } from "react-bootstrap";
  import {
    deleteGenre,
  } from "../../http/productAPI";
  const DeleteGenre = observer(({ show, onHide, artist }) => {

      
    const removeGenre = (id) => {
      deleteGenre(id).then(data => {
          onHide();
      });

}
      return(    
          <Modal show={show} onHide={onHide}>
  <Modal.Header closeButton>
    <Modal.Title>Confirm deletion</Modal.Title>
  </Modal.Header>
  <Modal.Body>
  Are you sure you want to delete {artist.name}?
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={onHide}>
      Cancel
    </Button>
    <Button variant="danger" onClick={() => {
      {artist.name&&removeGenre(artist.id);}

      onHide()
    }}>
      Delete
    </Button>
  </Modal.Footer>
</Modal>

     
      )
  })
  export default DeleteGenre;
