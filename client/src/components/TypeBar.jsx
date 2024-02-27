import React, { useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../main";
import ListGroup from "react-bootstrap/ListGroup";
import { Button, Card } from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";
import "../css/typeBar.css";
import { fetchAlbums, fetchAlbumsForAdmin } from "../http/productAPI";

const TypeBar = observer(() => {
  const { product } = useContext(Context);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedArtists, setSelectedArtists] = useState([]);

  if (!product.genres || !Array.isArray(product.genres)) {
    return (
      <ListGroup>
        <ListGroup.Item>No genres available</ListGroup.Item>
      </ListGroup>
    );
  }
  const toggleGenre = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(
        selectedGenres.filter((selectedGenre) => selectedGenre !== genre)
      );
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
    console.log(selectedGenres);
  };

  const toggleArtist = (artist) => {
    if (selectedArtists.includes(artist)) {
      setSelectedArtists(
        selectedArtists.filter((selectedArtist) => selectedArtist !== artist)
      );
    } else {
      setSelectedArtists([...selectedArtists, artist]);
    }
  };

  const applyFilter = () => {
    if (selectedArtists.length > 0) {
      const artistIds = selectedArtists.map((artist) => artist.id);
      fetchAlbums(artistIds, null).then((data) => {
        product.setAlbums(data.rows);
        product.setTotalCount(data.count);
        console.log(data.rows);
      });
    }
    if (selectedGenres.length > 0) {
      const genres = selectedGenres.map((genre) => genre.name);

      fetchAlbums(null, genres).then((data) => {
        product.setAlbums(data.rows);
        product.setTotalCount(data.count);
        console.log(data.rows);
      });
    }
    if (selectedGenres.length > 0 && selectedArtists.length > 0) {
      const genres = selectedGenres.map((genre) => genre.name);
      const artistIds = selectedArtists.map((artist) => artist.id);

      fetchAlbums(artistIds, genres).then((data) => {
        product.setAlbums(data.rows);
        product.setTotalCount(data.count);
        console.log(data.rows);
      });
    }

    if (selectedArtists.length <= 0 && selectedGenres.length <= 0) {
      fetchAlbumsForAdmin().then((data) => {
        product.setAlbums(data);
        // product.setTotalCount(data.count);
      });
    }
  };

  return (
    <Card className="mb-3 mx-auto card ">
      <Accordion defaultActiveKey="0" alwaysOpen>
        <Accordion.Item eventKey="0" className="accordion">
          <Accordion.Header>Genres</Accordion.Header>
          <Accordion.Body>
            <ListGroup>
              {product.genres.map((genre) => (
                <ListGroup.Item
                  key={genre.id}
                  style={{ cursor: "pointer" }}
                  active={selectedGenres.includes(genre)}
                  onClick={() => toggleGenre(genre)}
                >
                  {genre.name}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1" className="accordion">
          <Accordion.Header>Artists</Accordion.Header>
          <Accordion.Body>
            <ListGroup>
              {product.artists.map((artist) => (
                <ListGroup.Item
                  key={artist.id}
                  style={{ cursor: "pointer" }}
                  active={selectedArtists.includes(artist)}
                  onClick={() => toggleArtist(artist)}
                >
                  {artist.name}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <Button className="but" onClick={applyFilter}>
        Apply
      </Button>
    </Card>
  );
});

export default TypeBar;
