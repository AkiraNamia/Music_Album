import React, { useEffect, useState, useContext } from "react";
import { Button, Row, Col, Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import "../css/productPage.css";
import Image from "react-bootstrap/Image";
import {
  fetchOneAlbum,
  fetchOneAlbumSongs,
  fetchOneArtist,
  fetchRate,
  fetchUserBasket,
  addBasketProduct,
} from "../http/productAPI";
import Rating from "../components/Rating";
import Comments from "../components/Comments";
import { Context } from "../main.jsx";
import Success from "../components/modals/Success";
import BadAdd from "../components/modals/BadAdd";
import AudioPlayer from "../components/modals/AudioPlayer";

const ProductPage = () => {
  const [product, setAlbum] = useState({ info: [] });
  const [artistName, setArtistName] = useState("");
  const { id } = useParams();
  const { user } = useContext(Context);
  const [basket, setBasket] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showBadAdd, setShowBadAdd] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);

  useEffect(() => {
    const fetchBasket = async () => {
      try {
        if (user.id) {
          const basket = await fetchUserBasket(user.id);
          setBasket(basket);
        } else {
          setShowBadAdd(true);
        }
      } catch (error) {
        console.error("Ошибка получения товаров пользователя:", error.message);
      }
    };
    fetchBasket();
  }, [user.id]);
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
  useEffect(() => {
    fetchOneAlbum(id).then(async (data) => {
      setAlbum(data);
      if (data.artistId) {
        const artistData = await fetchOneArtist(data.artistId);
        setArtistName(artistData.name);
      }
    });
  }, [id]);
  console.log(product);
  const [song, setSong] = useState({ songs: [] });

  useEffect(() => {
    fetchOneAlbumSongs(id).then((data) => {
      setSong({ songs: data });
    });
  }, [id]);
  const [rate, setRate] = useState({ rates: 0 });

  useEffect(() => {
    fetchRate(id).then((data) => {
      setRate({ rates: data });
    });
  }, [id]);
  const [counter, setCounter] = useState(1);
  const handleDecrement = () => {
    if (counter > 1) {
      setCounter(counter - 1);
    }
  };
  const handleIncrement = () => {
    if (counter < product.balance) {
      setCounter(counter + 1);
    }
  };
  const handleAddToCart = async () => {
    const formData = new FormData();
    try {
      formData.append("basketId", basket.id);
      formData.append("productId", product.id);
      formData.append("num", counter);
      if (user.isAuth) {
        const response = await addBasketProduct(formData);
        console.log("Товар добавлен в корзину:", response);
        setShowSuccess(true);
      } else {
        setShowBadAdd(true);
      }
    } catch (error) {
      console.error("Ошибка при добавлении товара в корзину:", error.message);
    }
  };

  const handleListenClick = (song) => {
    setSelectedSong(song);
    setShowPlayer(true);
    setIsPlaying(true); // Устанавливаем isPlaying в true, чтобы начать проигрывание
  };
  return (
    <Container className="mt-3" style={{ marginBottom: "150px" }}>
      {showPlayer && selectedSong && (
        <AudioPlayer
          song={selectedSong}
          handleClose={() => setShowPlayer(false)}
          isPlaying={isPlaying}
        />
      )}
      <Success show={showSuccess} onHide={() => setShowSuccess(false)} />
      <BadAdd show={showBadAdd} onHide={() => setShowBadAdd(false)} />
      <Row>
        <Col md={6}>
          <Image
            className="img-fluid"
            style={{ width: "100%", height: "auto" }}
            src={"http://localhost:5000/" + product.img}
          />
          <Rating product={product} />
          <div className="track-list-container">
            <h3 className="track">Track List</h3>
            <ul className="track-list">
              {song.songs
                .sort((a, b) => a.trackNumber - b.trackNumber) // Сортируем по trackNumber
                .map((song) => (
                  <li key={song.id}>
                    <span className="track-number">{song.trackNumber}.</span>
                    <span className="song-title">{song.title}:</span>
                    <span className="song-duration">{song.duration}</span>
                    <span
                      className="song-duration audio"
                      onClick={() => handleListenClick(song)}
                    >
                      ▶
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        </Col>
        <Col md={6}>
          <Row
            className="d-flex flex-column align-items-center"
            style={{ margin: "2%" }}
          >
            <div
              style={{
                padding: "0px",
                border: "2px solid black",
                background: "white",
              }}
            >
              <h1 className="artist">{artistName}</h1>
              <div>
                <h1 className="title">{product.title}</h1>
              </div>
            </div>
          </Row>
          <Row
            className="d-flex flex-column align-items-center"
            style={{ margin: "2%" }}
          >
            {promotionPrice !== null ? (
              <div className="price">
                <span
                  style={{ textDecoration: "line-through", marginRight: "5px" }}
                >
                  ${product.price}
                </span>
                ${promotionPrice}
              </div>
            ) : (
              <div className="price">${product.price}</div>
            )}
            {/* <div className="price">Price: {product.price}$</div> */}
          </Row>
          <Row
            className="d-flex flex-column align-items-center"
            style={{ margin: "2%" }}
          >
            <div className="price">Rating: {rate.rates}</div>
          </Row>
          <Row
            className="d-flex flex-column align-items-center"
            style={{ margin: "2%" }}
          >
            <Container className="description">
              Including 5 previously unreleased songs from The Vault 1 of 4
              Editions: Collectible album gatefold jacket with unique front and
              back cover art 2 Crystal Skies Blue vinyl discs 1 of 4 Editions:
              Collectible album sleeves including lyrics and never-before-seen
              photos for each version
            </Container>
          </Row>
          <Row
            className="d-flex flex-row align-items-center "
            style={{ padding: "2%" }}
          >
            <Col md={4}>
              <div className="cart">
                <button onClick={handleDecrement} className="cart-button">
                  -
                </button>
                <input
                  type="text"
                  value={counter}
                  readOnly
                  className="cart-input"
                />
                <button onClick={handleIncrement} className="cart-button">
                  +
                </button>
              </div>
            </Col>
            <Col>
              <Button className="add-to-cart-button" onClick={handleAddToCart}>
                Add to cart
              </Button>
            </Col>
          </Row>
          <Row
            className="d-flex flex-row align-items-center "
            style={{ padding: "2%" }}
          >
            <div className="desc">Description</div>

            {product.info?.map((info) => (
              <div className="descChild" key={info.id}>
                {info.title}: {info.description}
              </div>
            ))}
          </Row>
          <Comments product={product} />
        </Col>
      </Row>
    </Container>
  );
};

export default ProductPage;
