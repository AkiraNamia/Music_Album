import React from "react";
import Modal from "react-bootstrap/Modal";
import { observer } from "mobx-react-lite";
import { Button,  } from "react-bootstrap";
  import {
    deleteAlbum,
      deleteArtist,
  } from "../../http/productAPI";
import { deleteModer } from "../../http/userAPI";
  const ConfirmDelete = observer(({ show, onHide, artist }) => {

      const removeArtist = (id) => {
        deleteArtist(id).then(data => {
            onHide();
        });
    }
    const removeAlbum = (id) => {
      deleteAlbum(id).then(data => {
          onHide();
      });
    }
    const removeModer = (id) => {
      deleteModer(id).then(data => {
          onHide();
      });

}
      return(    
          <Modal show={show} onHide={onHide}>
  <Modal.Header closeButton>
    <Modal.Title>Confirm deletion</Modal.Title>
  </Modal.Header>
  <Modal.Body>
  Are you sure you want to delete {artist.name||artist.title}?
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={onHide}>
      Cancel
    </Button>
    <Button variant="danger" onClick={() => {
      {artist.name&&removeArtist(artist.id);}
      {artist.title&&removeAlbum(artist.id)}
      {artist.role&&removeModer(artist.id)}

      onHide()
    }}>
      Delete
    </Button>
  </Modal.Footer>
</Modal>

     
      )
  })
  export default ConfirmDelete;
