import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { deleteModer } from '../../http/userAPI';

const DeleteModerator = ({ show, onHide }) => {
    const [value, setValue] = useState('1'); // Используйте строку для input и числовое представление для отправки

    const removeModer = () => {
        try{
        deleteModer(value).then(data => {
            setValue('1');
            onHide();
            
        });
        alert("Album was successfully deleted!");
    }
        catch(e){alert("Error"+e.message)}
    }

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Delete moderator
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Control
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        type="number"
                        placeholder={"Введите id модератора"}
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>Close</Button>
                <Button variant="outline-success" onClick={removeModer}>Delete</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteModerator;
