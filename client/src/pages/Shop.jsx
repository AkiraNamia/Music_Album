import React, { useContext, useEffect } from "react";
import { Row, Col, Container } from "react-bootstrap";
import TypeBar from "../components/TypeBar.jsx";
import ProductList from "../components/ProductList";
import SortBar from "../components/SortBar.jsx";
import { observer } from "mobx-react-lite";
import { Context } from "../main.jsx";
import {
  fetchAlbumsForAdmin,
  fetchArtist,
  fetchGenre,
} from "../http/productAPI.js";

const Shop = observer(() => {
  const { product } = useContext(Context);

  useEffect(() => {
    fetchGenre().then((data) => product.setGenres(data));
    fetchArtist().then((data) => product.setArtists(data));
    fetchAlbumsForAdmin().then((data) => {
      product.setAlbums(data);
      // product.setTotalCount(data.count);
    });
  }, [product]);
  // useEffect(() => {
  //   fetchAlbums(product.selectedArtist.id, product.page, 9).then((data) => {
  //     product.setAlbums(data.rows);
  //     product.setTotalCount(data.count);
  //   });
  // }, [product.page, product.selectedArtist]);

  return (
    <Container style={{ marginBottom: "150px" }}>
      <Row>
        <Col md={4}>
          <TypeBar />
        </Col>
        <Col>
          <Row>
            <SortBar />
          </Row>
          <Row md={8}>
            <ProductList />
          </Row>
        </Col>
      </Row>
    </Container>
  );
});

export default Shop;
