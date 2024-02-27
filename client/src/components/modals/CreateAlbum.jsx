import React, { useContext, useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Button, Dropdown, Form, Row, Col, FormLabel } from "react-bootstrap";
import { Context } from "../../main";
import { createAlbum, fetchArtist, fetchGenre } from "../../http/productAPI";
import { observer } from "mobx-react-lite";

const CreateAlbum = observer(({ show, onHide }) => {
  const { product } = useContext(Context);
  const [info, setInfo] = useState([]);
  const [songs, setSongs] = useState([]);
  const [genres, setGenres] = useState([]);
  const [price, setPrice] = useState(0);
  const [num, setNumber] = useState(0);
  const [cd, setCd] = useState(0);
  const [file, setFile] = useState(null);

  const [title, setTitle] = useState("");
  // Состояния для валидации полей
  const [titleValid, setTitleValid] = useState(false);
  const [titleError, setTitleError] = useState("");
  const [titleTouched, setTitleTouched] = useState(false);
  const [priceValid, setPriceValid] = useState(false);
  const [priceError, setPriceError] = useState("");
  const [priceTouched, setPriceTouched] = useState(false);
  const [numberValid, setNumberValid] = useState(false);
  const [numberError, setNumberError] = useState("");
  const [numberTouched, setNumberTouched] = useState(false);
  const [fileValid, setFileValid] = useState(false);
  const [fileError, setFileError] = useState("");
  const [fileTouched, setFileTouched] = useState(false);
  const [artistValid, setArtistValid] = useState(false);
  const [artistError, setArtistError] = useState("");
  const [artistTouched, setArtistTouched] = useState(false);
  const [genreValid, setGenreValid] = useState(false);
  const [genreError, setGenreError] = useState("");
  const [genreTouched, setGenreTouched] = useState(false);
  const [songValid, setSongValid] = useState(false);
  const [songError, setSongError] = useState("");
  const [songTouched, setSongTouched] = useState(false);
  const [isFormValid, setIsFormValid] = useState(true);
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [songErrors, setSongErrors] = useState([]);

  const [hasPromotion, setHasPromotion] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [promotionPrice, setPromotionPrice] = useState(0);

  useEffect(() => {
    fetchArtist().then((data) => product.setArtists(data));
  }, [product]);
  useEffect(() => {
    fetchGenre().then((data) => setGenres(data));
  }, []);
  const addInfo = () => {
    setInfo([...info, { title: "", description: "", number: Date.now() }]);
  };
  const removeInfo = (number) => {
    setInfo(info.filter((i) => i.number !== number));
  };
  const changeInfo = (key, value, number) => {
    setInfo(
      info.map((i) => (i.number === number ? { ...i, [key]: value } : i))
    );
  };

  const removeSong = (number) => {
    setSongs(songs.filter((i) => i.number !== number));
  };
  const changeSong = (key, value, number) => {
    setSongs(
      songs.map((i) => (i.number === number ? { ...i, [key]: value } : i))
    );
  };

  const selectFile = (e) => {
    setFile(e.target.files[0]);
    console.log(file);
  };
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedSongGenres, setSelectedSongGenres] = useState({});

  const handleGenreChange = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(
        selectedGenres.filter((selected) => selected !== genre)
      );
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleSongGenreChange = (genre, songNumber, key) => {
    setSelectedSongGenres((prevGenres) => {
      const updatedGenres = { ...prevGenres };

      if (updatedGenres[songNumber]) {
        if (updatedGenres[songNumber].includes(genre)) {
          updatedGenres[songNumber] = updatedGenres[songNumber].filter(
            (selectedGenre) => selectedGenre !== genre
          );
        } else {
          updatedGenres[songNumber] = [...updatedGenres[songNumber], genre];
        }
      } else {
        updatedGenres[songNumber] = [genre];
      }

      return updatedGenres;
    });

    setSongs((prevSongs) =>
      prevSongs.map((song) =>
        song.number === songNumber
          ? {
              ...song,
              [key]: song[key].includes(genre)
                ? song[key].filter((selectedGenre) => selectedGenre !== genre)
                : [...song[key], genre],
            }
          : song
      )
    );
  };

  const addSong = () => {
    const newSong = {
      title: "",
      duration: "",
      trackNumber: "",
      genres: [],
      number: Date.now(),
    };
    setSongs([...songs, newSong]);
    setSongErrors([
      ...songErrors,
      {
        titleError: "",
        durationError: "",
        trackNumberError: "",
        songGenreError: "",
      },
    ]);
    console.log(newSong);
  };
  const validateSongs = () => {
    const errors = songs.map((song) => {
      const error = {
        titleError: "",
        durationError: "",
        trackNumberError: "",
        songGenreError: "",
      };

      if (!song.title.trim()) {
        error.titleError = "Введите название песни";
      }

      if (!song.duration.trim()) {
        error.durationError = "Введите продолжительность песни";
      }

      if (!song.trackNumber) {
        error.trackNumberError = "Введите порядковый номер в альбоме";
      }
      if (selectedSongGenres[song.number]?.length === undefined) {
        error.songGenreError = "Выберите жанр песни";
      }
      console.log(selectedSongGenres[song.number]?.length);

      return error;
    });

    setSongErrors(errors);
  };
  const addAlbum = () => {
    setTitleTouched(true);
    setPriceTouched(true);
    setNumberTouched(true);
    setFileTouched(true);
    setArtistTouched(true);
    setGenreTouched(true);
    setSongTouched(true);

    if (!title.trim()) {
      setTitleValid(false);
      setTitleError("Название альбома не может быть пустым");
    } else {
      setTitleValid(true);
      setTitleError("");
    }
    if (!price) {
      setPriceValid(false);
      setPriceError("Укажите цену альбома");
    } else {
      setPriceValid(true);
      setPriceError("");
    }
    if (!num) {
      setNumberValid(false);
      setNumberError("Укажите остаток");
    } else {
      setNumberValid(true);
      setNumberError("");
    }
    if (!file) {
      setFileValid(false);
      setFileError("Выберите обложку");
    } else {
      setFileValid(true);
      setFileError("");
    }
    if (!product.selectedArtist.name) {
      setArtistValid(false);
      setArtistError("Выберите артиста");
    } else {
      setArtistValid(true);
      setArtistError("");
    }
    if (selectedGenres.length === 0) {
      setGenreValid(false);
      setGenreError("Выберите жанры");
    } else {
      setGenreValid(true);
      setGenreError("");
    }
    if (songs.length === 0) {
      setSongValid(false);
      setSongError("Добавьте песни");
    } else {
      songs.forEach((song) => {
        if (
          !song.title.trim() ||
          !song.duration.trim() ||
          !song.trackNumber ||
          selectedSongGenres[song.number]?.length === undefined
        ) {
          setSongValid(false);
          setSongError("Заполните поля");
        } else {
          setSongValid(true);
          setSongError("");
        }
      });
    }
    validateSongs();

    const formData = new FormData();

    if (
      titleValid &&
      priceValid &&
      numberValid &&
      fileValid &&
      artistValid &&
      genreValid &&
      songValid
    ) {
      try {
        formData.append("title", title);
        formData.append("price", `${price}`);
        formData.append("balance", `${num}`);
        formData.append("cd", `${cd}`);
        formData.append("img", file);
        formData.append("artistId", product.selectedArtist.id);
        formData.append("info", JSON.stringify(info));
        formData.append("songs", JSON.stringify(songs));

        formData.append("genres", JSON.stringify(selectedGenres));
        formData.append("has_promotion", hasPromotion);
        formData.append("is_new_arrival", isNewArrival);
        if (hasPromotion) {
          formData.append("promotion_price", promotionPrice);
        }
        createAlbum(formData).then((data) => onHide());
        alert("Album was successfully added!");
      } catch (e) {
        alert(e);
      }
      setIsFormValid(true);
      setFormErrorMessage("");
    } else {
      setIsFormValid(false);
      setFormErrorMessage("Данные не корректны");
    }
  };
  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Добавить альбом
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row className="mb-3 align-items-center">
            <Col md={3}>
              <FormLabel>Title:</FormLabel>
            </Col>
            <Col md={9}>
              <Form.Control
                className={`mt-3 ${
                  titleTouched && !titleValid ? "is-invalid" : ""
                }`}
                placeholder={"Введите название альбома"}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {!titleValid && (
                <div className="invalid-feedback">{titleError}</div>
              )}{" "}
            </Col>
          </Row>
          <Row className="mb-3 align-items-center">
            <Col md={3}>
              <FormLabel>Cost:</FormLabel>
            </Col>
            <Col md={9}>
              <Form.Control
                className={`mt-3 ${
                  priceTouched && !priceValid ? "is-invalid" : ""
                }`}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
                placeholder={"Введите цену"}
              />
            </Col>
          </Row>
          {!priceValid && <div className="invalid-feedback">{priceError}</div>}
          <Row className="mb-3 align-items-center">
            <Col md={3}>
              <FormLabel>Balance:</FormLabel>
            </Col>
            <Col md={9}>
              <Form.Control
                value={num}
                onChange={(e) => setNumber(e.target.value)}
                type="number"
                placeholder={"Введите остаток на складе"}
                className="mt-3"
              />
            </Col>
          </Row>
          {!numberValid && (
            <div className="invalid-feedback">{numberError}</div>
          )}
          <Row className="mb-3 align-items-center">
            <Col md={3}>
              <FormLabel>Cd:</FormLabel>
            </Col>
            <Col md={9}>
              <Form.Control
                value={cd}
                onChange={(e) => setCd(e.target.value)}
                type="number"
                placeholder={"Введите Cd"}
                className="mt-3"
              />
            </Col>
          </Row>
          <Row className="mb-3 align-items-center">
            <Col md={3}>
              <FormLabel>Cover:</FormLabel>
            </Col>
            <Col md={9}>
              <Form.Control
                placeholder={"Добавьте картинку"}
                className="mt-3"
                type="file"
                onChange={selectFile}
              />
              {!fileValid && (
                <div className="invalid-feedback">{fileError}</div>
              )}
            </Col>
          </Row>
          <Dropdown className="mt-2 mb-2">
            <Dropdown.Toggle>
              {product.selectedArtist.name || "Выберите исполнителя"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {product.artists.map((artist) => (
                <Dropdown.Item
                  onClick={() => product.setSelectedArtist(artist)}
                  key={artist.id}
                >
                  {artist.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          {!artistValid && (
            <div className="invalid-feedback">{artistError}</div>
          )}
          <hr />{" "}
          <Row className="mb-3 align-items-center">
            <Col md={3}>
              <FormLabel>Genre:</FormLabel>
            </Col>
            <Col md={9}></Col>{" "}
            {genres.map((genreItem) => (
              <Form.Check
                key={genreItem.id}
                type="checkbox"
                id={genreItem.id}
                label={genreItem.name}
                checked={selectedGenres.includes(genreItem)}
                onChange={() => handleGenreChange(genreItem)}
              ></Form.Check>
            ))}
          </Row>
          {!genreValid && <div className="invalid-feedback">{genreError}</div>}
          <hr />
          <Button variant={"outline-dark"} className="mb-3" onClick={addInfo}>
            Добавить новое свойство
          </Button>
          {info.map((i) => (
            <Row className="mt-4 mb-3 align-items-center" key={i.number}>
              <Col md={3}>
                {" "}
                <FormLabel>Title:</FormLabel>
              </Col>
              <Col md={9}>
                <Form.Control
                  value={i.title}
                  onChange={(e) =>
                    changeInfo("title", e.target.value, i.number)
                  }
                  placeholder="Введите название свойства"
                />
              </Col>
              <Col md={3}>
                {" "}
                <FormLabel>Description:</FormLabel>
              </Col>
              <Col md={9}>
                <Form.Control
                  value={i.description}
                  onChange={(e) =>
                    changeInfo("description", e.target.value, i.number)
                  }
                  placeholder="Введите описание свойства"
                  className="mt-3"
                />
              </Col>
              <Col md={4}>
                <Button
                  onClick={() => removeInfo(i.number)}
                  variant={"outline-danger"}
                  className="mt-3 mb-3"
                >
                  Удалить
                </Button>
              </Col>
              <hr />
            </Row>
          ))}
          <Button variant={"outline-dark"} onClick={addSong}>
            Добавить песню
          </Button>
          {!songValid && <div className="invalid-feedback">{songError}</div>}
          {songs.map((i, index) => (
            <Row className="mt-4" key={i.number}>
              <Col md={3}>
                {" "}
                <FormLabel>Title:</FormLabel>
              </Col>
              <Col md={9}>
                <Form.Control
                  value={i.title}
                  onChange={(e) =>
                    changeSong("title", e.target.value, i.number)
                  }
                  placeholder="Введите название песни"
                  className="mt-3"
                />
                {songErrors[index]?.titleError && (
                  <div>{songErrors[index]?.titleError}</div>
                )}
              </Col>
              <Col md={3}>
                {" "}
                <FormLabel>Duration:</FormLabel>
              </Col>

              <Col md={9}>
                <Form.Control
                  value={i.duration}
                  onChange={(e) =>
                    changeSong("duration", e.target.value, i.number)
                  }
                  placeholder="Введите продолжительность песни"
                  className="mt-3"
                />
                {songErrors[index]?.durationError && (
                  <div>{songErrors[index]?.durationError}</div>
                )}
              </Col>
              <Col md={3}>
                {" "}
                <FormLabel>Track Number:</FormLabel>
              </Col>

              <Col md={9}>
                <Form.Control
                  value={i.trackNumber}
                  onChange={(e) =>
                    changeSong("trackNumber", e.target.value, i.number)
                  }
                  type="number"
                  placeholder="Введите порядковый номер в альбоме"
                  className="mt-3"
                />
                {songErrors[index]?.trackNumberError && (
                  <div>{songErrors[index]?.trackNumberError}</div>
                )}
              </Col>
              <Row className="mt-2">
                <Col md={3}>
                  {" "}
                  <FormLabel>Genre:</FormLabel>
                </Col>

                {genres.map((genreItem) => (
                  <Col key={genreItem} md={3}>
                    <Form.Check
                      key={genreItem.id}
                      type="checkbox"
                      id={genreItem.id}
                      label={genreItem.name}
                      checked={
                        selectedSongGenres[i.number]?.includes(
                          genreItem.name
                        ) || false
                      }
                      onChange={() =>
                        handleSongGenreChange(
                          genreItem.name,
                          i.number,
                          "genres"
                        )
                      }
                    />
                  </Col>
                ))}
                {songErrors[index]?.songGenreError && (
                  <div>{songErrors[index]?.songGenreError}</div>
                )}
              </Row>
              <Col md={4}>
                <Button
                  onClick={() => removeSong(i.number)}
                  variant={"outline-danger"}
                  className="mt-3"
                >
                  Удалить
                </Button>
              </Col>
              <hr className="mt-3" />
            </Row>
          ))}
          <Row className="mb-3 align-items-center">
            <Col md={3}>
              <FormLabel>Promotion:</FormLabel>
            </Col>
            <Col md={9}>
              <Form.Check
                type="checkbox"
                label="Has Promotion"
                checked={hasPromotion}
                onChange={(e) => setHasPromotion(e.target.checked)}
              />
            </Col>
          </Row>
          {hasPromotion && (
            <Row className="mb-3 align-items-center">
              <Col md={3}>
                <FormLabel>Promotion Price:</FormLabel>
              </Col>
              <Col md={9}>
                <Form.Control
                  value={promotionPrice}
                  onChange={(e) => setPromotionPrice(e.target.value)}
                  type="number"
                  placeholder={"Enter Promotion Price"}
                  className="mt-3"
                />
              </Col>
            </Row>
          )}
          <Row className="mb-3 align-items-center">
            <Col md={3}>
              <FormLabel>New Arrival:</FormLabel>
            </Col>
            <Col md={9}>
              <Form.Check
                type="checkbox"
                label="Is New Arrival"
                checked={isNewArrival}
                onChange={(e) => setIsNewArrival(e.target.checked)}
              />
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={onHide}>
          Закрыть
        </Button>
        <Button variant="outline-success" onClick={addAlbum}>
          Добавить
        </Button>
        {!isFormValid && (
          <div style={{ color: "red", marginTop: "0.5rem" }}>
            {formErrorMessage}
          </div>
        )}
      </Modal.Footer>
    </Modal>
  );
});

export default CreateAlbum;
