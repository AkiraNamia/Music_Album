import React, { useState, useEffect } from "react";
import "../../css/audioPlayer.css";
import { Button } from "react-bootstrap";

const AudioPlayer = ({ song, handleClose, isPlaying }) => {
  const [audio] = useState(new Audio());
  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => {
    if (song.audio) {
      if (isPlaying) {
        audio.src = "http://localhost:5000/" + song.audio;
        audio.play().catch((error) => {
          console.log("Error while playing audio:", error);
          window.location.reload();
        });
      } else {
        audio.pause();
        audio.currentTime = 0;
      }
    } else {
      alert("Аудио файла не существует");
      window.location.reload();
    }
    const timer = setTimeout(() => {
      audio.pause();
      setIsEnded(true);

      setTimeout(() => {
        handleClose();
      }, 2000); // Закрытие плеера после 2 секунд
    }, 15000); // Остановка проигрывания после 15 секунд

    return () => {
      clearTimeout(timer);
      audio.pause();
      audio.currentTime = 0;
    };
  }, [audio, song, handleClose, isPlaying]);
  if (!song.audio) {
    return null; // Возвращаем null, если нет аудио
  }
  console.log(song);
  return (
    <div className={`audio-player ${isEnded ? "hidden" : ""}`}>
      <p>
        {song.album && song.album.artist
          ? `${song.album.artist.name} - ${song.title}`
          : ""}
      </p>
      <Button variant="light" onClick={() => handleClose()}>
        Stop
      </Button>
    </div>
  );
};

export default AudioPlayer;
