import React, {useState} from 'react';
import Modal from "react-bootstrap/Modal";
import {Form, Button} from "react-bootstrap";
import { createGenre} from "../../http/productAPI";
import "../../css/validation.css"

const CreateGenre = ({show, onHide}) => {
    const [value, setValue] = useState("")
    const [nameValid, setNameValid] = useState(false);
    const [nameError, setNameError] = useState('');
    const [nameTouched, setNameTouched] = useState(false);
    const [isFormValid, setIsFormValid] = useState(true);
    const [formErrorMessage, setFormErrorMessage] = useState('');
    const addGenre = () => {
        setNameTouched(true);
        console.log(value)
        if (value.trim()===""||value.trim()===" ") {
            setNameValid(false);
            setNameError('Название не может быть пустым');
          } else {
            setNameValid(true);
            setNameError('');
          }
          const formData = new FormData()
          if (nameValid){ 
          try{
          formData.append('name', value)
          createGenre(value).then(data => onHide())
          setIsFormValid(true);
          setFormErrorMessage(' ');
      } catch(e){
          alert(e)
      }} else{  setIsFormValid(false);
        setFormErrorMessage('Данные не корректны');}
      
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Add new genre
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Control
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        placeholder={"Enter genre"}
                        />
                         {!nameValid && (
            <div className="invalid-feedback">{nameError}</div>
          )}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>Close</Button>
                <Button variant="outline-success" onClick={addGenre}>Add</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateGenre;
