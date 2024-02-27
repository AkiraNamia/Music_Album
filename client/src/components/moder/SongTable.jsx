import React from "react";
import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { observer } from "mobx-react-lite";
import { fetchSongsForModer } from "../../http/productAPI";
import { Button, Container } from "react-bootstrap";
import "../../css/albumTable.css";
import AddAudioModal from "./AddAudio.jsx";
import AudioPlayer from "../modals/AudioPlayer";

const SongTable = observer(() => {
  const [songs, setSongs] = useState([]);

  const [selectedOrder, setSelectedOrder] = useState(null); // Новое состояние
  const [orderEdVisible, setOrderEdVisible] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchSongsForModer();
        setSongs(data);
      } catch (error) {
        alert("Error fetching songs:", error);
      }
    };

    fetchData();
    console.log(songs);
  }, [songs]);
  const updateStatusClick = async (songId, event) => {
    event.stopPropagation();
    const selected = songs.find((song) => song.id === songId);
    setSelectedOrder(selected);
    setOrderEdVisible(true);
  };
  // const handlePlayAudio = (audioPath) => {
  //   if (audioPath){

  //   const audio = new Audio('http://localhost:5000/' + audioPath);
  //   audio.play();

  //   // Проигрывать только 15 секунд
  //   setTimeout(() => {
  //     audio.pause();
  //     audio.currentTime = 0; // Вернуть время воспроизведения на начало
  //   }, 15000); // 15
  // } else{alert("Аудио файла не существует")}
  // };

  const handleListenClick = (song) => {
    setSelectedSong(song);
    setShowPlayer(true);
    setIsPlaying(true); // Устанавливаем isPlaying в true, чтобы начать проигрывание
    console.log(selectedSong);
  };

  const sortedsongs = songs ? songs.slice().sort((a, b) => a.id - b.id) : [];
  console.log(sortedsongs);
  return (
    <Container>
      <div>
        {selectedOrder && (
          <AddAudioModal
            key={selectedOrder.id}
            show={orderEdVisible}
            handleClose={() => setOrderEdVisible(false)}
            song={selectedOrder}
          />
        )}
        {showPlayer && selectedSong && (
          <AudioPlayer
            song={selectedSong}
            handleClose={() => setShowPlayer(false)}
            isPlaying={isPlaying}
          />
        )}
      </div>
      <Table striped bordered hover style={{ marginBottom: "150px" }}>
        <thead>
          <tr className="headers">
            <th className="header">ID</th>
            <th>Title</th>
            <th>Track Number</th>
            <th>Duration</th>
            <th>Album</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sortedsongs?.map((song) => (
            <tr key={song.id}>
              <td>{song.id}</td>
              <td>{song.title}</td>
              <td>{song.trackNumber}</td>
              <td>{song.duration}</td>
              <td>{song.album?.title}</td>
              <td>
                <Button
                  className="but"
                  onClick={(event) => updateStatusClick(song.id, event)}
                >
                  Добавить аудио
                </Button>
              </td>
              <td>
                <Button className="but" onClick={() => handleListenClick(song)}>
                  Прослушать
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
});

export default SongTable;
