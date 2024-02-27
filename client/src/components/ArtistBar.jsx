import React, { useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../main";
import ListGroup from "react-bootstrap/ListGroup";
import { Button } from "react-bootstrap";

const ArtistBar = observer(() => {
  const { product } = useContext(Context);
  const [selectedArtists, setSelectedArtists] = useState([]);

  if (!product.artists || !Array.isArray(product.artists)) {
    return (
      <ListGroup>
        <ListGroup.Item>No artists available</ListGroup.Item>
      </ListGroup>
    );
  }

  const toggleArtist = (artist) => {
    if (selectedArtists.includes(artist)) {
      selectedArtists(
        selectedArtists.filter((selectedArtist) => selectedArtist !== artist)
      );
    } else {
      setSelectedArtists([...selectedArtists, artist]);
    }
  };

  const applyFilter = () => {
    // Выполните здесь фильтрацию продуктов по выбранным жанрам и обновите состояние в соответствии с результатами.
    // Например, product.setFilteredProducts(filteredProducts);
  };

  return (
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
      <Button onClick={applyFilter} variant="primary">
        Применить фильтр
      </Button>
    </ListGroup>
  );
});

export default ArtistBar;
