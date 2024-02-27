import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { Col, Row } from "react-bootstrap";
import PopularItem from "./PopularItem";
import "../../css/popularList.css";
import { fetchAlbumsForAdmin } from "../../http/productAPI";
const PopularList = observer(() => {
  const [albums, setAlbums] = useState([]);
  const containerRef = useRef(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAlbumsForAdmin();
        setAlbums(data);
      } catch (error) {
        console.error("Error fetching albums:", error);
      }
    };

    fetchData();
  }, []);

  const scrollLeft = () => {
    const container = containerRef.current;
    if (container) {
      container.scrollTo({
        left: container.scrollLeft - container.clientWidth,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    const container = containerRef.current;
    if (container) {
      container.scrollTo({
        left: container.scrollLeft + container.clientWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <Row
      className="mb-4 align-items-center justify-content-center"
      style={{ height: "500px" }}
    >
      <Col xs={1}>
        <button className="allow butonLeft" onClick={scrollLeft}></button>
      </Col>
      <Col xs={10}>
        <Row className="flex-nowrap scroll-container" ref={containerRef}>
          {albums?.map((product) => (
            <PopularItem key={product.id} product={product} />
          ))}
        </Row>
      </Col>

      <Col xs={1}>
        <button className="allow butonRight" onClick={scrollRight}></button>
      </Col>
    </Row>
  );
});

export default PopularList;
