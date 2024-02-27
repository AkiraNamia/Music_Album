import React from "react";
import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { Container } from "react-bootstrap";

import { observer } from "mobx-react-lite";
import { fetchArtist } from "../../http/productAPI";
import UpdateArtist from "../modals/UpdateArtist.jsx";

const ArtistTable = observer(() => {
  const [artists, setArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null); // Новое состояние
  const [artistEdVisible, setArtistEdVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchArtist();
        setArtists(data);
      } catch (error) {
        console.error("Error fetching moderators:", error);
      }
    };

    fetchData(); // Вызов асинхронной функции
  }, []);
  const handleRowClick = (artistId) => {
    // Найти выбранный альбом по albumId
    console.log(artistId);
    const selected = artists.find((artist) => artist.id === artistId.id);
    setSelectedArtist(selected);
    // Открыть модальное окно
    setArtistEdVisible(true);
  };
  const sortedArtists = artists
    ? artists.slice().sort((a, b) => a.id - b.id)
    : [];

  return (
    <Container>
      <div>
        {selectedArtist && (
          <UpdateArtist
            key={selectedArtist.id}
            show={artistEdVisible}
            onHide={() => setArtistEdVisible(false)}
            artist={selectedArtist}
          />
        )}
      </div>
      <Table striped bordered hover style={{ marginBottom: "150px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {sortedArtists?.map((art) => (
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

export default ArtistTable;
