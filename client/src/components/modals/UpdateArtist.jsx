import React from "react";
import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { observer } from "mobx-react-lite";
import {
    Button,
    Form,
    Row,
    Col,
    FormLabel,
  } from "react-bootstrap";
  import {
    editArtist
  } from "../../http/productAPI";
import ConfirmDelete from "./ConfirmDelete";
  const UpdateArtist = observer(({ show, onHide, artist }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleteVisible, setIsDeleteVisible] = useState(false);
    const [isEditVisible, setIsEditVisible] = useState(true);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
      });
    console.log(artist)
      useEffect(() => {
        setFormData({
          name: artist.name || "",
        });
      }, [artist]);
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
      };
      const editArtistHandler = async () => {
        try {
          const id = artist.id;
         
          const response = await editArtist(id, {
            ...formData,
          });
          console.log(response);
          onHide();
        } catch (error) {
          console.error("Ошибка при редактировании артиста:", error);
        }
      };
     
      return(    
      <Modal show={show} onHide={onHide} centered size="lg">
        <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
        Detailed information
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
        <Row className="mb-3 align-items-center">
            <Col md={3}>
              <FormLabel>Name:</FormLabel>
            </Col>
            <Col md={9}>
              <Form.Control
                placeholder={"Enter artist name"}
                value={formData.name}
                name="name"
                disabled={!isEditing}
                onChange={handleInputChange}
              />
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button className="but" variant="outline-danger" onClick={onHide}>
          Close
        </Button>
        <Button className="but" variant="outline-danger"   onClick={() => {setConfirmDelete(true)}}> Delete</Button>
          <ConfirmDelete key={artist.id} artist={artist} show={confirmDelete} onHide={() => setConfirmDelete(false)}/>

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
          variant="outline-primary"
          style={{ display: isEditing ? "block" : "none" }}
          onClick={() => {
            // Логика сохранения данных
            setIsEditing(false);
            setIsEditVisible(true);
            setIsDeleteVisible(false);
            editArtistHandler();
          }}
        >
          Save
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
      
      )
  })
  export default UpdateArtist;
