import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import "../../css/mainPage.css";
import { observer } from "mobx-react-lite";
import { PRODUCT_ROUTE } from "../../utils/consts";
import { useNavigate } from "react-router-dom";
import { fetchSales } from "../../http/productAPI.js";
const SaleItems = observer(() => {
  const navigate = useNavigate();

  const [album, setAlbum] = useState([]);

  useEffect(() => {
    fetchSales().then((data) => {
      setAlbum(data);
    });
  }, []);
  console.log(album);
  return (
    <Container>
      {album.map((album, index) => (
        <Col key={index}>
          <Row
            style={{
              marginTop: "5%",
              width: "100%",
              flexDirection: index % 2 === 0 ? "row" : "row-reverse",
            }}
          >
            <Col>
              <Image src={"http://localhost:5000/" + album.img}></Image>
            </Col>
            <Col>
              <div className="popular">
                <h4 className="artist">{album.artist.name}</h4>
                <p className="title">{album.title}</p>

                {album.genres.map((genre, index) => (
                  <p key={index} className="descr">
                    Genre:{genre.name}
                  </p>
                ))}
                <Button
                  className="but"
                  style={{ width: "50%" }}
                  onClick={() => navigate(PRODUCT_ROUTE + "/" + album.id)}
                >
                  Order NOW
                </Button>
              </div>
            </Col>
          </Row>
        </Col>
      ))}
    </Container>
  );
});

export default SaleItems;
