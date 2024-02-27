import React from "react";
import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { observer } from "mobx-react-lite";
import {
    Button,
    Dropdown,
    Form,
    Row,
    Col,
    FormLabel,
  } from "react-bootstrap";
  import {
    
    editModer
  } from "../../http/productAPI";
import ConfirmDelete from "./ConfirmDelete";
  const UpdateModerator = observer(({ show, onHide, moder }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleteVisible, setIsDeleteVisible] = useState(false);
    const [isEditVisible, setIsEditVisible] = useState(true);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email:"",
        role:""
      });
    console.log(moder)
      useEffect(() => {
        setFormData({
          name: moder.name || "",
          email: moder.email || "",
          role: moder.role || "",

        });
      }, [moder]);
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
      };
      const roles = ["MODERATOR", "ADMIN", "USER"]; // Ваши роли

      const editModerHandler = async () => {
        try {
          const id = moder.id;
         
          const response = await editModer(id, {
            ...formData,
          });
          console.log(response);
          onHide();
        } catch (error) {
          console.error("Ошибка при редактировании модератора:", error);
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
                placeholder={"Enter moderator name"}
                value={formData.name}
                name="name"
                disabled={!isEditing}
                onChange={handleInputChange}
              />
            </Col>
          </Row>
          <Row className="mb-3 align-items-center">
            <Col md={3}>
              <FormLabel>Mail:</FormLabel>
            </Col>
            <Col md={9}>
              <Form.Control
                placeholder={"Enter email"}
                value={formData.email}
                name="email"
                disabled={!isEditing}
                onChange={handleInputChange}
              />
            </Col>
          </Row>
          <Row className="mb-3 align-items-center">
            <Col md={3}>
              <FormLabel>Role:</FormLabel>
            </Col>
            <Col md={9}>
              <Dropdown>
                <Dropdown.Toggle
                  disabled={!isEditing}
                  variant="success"
                  id="dropdown-basic"
                >
                  {formData.role || "Select Role"}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {roles.map((role) => (
                    <Dropdown.Item
                      key={role}
                      onClick={() =>
                        isEditing && setFormData({ ...formData, role })
                      }
                    >
                      {role}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button className="but" variant="outline-danger" onClick={onHide}>
          Close
        </Button>
        <Button className="but" variant="outline-danger"   onClick={() => {setConfirmDelete(true)}}> Delete</Button>
          <ConfirmDelete key={moder.id} artist={moder} show={confirmDelete} onHide={() => setConfirmDelete(false)}/>

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
            editModerHandler();
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
  export default UpdateModerator;
