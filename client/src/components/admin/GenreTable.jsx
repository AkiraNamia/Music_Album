import React from "react";
import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { Container } from "react-bootstrap";

import { observer } from "mobx-react-lite";
import { fetchGenre } from "../../http/productAPI";
import UpdateGenre from "../modals/UpdateGenre.jsx";

const GenreTable = observer(() => {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null); // Новое состояние
  const [genreEdVisible, setGenreEdVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchGenre();
        setGenres(data);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchData(); // Вызов асинхронной функции
  }, []);
  const handleRowClick = (genreId) => {
    // Найти выбранный альбом по albumId
    console.log(genreId);
    const selected = genres.find((genre) => genre.id === genreId.id);
    setSelectedGenre(selected);
    // Открыть модальное окно
    setGenreEdVisible(true);
  };
  const sortedGenres = genres ? genres.slice().sort((a, b) => a.id - b.id) : [];

  return (
    <Container>
      <div>
        {selectedGenre && (
          <UpdateGenre
            key={selectedGenre.id}
            show={genreEdVisible}
            onHide={() => setGenreEdVisible(false)}
            artist={selectedGenre}
          />
        )}
      </div>
      <Table striped bordered hover style={{ marginBottom: "150px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
          </tr>
        </thead>
        <tbody>
          {sortedGenres?.map((art) => (
            <tr
              key={art.id}
              onClick={() => {
                handleRowClick(art);
              }}
            >
              <td>{art.id}</td>
              <td>{art.name}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
});

export default GenreTable;
