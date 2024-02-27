import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { addSongAudio } from '../../http/productAPI';

const AddAudioModal = ({ show, handleClose, song }) => {
  const [audioFile, setAudioFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setAudioFile(file);
  };
console.log(song.audio)
  const handleUploadClick = () => {
    if (audioFile) {
        const formData = new FormData();

        try{
            formData.append("audio", audioFile);

        addSongAudio(song.id, formData);
      handleClose();
    }catch(e){alert(e.message)}
}
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Загрузить аудиофайл</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Выберите файл</Form.Label>
          <Form.Control type="file" onChange={handleFileChange} />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Отмена
        </Button>
        <Button variant="primary" onClick={handleUploadClick}>
          Загрузить
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddAudioModal;
