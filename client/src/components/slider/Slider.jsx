import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import styles from "../../css/mainPage.module.css";
import { fetchAlbumsForAdmin } from "../../http/productAPI";
import { PRODUCT_ROUTE } from "../../utils/consts";
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";

const Slider = () => {
  const navigate = useNavigate();

  const [currentSlide, setCurrentSlide] = useState(0);

  const [popularAlbums, setPopularAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  const findTopFiveAlbums = (albums) => {
    const topFive = albums
      .map((album) => {
        const averageRating = calculateAverageRating(
          album.ratings.map((rating) => rating.rate)
        );
        return {
          id: album.id,
          artist: album.artist.name,
          title: album.title,
          rating: averageRating,
          image: album.img,
        };
      })
      .sort((a, b) => b.rating - a.rating) // Сортируем альбомы по рейтингу
      .slice(0, 5); // Берем только первые пять альбомов

    return topFive;
  };

  const calculateAverageRating = (ratings) => {
    if (ratings.length === 0) {
      return 0; // Если нет оценок, среднее значение равно 0
    }

    const sum = ratings.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );
    const average = sum / ratings.length;
    const roundedAverage = average.toFixed(2); // Округляем до двух знаков после запятой

    return parseFloat(roundedAverage);
  };
  useEffect(() => {
    try {
      fetchAlbumsForAdmin().then((data) => {
        const topFiveAlbums = findTopFiveAlbums(data);
        setPopularAlbums(topFiveAlbums);
      });

      console.log(popularAlbums);
    } catch (error) {
      alert("Ошибка:", error);
    } finally {
      setLoading(false);
    }
  }, []); //TODO: fix
  const slides = [
    {
      description:
        "An exquisite blend of musical tones that evoke incredible emotions and uplift the soul.",
    },
    {
      description:
        "This album is a true musical masterpiece, encompassing profound meaning and boundless energy in its sounds.",
    },
    {
      description:
        "The sounds of this album transport you to an entirely new reality, enveloping the listener in an atmosphere of unique harmony.",
    },
    {
      description:
        "An album that combines artistry, poignant lyrics, and incredibly beautiful music.",
    },
    {
      description:
        "This creation opens doors to an emotional world, filling it with the most stunning sounds and harmony.",
    },
  ];
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer;
    if (progress < 100) {
      timer = setTimeout(() => {
        setProgress(progress + 1);
      }, 30);
    } else {
      setProgress(0);
    }

    return () => clearTimeout(timer);
  }, [progress]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) =>
        prevSlide === popularAlbums.length - 1 ? 0 : prevSlide + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [popularAlbums.length]);

  if (loading) {
    return <Spinner animation={"grow"} />;
  }
  return (
    <Col>
      {popularAlbums.length > 0 && (
        <Container className="slider">
          <Row className="d-flex align-items-center justify-content-center">
            <Col xs={6} className="text-center">
              <div className="popular">
                <div
                  style={{
                    marginTop: "5%",
                    width: "100%",
                    color: "black",
                    display: "flex",
                    justifyContent: "left",
                    alignItems: "left",
                    fontWeight: "bold",
                    height: "50px",
                  }}
                  className="title"
                >
                  POPULAR{" "}
                </div>
                <h4 className="artist">{popularAlbums[currentSlide].artist}</h4>
                <p className="title">{popularAlbums[currentSlide].title}</p>
                <p className="descr">
                  Rating: {popularAlbums[currentSlide].rating}
                </p>
                <p className="descr">{slides[currentSlide].description}</p>

                <Button
                  className="but"
                  style={{ width: "50%" }}
                  onClick={() =>
                    navigate(
                      PRODUCT_ROUTE + "/" + popularAlbums[currentSlide].id
                    )
                  }
                >
                  Order NOW
                </Button>
              </div>
            </Col>
            <Col xs={6} className="text-center">
              <Image
                src={
                  "http://localhost:5000/" + popularAlbums[currentSlide].image
                }
                style={{ width: "50%" }}
                rounded
              />
            </Col>
          </Row>
          <Row className="justify-content-center">
            <div className="slide-indicators d-flex justify-content-center">
              {popularAlbums.map((slide, index) => (
                <div
                  key={index}
                  className={`indicator-dot ${
                    index === currentSlide ? "active" : ""
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </Row>
        </Container>
      )}
    </Col>
  );
};

export default Slider;
