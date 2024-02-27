import React, { useContext, useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import {
  Button,
  Dropdown,
  Form,
  Row,
  Col,
  FormLabel,
  Image,
} from "react-bootstrap";
import { Context } from "../../main";
import {
  deleteGenreInfo,
  deleteInfo,
  deleteSong,
  deleteSongGenre,
  editAlbum,
  fetchArtist,
  fetchGenre,
  fetchOneAlbumSongs,
} from "../../http/productAPI";
import { observer } from "mobx-react-lite";
import ConfirmDelete from "./ConfirmDelete";

// import SongGenresComponent from "./SongGenresComponent";
const UpdateAlbum = observer(({ show, onHide, album }) => {
  const { product } = useContext(Context);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteVisible, setIsDeleteVisible] = useState(false);
  const [isEditVisible, setIsEditVisible] = useState(true);
  const [info, setInfo] = useState(album.info || []);
  const [song, setSong] = useState(album.songs || []);
  const [genres, setGenres] = useState(album.genres || []);
  const [selectedArtist, setSelectedArtist] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [file, setFile] = useState(null);
  const hasPromotionValue =
    album.adminInfos.map((i) => i.has_promotion) || false;
  const isNewArrivalValue =
    album.adminInfos.map((i) => i.is_new_arrival) || false;
  const promotionPriceValue =
    album.adminInfos.map((i) => i.promotion_price) || false;
  console.log(hasPromotionValue);
  const [hasPromotion, setHasPromotion] = useState(
    hasPromotionValue[0] || false
  );
  const [isNewArrival, setIsNewArrival] = useState(
    isNewArrivalValue[0] || false
  );
  const [promotionPrice, setPromotionPrice] = useState(
    promotionPriceValue[0] || null
  );
  console.log(hasPromotion);

  console.log(album.adminInfos);
  useEffect(() => {
    fetchArtist().then((data) => product.setArtists(data));
    if (!album.artist || !album.artist.name) {
      setSelectedArtist("Artist not found");
    } else {
      setSelectedArtist(album.artist.name);
      console.log(selectedArtist);
    }
  }, [album.artist, product, selectedArtist]);
  useEffect(() => {
    fetchGenre().then((data) => product.setGenres(data));
  }, [product, selectedArtist]);
  useEffect(() => {
    fetchOneAlbumSongs(album.id).then((data) => setSong(data));
  }, [album.id]);
  const [formData, setFormData] = useState({
    title: "",
    price: 0,
    balance: 0,
    cd: 0,
    genres: "",
    info: "",
    songs: "",
    artistId: "",
    img: null,
    hasPromotion: false,
    isNewArrival: false,
    promotionPrice: null,
  });

  useEffect(() => {
    setFormData({
      title: album.title || "",
      price: album.price || 0,
      balance: album.balance || 0,
      cd: album.cd || 0,
      genres: JSON.stringify(album.genres) || "",
      info: JSON.stringify(album.info) || "",
      songs: JSON.stringify(album.songs) || "",
      artistId: album.artist ? album.artist.id || "" : "",
      img: album.img || null,
      hasPromotion: album.adminInfos.map((i) => i.has_promotion) || false,
      isNewArrival: album.adminInfos.map((i) => i.is_new_arrival) || false,
      promotionPrice: album.adminInfos.map((i) => i.promotion_price) || null,
    });
  }, [album]);
  console.log(formData.hasPromotion);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleInfoChange = (key, value, id) => {
    // Обновите info в соответствии с внесенными изменениями
    const updatedInfo = info.map((i) =>
      i.id === id ? { ...i, [key]: value } : i
    );
    setInfo(updatedInfo);
    album.info = updatedInfo;
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFormData({
      ...formData,
      img: file,
    });
    console.log(file);
  };
  useEffect(() => {
    if (file) {
      const updatedFormData = { ...formData, img: file };
      setFormData(updatedFormData);
    }
    console.log(file);
  }, [file, formData]);
  const editAlbumHandler = async () => {
    try {
      const formDataEnd = new FormData();
      formDataEnd.append("title", formData.title || "");
      formDataEnd.append("price", formData.price || 0);
      formDataEnd.append("balance", formData.balance || 0);
      formDataEnd.append("cd", formData.cd || 0);
      formDataEnd.append("artistId", formData.artistId || "");
      formDataEnd.append("info", JSON.stringify(info));
      formDataEnd.append("songs", JSON.stringify(song));
      formDataEnd.append("genres", JSON.stringify(genres));
      formDataEnd.append("has_promotion", hasPromotion);
      formDataEnd.append("is_new_arrival", isNewArrival);
      if (hasPromotion) {
        formDataEnd.append("promotion_price", promotionPrice);
      }
      if (file) {
        formDataEnd.append("img", file);
      }

      const id = album.id;
      const response = await editAlbum(id, formDataEnd);
      alert("Album was successfully edited!", response);
      onHide();
    } catch (error) {
      console.error("Ошибка при редактировании альбома:", error);
    }
  };

  const addInfo = () => {
    setInfo([...info, { title: "", description: "", id: Date.now() }]);
  };
  const addSong = () => {
    const newSong = {
      id: Date.now(), // Замени это на создание уникального идентификатора для новой песни
      title: "",
      duration: "",
      trackNumber: "",
      genres: [], // Пустой массив для жанров новой песни
    };

    // Добавляем новую песню в список
    setSong([...song, newSong]);

    const updatedSongs = [
      ...formData.songs,
      { ...newSong, genres: newSong.genres.map((genre) => ({ name: genre })) },
    ];
    setFormData({
      ...formData,
      songs: updatedSongs,
    });

    setFormData({
      ...formData,
      songs: updatedSongs,
    });
    // Также можешь установить флаг, который покажет форму редактирования новой песни
    // setIsEditing(true);
  };

  const removeInfo = async (id) => {
    try {
      const response = await deleteInfo(id);
      if (response) {
        const updatedInfo = info.filter((i) => i.id !== id);
        setInfo(updatedInfo);
        setFormData({
          ...formData,
          info: JSON.stringify(updatedInfo),
        });
        console.log(updatedInfo);
      } else {
        console.error("Не удалось удалить информацию");
      }
    } catch (error) {
      console.error("Ошибка при удалении информации:", error);
    }
  };
  const removeSong = async (id) => {
    try {
      const response = await deleteSong(id);
      if (response) {
        const updatedSong = song.filter((i) => i.id !== id);
        setSong(updatedSong);
        setFormData({
          ...formData,
          songs: JSON.stringify(updatedSong),
        });
        console.log(updatedSong);
      } else {
        console.error("Не удалось удалить информацию");
      }
    } catch (error) {
      console.error("Ошибка при удалении информации:", error);
    }
  };
  const removeGenre = async (name) => {
    try {
      const id = album.id;

      const response = await deleteGenreInfo(id, { name: name });
      console.log(name);
      console.log(response);
      if (response) {
        // Оставьте только тот жанр, который был удален
        const updatedGenre = genres.filter((genre) => genre.name !== name);
        console.log(genres.filter((i) => i.id !== id));
        setGenres(updatedGenre);
        setFormData({
          ...formData,
          genres: JSON.stringify(updatedGenre),
        });
        // console.log(updatedGenre);
      } else {
        console.error("Не удалось удалить информацию");
      }
    } catch (error) {
      console.error("Ошибка при удалении информации:", error);
    }
  };
  const handleRemoveGenre = (songId, genreName, song) => {
    const updatedSongs = sortedsongs.map((s) => {
      if (s.id === song.id) {
        const updatedGenres = s.genres.filter(
          (genre) => genre.name !== genreName
        );
        return { ...s, genres: updatedGenres };
      }
      return s;
    });

    setSong(updatedSongs);
  };

  const handleAddGenre = (songId) => {
    const updatedSongs = sortedsongs.map((song) => {
      if (song.id === songId) {
        const updatedGenres = song.genres.slice(); // Копия существующих жанров
        updatedGenres.push(""); // Добавляем пустой жанр, чтобы отобразить новое меню

        return { ...song, genres: updatedGenres };
      }
      return song;
    });
    console.log(song);
    setSong(updatedSongs);
    setFormData({
      ...formData,
      songs: JSON.stringify(updatedSongs),
    });
  };

  const addGenre = () => {
    setGenres([...genres, { name: "", id: Date.now() }]);
  };
  const handleSongChange = (key, value, id) => {
    // Обновите info в соответствии с внесенными изменениями
    const updatedSong = song.map((i) =>
      i.id === id ? { ...i, [key]: value } : i
    );
    setSong(updatedSong);
    setFormData({
      ...formData,
      songs: JSON.stringify(updatedSong),
    });
    //  album.songs = updatedSong;
  };
  const handleGenreChange = (index, selectedGenre) => {
    const updatedGenres = [...genres];
    updatedGenres[index] = selectedGenre;
    setGenres(updatedGenres);

    // Обновите formData соответственно, включив в него только id выбранного жанра
    setFormData({
      ...formData,
      genres: JSON.stringify(updatedGenres.map((genre) => genre.name)),
    });
  };
  const handleSongGenreChange = (songId, selectedGenre, song, key) => {
    const updatedGenres = song.genres.map((genre) => {
      if (genre.name === songId.name) {
        return selectedGenre; // Заменяем существующий жанр
      }
      return genre;
    });
    console.log(updatedGenres);

    const updatedSongs = {
      ...song,
      [key]: updatedGenres,
    };
    console.log(updatedSongs);

    const updatedSongList = sortedsongs.map((s) =>
      s.id === song.id ? updatedSongs : s
    );

    setSong(updatedSongList);
    console.log(song);
  };
  const handleArtistChange = (key, selectedArtistId) => {
    setSelectedArtist(selectedArtistId.name);
    album.artist = selectedArtistId;

    setFormData({
      ...formData,
      [key]: album.artist.id,
    });
  };
  const sortedsongs = song
    ? song.slice().sort((a, b) => a.trackNumber - b.trackNumber)
    : [];
  const sortedinfo = info ? info.slice().sort((a, b) => a.id - b.id) : [];

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Detailed information
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row className="mb-3 align-items-center justify-content-center">
            <Image
              style={{ width: "50%", height: "auto" }}
              src={"http://localhost:5000/" + album.img}
            />
          </Row>
          <Row className="mb-3 align-items-center">
            <Col md={3}>
              <FormLabel>Title:</FormLabel>
            </Col>
            <Col md={9}>
              <Form.Control
                placeholder={"Enter title of album"}
                value={formData.title}
                name="title"
                disabled={!isEditing}
                onChange={handleInputChange}
              />
            </Col>
          </Row>
          <Row className="mb-3 align-items-center">
            <Col md={3}>
              <FormLabel>Cost:</FormLabel>
            </Col>
            <Col md={9}>
              <Form.Control
                placeholder={"Enter price"}
                value={formData.price}
                name="price"
                type="number"
                disabled={!isEditing}
                onChange={handleInputChange}
              />
            </Col>
          </Row>
          <Row className="mb-3 align-items-center">
            <Col md={3}>
              <FormLabel>Balance:</FormLabel>
            </Col>
            <Col md={9}>
              <Form.Control
                placeholder={"Enter balance"}
                value={formData.balance}
                type="number"
                name="balance"
                disabled={!isEditing}
                onChange={handleInputChange}
              />
            </Col>
          </Row>
          {/* <Row className="mb-3 align-items-center">
            <Col md={3}>
              <FormLabel>Cd:</FormLabel>
            </Col>
            <Col md={9}>
              <Form.Control
                placeholder={"Введите Cd"}
                value={formData.cd}
                type="number"
                name="cd"
                disabled={!isEditing}
                onChange={handleInputChange}
              />
            </Col>
          </Row> */}
          <Row className="mb-3 align-items-center">
            <Col md={3}>
              <FormLabel>Image:</FormLabel>
            </Col>
            <Col md={9}>
              <Form.Control
                type="file"
                disabled={!isEditing}
                name="img"
                onChange={handleFileChange}
              />
            </Col>
          </Row>
          <Row>
            <Col md={3}>
              <FormLabel>Artist:</FormLabel>
            </Col>
            <Col>
              <Dropdown className="mt-2 mb-2">
                <Dropdown.Toggle
                  style={{ background: "black", border: "2px solid black" }}
                >
                  {selectedArtist || "Choose an artist"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {product.artists.map((artist) => (
                    <Dropdown.Item
                      onClick={() => handleArtistChange("artistId", artist)}
                      key={artist.id}
                      disabled={!isEditing}
                    >
                      {artist.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>
          <hr />
          <h1 style={{ textAlign: "center" }}>Genre</h1>
          <Button
            onClick={addGenre}
            variant={"outline-dark"}
            disabled={!isEditing}
            style={{ display: isDeleteVisible ? "block" : "none" }}
          >
            Add new genre
          </Button>

          {genres.map((genreItem, index) => (
            <Row className="mt-4" key={genreItem.id}>
              <Col md={3}>
                <FormLabel>Name:</FormLabel>
              </Col>
              <Col>
                <Dropdown>
                  <Dropdown.Toggle
                    style={{ background: "black", border: "2px solid black" }}
                  >
                    {genreItem.name || "Choose genre"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {product.genres?.map((genre) => (
                      <Dropdown.Item
                        onClick={() => handleGenreChange(index, genre)}
                        key={genre.id}
                        disabled={!isEditing}
                      >
                        {genre.name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
              <Col md={4}>
                <Button
                  onClick={() => removeGenre(genreItem.name)}
                  variant={"outline-danger"}
                  style={{
                    display: isDeleteVisible ? "block" : "none",
                    background: "white",
                    border: "2px solid black",
                    color: "black",
                  }}
                >
                  Delete
                </Button>
              </Col>
            </Row>
          ))}

          <hr />
          <h1 style={{ textAlign: "center" }}>Information</h1>
          <Button
            onClick={addInfo}
            variant={"outline-dark"}
            disabled={!isEditing}
            style={{ display: isDeleteVisible ? "block" : "none" }}
          >
            Add new propertie{" "}
          </Button>
          {sortedinfo.map((i) => (
            <Row className="mt-4" key={i.id}>
              <Col md={3}>
                {" "}
                <FormLabel>Title:</FormLabel>
              </Col>

              <Col md={9}>
                <Form.Control
                  value={i.title}
                  placeholder="Enter property title"
                  disabled={!isEditing}
                  onChange={(e) =>
                    handleInfoChange("title", e.target.value, i.id)
                  }
                />
              </Col>
              <Col md={3}>
                {" "}
                <FormLabel>Description:</FormLabel>
              </Col>

              <Col md={9}>
                <Form.Control
                  value={i.description}
                  placeholder="Enter property description"
                  disabled={!isEditing}
                  onChange={(e) =>
                    handleInfoChange("description", e.target.value, i.id)
                  }
                  className="mt-3"
                />
              </Col>
              <Col md={4}>
                <Button
                  onClick={() => removeInfo(i.id)}
                  disabled={!isEditing}
                  style={{
                    display: isEditing ? "block" : "none",
                    background: "white",
                    border: "2px solid black",
                    color: "black",
                  }}
                  className="mt-3"
                >
                  Delete
                </Button>
              </Col>
              <hr className="mt-3" />
            </Row>
          ))}

          <h1 style={{ textAlign: "center" }}>Songs</h1>
          <Button
            variant={"outline-dark"}
            disabled={!isEditing}
            style={{ display: isDeleteVisible ? "block" : "none" }}
            onClick={addSong}
          >
            Add new song
          </Button>
          {sortedsongs.map((i, index) => (
            <Row className="mt-4" key={i.id}>
              <Col md={3}>
                {" "}
                <FormLabel>Title:</FormLabel>
              </Col>

              <Col md={9}>
                <Form.Control
                  value={i.title}
                  placeholder="Enter song title"
                  disabled={!isEditing}
                  onChange={(e) =>
                    handleSongChange("title", e.target.value, i.id)
                  }
                />
              </Col>
              <Col md={3}>
                {" "}
                <FormLabel>Duration:</FormLabel>
              </Col>

              <Col md={9}>
                <Form.Control
                  value={i.duration}
                  placeholder="Enter song duration"
                  disabled={!isEditing}
                  onChange={(e) =>
                    handleSongChange("duration", e.target.value, i.id)
                  }
                  className="mt-3"
                />
              </Col>
              <Col md={3}>
                {" "}
                <FormLabel>Track Number:</FormLabel>
              </Col>

              <Col md={9}>
                <Form.Control
                  value={i.trackNumber}
                  placeholder="Enter track number"
                  disabled={!isEditing}
                  onChange={(e) =>
                    handleSongChange("trackNumber", e.target.value, i.id)
                  }
                  className="mt-3"
                />
              </Col>
              <Col md={4}>
                <Button
                  onClick={() => handleAddGenre(i.id)}
                  variant="outline-primary"
                  style={{
                    display: isEditing ? "block" : "none",
                    background: "#E3E3E3",
                    border: "2px solid black",
                    color: "black",
                  }}
                  className="mt-3"
                >
                  Add genre
                </Button>
              </Col>
              <Row mt={3} style={{ textAlign: "center" }}>
                {" "}
                <h3 className="mt-3">Genre of song</h3>
              </Row>

              {i.genres?.map((songId, genreIndex) => (
                <Row key={`${songId.id}-${genreIndex}`} className="mt-4">
                  <Col md={3}>
                    {" "}
                    <FormLabel>Title:</FormLabel>
                  </Col>

                  <Col md={5}>
                    <Dropdown>
                      <Dropdown.Toggle
                        style={{
                          background: "black",
                          border: "2px solid black",
                        }}
                      >
                        {songId.name || "Choose a genre"}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {product.genres?.map((genre) => (
                          <Dropdown.Item
                            key={genre.id}
                            disabled={!isEditing}
                            onClick={() =>
                              handleSongGenreChange(songId, genre, i, "genres")
                            }
                          >
                            {genre.name}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Col>
                  <Col md={4}>
                    <Button
                      onClick={() => handleRemoveGenre(i.id, songId.name, i)}
                      style={{
                        display: isEditing ? "block" : "none",
                        background: "white",
                        border: "2px solid black",
                        color: "black",
                      }}
                    >
                      Delete
                    </Button>
                  </Col>
                </Row>
              ))}
              <Row className="mt-4">
                <Col md={16}>
                  <Button
                    onClick={() => removeSong(i.id)}
                    variant={"outline-danger"}
                    style={{
                      display: isDeleteVisible ? "block" : "none",
                      background: "black",
                      border: "2px solid black",
                      color: "white",
                    }}
                  >
                    Drop the song
                  </Button>
                </Col>
              </Row>
              <hr className="mt-4" />
            </Row>
          ))}

          <h1 style={{ textAlign: "center" }}>Rates</h1>

          {album.ratings.map((i) => (
            <Row className="mt-4" key={i.number}>
              <Col md={3}>
                {" "}
                <FormLabel>Rate:</FormLabel>
              </Col>

              <Col md={9}>
                <Form.Control
                  value={i.rate}
                  placeholder="Enter rate"
                  disabled={!isEditing}
                />
              </Col>
              <Col md={3}>
                {" "}
                <FormLabel>UserId:</FormLabel>
              </Col>

              <Col md={9}>
                <Form.Control
                  value={i.userId}
                  placeholder="Enter User id"
                  disabled={!isEditing}
                  className="mt-3"
                />
              </Col>

              <Col md={4}>
                <Button
                  variant={"outline-danger"}
                  style={{
                    display: isDeleteVisible ? "block" : "none",
                    background: "white",
                    border: "2px solid black",
                    color: "black",
                  }}
                  className="mt-3"
                >
                  Delete
                </Button>
              </Col>
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
                disabled={!isEditing}
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
                  disabled={!isEditing}
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
                disabled={!isEditing}
                onChange={(e) => setIsNewArrival(e.target.checked)}
              />
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button className="but" variant="outline-danger" onClick={onHide}>
          Close
        </Button>
        <Button
          className="but"
          variant="outline-danger"
          onClick={() => {
            setConfirmDelete(true);
          }}
        >
          {" "}
          Delete
        </Button>
        <ConfirmDelete
          key={album.id}
          artist={album}
          show={confirmDelete}
          onHide={() => {
            setConfirmDelete(false);
          }}
        />

        <Button
          onClick={() => {
            setIsEditing(true);
            setIsDeleteVisible(true);
            setIsEditVisible(false);
          }}
          className="but"
          variant="outline-success"
          style={{ display: isEditVisible ? "block" : "none" }}
        >
          Edit
        </Button>
        <Button
          className="but"
          variant="outline-primary"
          style={{ display: isEditing ? "block" : "none" }}
          onClick={() => {
            // Логика сохранения данных
            setIsEditing(false);
            setIsEditVisible(true);
            setIsDeleteVisible(false);
            editAlbumHandler();
          }}
        >
          Save
        </Button>

        <Button
          className="but"
          variant="outline-danger"
          style={{ display: isEditing ? "block" : "none" }}
          onClick={() => {
            setIsEditing(false);
            setIsDeleteVisible(false);
            setIsEditVisible(true);
          }}
        >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default UpdateAlbum;
