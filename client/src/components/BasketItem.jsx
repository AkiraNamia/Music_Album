import React, { useState, useEffect, useContext } from "react";
import { Card, Button, Row, Col, Container } from "react-bootstrap";
import {
  deleteBasketProduct,
  updateBasketProductNumber,
} from "../http/productAPI";
import "../css/basket.css";
import { Context } from "../main.jsx";

const BasketItem = ({ album }) => {
  const { order } = useContext(Context);

  const [quantity, setQuantity] = useState(album.basket_product.number);
  console.log(album.basket_product.basketId);
  order.setBasketId(album.basket_product.basketId);

  const [formData, setFormData] = useState({
    basketId: 0,
    albumId: 0,
    number: 0,
  });

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      basketId: album.basket_product.basketId || 0,
      albumId: album.id || 0,
      number: album.basket_product.number || 0,
    }));
  }, [album]);

  console.log(formData);
  useEffect(() => {
    const quant = async () => {
      try {
        setQuantity(album.basket_product.number);
      } catch (error) {
        console.error("Ошибка получения товаров пользователя:", error.message);
      }
    };
    quant();
  }, [album.basket_product.number, quantity]);

  const handleDecrement = async () => {
    if (quantity > 1) {
      const updatedQuantity = quantity - 1;

      try {
        const formDataEnd = new FormData();
        formDataEnd.append("basketId", album.basket_product.basketId || 0);
        formDataEnd.append("albumId", album.id || 0);
        formDataEnd.append("number", updatedQuantity);

        const updatedAlbum = await updateBasketProductNumber(
          album.basket_product.basketId,
          formDataEnd
        );
        if (updatedAlbum) {
          setQuantity(Number(updatedAlbum.number));
          alert("Количество товара успешно изменено!");
          window.location.reload();
        }
      } catch (error) {
        console.error(
          "Ошибка при увеличении количества товара:",
          error.message
        );
      }
    }
  };

  const handleIncrement = async () => {
    if (album.balance > 0) {
      const updatedQuantity = quantity + 1;

      try {
        const formDataEnd = new FormData();
        formDataEnd.append("basketId", album.basket_product.basketId || 0);
        formDataEnd.append("albumId", album.id || 0);
        formDataEnd.append("number", updatedQuantity);

        const updatedAlbum = await updateBasketProductNumber(
          album.basket_product.basketId,
          formDataEnd
        );
        if (updatedAlbum) {
          setQuantity(Number(updatedAlbum.number));
          alert("Количество товара успешно изменено!");
          window.location.reload();
        }
      } catch (error) {
        console.error(
          "Ошибка при увеличении количества товара:",
          error.message
        );
      }
    }
  };

  const drop = async () => {
    const formDataEnd = new FormData();

    try {
      formDataEnd.append("productId", album.id || 0);
      formDataEnd.append("basketId", album.basket_product.basketId || 0);
      const response = await deleteBasketProduct(formDataEnd);
      if (response) {
        alert("Товар успешно удалён!");
        window.location.reload();
      }
    } catch (error) {
      console.error("Ошибка при drop:", error.message);
    }
  };

  console.log(album.basket_product.number);
  return (
    <Card
      style={{
        width: "100%",
        margin: "10px",
        background: "black",
        color: "white",
      }}
    >
      <Card.Body>
        <Row>
          <Col md={3}>
            <Card.Img
              variant="top"
              src={"http://localhost:5000/" + album.img}
            />
          </Col>
          <Col md={6}>
            <Container>
              <h5>{album.title}</h5>
              <p>{album.artist.name}</p>
              <p>Количество: {album.basket_product.number}</p>
              <p>Price: {album.price}$</p>
            </Container>
          </Col>
          <Col md={3} className="d-flex align-items-center justify-content-end">
            <Button className="mr-2 but" onClick={handleDecrement}>
              -
            </Button>
            <Button className="mr-2 but" onClick={handleIncrement}>
              +
            </Button>
            <Button className="but" onClick={drop}>
              Drop
            </Button>
          </Col>
        </Row>
        <hr className="hr"></hr>
      </Card.Body>
    </Card>
  );
};

export default BasketItem;
