import React, { useState, useContext, useEffect } from "react";
import "../css/rating.css";
import { Context } from "../main";
import { Button, Row, Col, Form, FormLabel } from "react-bootstrap";
import { createComment, fetchComment } from "../http/productAPI";
const Comments = ({ product }) => {
  const [comment, setComment] = useState([]);
  const [newComment, setNewComment] = useState(""); // Состояние для нового комментария
  const { user } = useContext(Context);
  const [nameValid, setNameValid] = useState(false);
  const [nameError, setNameError] = useState("");
  const [nameTouched, setNameTouched] = useState(false);

  useEffect(() => {
    const fetchComm = async () => {
      try {
        if (product.id) {
          // Проверка наличия product.id перед запросом
          const comm = await fetchComment(product.id);
          setComment(comm);
          console.log("Comment пользователя:", comm);
        } else {
          console.log("product.id не определён"); // Добавьте сообщение или обработку, если product.id не определён
        }
      } catch (error) {
        console.error("Ошибка получения рейтинга пользователя:", error.message);
      }
    };

    fetchComm();
  }, [product.id]);
  console.log(user);
  console.log(newComment);

  const handleAddComment = async () => {
    const formData = new FormData();
    setNameTouched(true);
    if (newComment.trim() === "" || newComment.trim() === " ") {
      setNameValid(false);
      setNameError("Комментарий не может быть пустым");
    } else {
      setNameValid(true);
      setNameError("");

      console.log(nameValid);
      try {
        if (product.id && user.id && nameValid) {
          formData.append("albumId", `${product.id}`);
          formData.append("userId", `${user.id}`);
          formData.append("description", newComment);
          const response = await createComment(formData);

          console.log("Ответ сервера после добавления комментария:", response);
          if (
            response &&
            response.message === "Комментарий для альбома добавлен"
          ) {
            const updatedComments = await fetchComment(product.id);
            setComment(updatedComments);
            setNewComment("");
          }
        }
      } catch (error) {
        console.error("Ошибка добавления комментария:", error.message);
      }
    }
  };
  console.log(newComment);
  return (
    <Row>
      <Col>
        <h1>Comments</h1>
        {comment?.map((i) => (
          <Row className="mb-3 align-items-center" key={i.id}>
            <Col md={3}>
              <FormLabel>{i.user.name || "Пользователь " + i.userId}</FormLabel>
            </Col>
            <Col md={9}>
              <Form.Control
                className={`mt-3`}
                value={i.description}
                placeholder={"Введите название альбома"}
                disabled="true"
              />
            </Col>
          </Row>
        ))}
        {user.isAuth ? (
          <div>
            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Введите ваш комментарий"
              />
              {!nameValid && (
                <div className="invalid-feedback">{nameError}</div>
              )}
            </Form.Group>
            <Button variant="primary" onClick={handleAddComment}>
              Добавить комментарий
            </Button>
          </div>
        ) : (
          <p>Чтобы добавить комментарий, авторизуйтесь</p>
        )}
      </Col>
    </Row>
  );
};

export default Comments;
