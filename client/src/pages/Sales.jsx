import React, { useContext, useEffect } from "react";
import { Row, Col, Container } from "react-bootstrap";
import ProductList from "../components/ProductList";
import { observer } from "mobx-react-lite";
import { Context } from "../main.jsx";
import { fetchArtist, fetchGenre, fetchSales } from "../http/productAPI";

const Sales = observer(() => {
  const { product } = useContext(Context);

  useEffect(() => {
    fetchGenre().then((data) => product.setGenres(data));
    fetchArtist().then((data) => product.setArtists(data));
    fetchSales().then((data) => {
      product.setAlbums(data);
    });
  }, [product]);

  return (
    <Container style={{ marginBottom: "150px" }}>
      <Row>
        <Col>
          <Row md={12}>
            <ProductList />
          </Row>
        </Col>
      </Row>
    </Container>
  );
});

export default Sales;
