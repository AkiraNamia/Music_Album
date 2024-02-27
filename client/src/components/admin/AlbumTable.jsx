import React from "react";
import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { observer } from "mobx-react-lite";
import Image from "react-bootstrap/Image";
import { fetchAlbumsForAdmin } from "../../http/productAPI";
import UpdateAlbum from "../modals/UpdateAlbum.jsx";
import { Container } from "react-bootstrap";
import "../../css/albumTable.css";

const AlbumTable = observer(() => {
  const [albums, setAlbums] = useState([]);

  const [selectedAlbum, setSelectedAlbum] = useState(null); // Новое состояние
  const [albumEdVisible, setAlbumdEdVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAlbumsForAdmin();
        setAlbums(data);
      } catch (error) {
        console.error("Error fetching albums:", error);
      }
    };

    fetchData();
    console.log(albums);
  }, [albums]);

  const handleRowClick = (albumId) => {
    const selected = albums.find((album) => album.id === albumId);
    setSelectedAlbum(selected);
    setAlbumdEdVisible(true);
  };

  const sortedAlbums = albums ? albums.slice().sort((a, b) => a.id - b.id) : [];
  return (
    <Container>
      <div>
        {selectedAlbum && (
          <UpdateAlbum
            key={selectedAlbum.id}
            show={albumEdVisible}
            onHide={() => setAlbumdEdVisible(false)}
            album={selectedAlbum}
          />
        )}
      </div>
      <Table striped bordered hover style={{ marginBottom: "150px" }}>
        <thead>
          <tr className="headers">
            <th className="header">ID</th>
            <th>Image</th>
            <th>Title</th>
            <th>Price</th>
            <th>Balance</th>
            <th>Cd</th>
            <th>Artist</th>
            <th>Rating</th>
            <th>Genre</th>
            <th>Songs</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {sortedAlbums?.map((album) => (
            <tr
              key={album.id}
              onClick={() => {
                handleRowClick(album.id);
              }}
            >
              <td>{album.id}</td>
              <td>
                <Image
                  width={50}
                  height={50}
                  src={"http://localhost:5000/" + album.img}
                />
              </td>
              <td>{album.title}</td>
              <td>{album.price}</td>
              <td>{album.balance}</td>
              <td>{album.cd}</td>
              <td>{album.artist?.name}</td>
              <td>
                {album.ratings?.map((rate) => (
                  <li key={rate.id}>
                    <span className="track-number">Rate:{rate.rate}</span>
                    <span className="song-title">By user:{rate.userId}</span>
                  </li>
                ))}
              </td>
              <td className="genre">
                {album.genres.map((genre) => (
                  <span className="song-duration">{genre.name}</span>
                ))}
              </td>
              <td>
                <ul>
                  {album.songs
                    .sort((a, b) => a.trackNumber - b.trackNumber)
                    .map((song) => (
                      <li key={song.id}>
                        <span className="track-number">
                          {song.trackNumber}.
                        </span>
                        <span className="song-title">{song.title}:</span>
                        <span className="song-duration">{song.duration}</span>
                        <span className="song-duration">
                          {song.genres.name}
                        </span>
                        <ul>
                          {song.genres.map((genreInfo) => (
                            <li key={genreInfo.id}>{genreInfo.name}</li>
                          ))}
                        </ul>
                      </li>
                    ))}
                </ul>
              </td>
              <td>
                <ul>
                  {album.info
                    .sort((a, b) => a.id - b.id)
                    .map((info) => (
                      <li key={info.id}>
                        <span className="song-title">{info.title}:</span>
                        <span className="song-duration">
                          {info.description}
                        </span>
                      </li>
                    ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
});

export default AlbumTable;
