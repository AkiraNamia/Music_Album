import React, { useState, useEffect } from "react";
import { Card, Col, Row } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import star from "../../images/star.png";
import { PRODUCT_ROUTE } from "../../utils/consts";
import { useNavigate } from "react-router-dom";
import { fetchRate } from "../../http/productAPI";

const PopularItem = ({ product }) => {
  const navigate = useNavigate();

  const cardStyle = {
    maxWidth: "300px", // Максимальная ширина карты
    transition: "transform 0.2s, box-shadow 0.2s", // Добавляем анимацию сдвига и тени
  };

  const handleMouseEnter = () => {
    const card = document.getElementById("productCard" + product.id);
    card.style.transform = "scale(1.01)"; // Увеличиваем размер карты
    card.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.2)"; // Добавляем тень
  };

  const handleMouseLeave = () => {
    const card = document.getElementById("productCard" + product.id);
    card.style.transform = "scale(1)"; // Возвращаем размер карты обратно
    card.style.boxShadow = "0px 1px 3px rgba(0, 0, 0, 0.1)"; // Убираем тень
  };
  const [rate, setRate] = useState({ rates: 0 });

  useEffect(() => {
    fetchRate(product.id).then((data) => {
      setRate({ rates: data });
    });
  }, [product.id]);
  return (
    <Col
      md={4}
      className="mb-3"
      onClick={() => navigate(PRODUCT_ROUTE + "/" + product.id)}
    >
      <Card
        style={{ cardStyle, height: "400px" }}
        border={"light"}
        className="mx-auto text-center"
        id={"productCard" + product.id} // Уникальный идентификатор для каждой карты
      >
        <Card.Img
          variant="top"
          src={"http://localhost:5000/" + product.img}
          className="img-fluid"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
        <Card.Body style={{ padding: "0px", width: "100%" }}>
          <Card.Title style={{ textAlign: "left" }}>{product.title}</Card.Title>
          <Card.Subtitle
            className="mb-2 text-muted"
            style={{ textAlign: "left" }}
          >
            {product.artist?.name}
          </Card.Subtitle>
          <Card.Text style={{ textAlign: "justify" }}>
            <Row>
              <Col style={{}}>${product.price}</Col>
              <Col style={{ textAlign: "right" }}>
                <Image width={18} height={18} src={star} />
                {rate.rates}
              </Col>
            </Row>
          </Card.Text>
          {/* <Button variant="primary" className="but" style={{margin:"0px"}}>Add to cart</Button> */}
        </Card.Body>
      </Card>
    </Col>
  );
};

export default PopularItem;
