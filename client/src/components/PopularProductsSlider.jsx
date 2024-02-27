import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import Carousel from 'react-bootstrap/Carousel';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';


const PopularProductsSlider = observer(() => {
    const {product} = useContext(Context)
  return (
    <Container className="my-5" style={{marginBottom:"150px"}}>
      <h2 className="text-center mb-4">Popular Products</h2>
      <Carousel indicators={false}>
        {product.albums.map((productSlide, index) => (
          <Carousel.Item key={index}>
            <Row>
              {productSlide.map((product) => (
                <Col md={4} key={product.id}>
                  <Image src={product.image} alt={`Product ${product.id}`} fluid />
                  {/* Здесь можно добавить описание товара */}
                </Col>
              ))}
            </Row>
          </Carousel.Item>
        ))}
      </Carousel>
    </Container>
  );
});

export default PopularProductsSlider;
