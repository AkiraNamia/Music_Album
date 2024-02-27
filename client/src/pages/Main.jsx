import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import styles from "../css/mainPage.module.css";
import PopularList from "../components/slider/PopularList.jsx";
import { observer } from "mobx-react-lite";
import Slider from "../components/slider/Slider";
import SaleItems from "../components/slider/SaleItems";

const Main = observer(() => {
  return (
    <Container className={styles.mainContainer}>
      <Col></Col>
      <Row>
        <Slider></Slider>
      </Row>

      <div
        style={{
          marginTop: "5%",
          background: "black",
          width: "100%",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontWeight: "bold",
          height: "50px",
        }}
        className="title"
      >
        SALES{" "}
      </div>

      <Row>
        <SaleItems />
      </Row>

      <Row>
        <div
          style={{
            marginTop: "5%",
            background: "black",
            width: "100%",
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: "bold",
            height: "50px",
          }}
          className="title"
        >
          MORE PRODUCTS{" "}
        </div>
        <Row>
          <PopularList />
        </Row>
      </Row>
    </Container>
  );
});

export default Main;
