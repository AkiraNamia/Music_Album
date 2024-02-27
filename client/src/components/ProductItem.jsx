import React, { useState, useEffect } from "react";
import { Card, Col, Row } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import star from "../images/star.png";
import { PRODUCT_ROUTE } from "../utils/consts";
import { useNavigate } from "react-router-dom";
import { fetchRate } from "../http/productAPI";

const ProductItem = ({ product }) => {
  const navigate = useNavigate();
  const [promotionPrice, setPromotionPrice] = useState(null);
  useEffect(() => {
    if (
      product.adminInfos &&
      product.adminInfos.length > 0 &&
      product.adminInfos[0].promotion_price
    ) {
      setPromotionPrice(product.adminInfos[0].promotion_price);
      console.log(promotionPrice);
    }
  }, [product.adminInfos, promotionPrice]);

  const cardStyle = {
    maxWidth: "300px",
    transition: "transform 0.2s, box-shadow 0.2s",
  };

  const handleMouseEnter = () => {
    const card = document.getElementById("productCard" + product.id);
    card.style.transform = "scale(1.05)";
    card.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.2)";
  };

  const handleMouseLeave = () => {
    const card = document.getElementById("productCard" + product.id);
    card.style.transform = "scale(1)";
    card.style.boxShadow = "0px 1px 3px rgba(0, 0, 0, 0.1)";
  };
  const [rate, setRate] = useState({ rates: 0 });

  useEffect(() => {
    fetchRate(product.id).then((data) => {
      setRate({ rates: data });
    });
  }, [product.id]);
  //  console.log(product.adminInfos)
  return (
    <Col
      md={4}
      className="mb-3"
      onClick={() => navigate(PRODUCT_ROUTE + "/" + product.id)}
    >
      <Card
        style={cardStyle}
        border={"light"}
        className="mx-auto text-center"
        id={"productCard" + product.id}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Card.Img
          variant="top"
          width={300}
          height={300}
          src={"http://localhost:5000/" + product.img}
          className="img-fluid"
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
              {promotionPrice !== null ? (
                <Col style={{ textAlign: "left" }}>
                  <span
                    style={{
                      textDecoration: "line-through",
                      marginRight: "5px",
                    }}
                  >
                    ${product.price}
                  </span>
                  ${promotionPrice}
                </Col>
              ) : (
                <Col style={{ textAlign: "left" }}>${product.price}</Col>
              )}
              <Col style={{ textAlign: "right" }}>
                <Image width={18} height={18} src={star} />
                {rate.rates}
              </Col>
            </Row>
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default ProductItem;
