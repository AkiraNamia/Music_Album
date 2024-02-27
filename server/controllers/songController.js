const { Song,Genre,GenreInfo, Album, Artist } = require("../models/models");
const ApiError = require("../error/ApiError");
const { where } = require("sequelize");
const uuid = require("uuid");
const path = require("path");

class SongController {
  async create(req, res) {
    try {
      const { title, duration, trackNumber, artistId, albumId, genres } = req.body;
      const song = await Song.create({ title, duration, trackNumber, artistId, albumId });
  
      if (genres) {
        for (const genreItem of genres) {
          const [existingGenre] = await Genre.findOrCreate({
            where: { name: genreItem.name },
          });
  
          const existingGenreInfo = await GenreInfo.findOne({
            where: {
              songId: song.id,
              genreId: existingGenre.id,
            },
          });
  
          if (!existingGenreInfo) {
            await GenreInfo.create({
              songId: song.id,
              genreId: existingGenre.id,
            });
          }
        }
      }
  
      return res.json(song);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  
  async delete(req, res) {
    try {
        const {id} = req.params;
        await Song.findOne({where:{id}})
            .then( async data => {
                if(data) {
                    await Song.destroy({where:{id}}).then(() => {
                        return res.json("Song deleted");
                    })
                } else {
                    return res.json("This Song doesn't exist in DB");
                }
            })
    } catch (e) {
        return res.json(e);
    }
}
async deleteInfo(req, res) {
  try {
    const { id: songId } = req.params;
    const { name } = req.body;
    console.log(name, songId);
    await Genre.findOne({
      where: { name: name },
    }).then(async (data) => {
      if (data) {
        // Если жанр найден, удаляем запись в GenreInfo
        await GenreInfo.destroy({
          where: { genreId: data.id, songId: songId },
        }).then(() => {
          return res.json("GenreInfo deleted");
        });
      } else {
        // Если жанр не найден, обрабатываем ошибку или выполняем необходимые действия
        console.error(`Жанр с названием ${name} не найден`);
      }
    });
  } catch (e) {
    return res.json(e);
  }
}
  async getAll(req, res) {
    const songs = await Song.findAll({ include:[
      {model:Album,include:[{model:Artist, attributes:['name']}]},
    ]});
    return res.json(songs);
  }

  async getForModer(req, res, next) {
    const song = await Song.findAll(
      {
          include:[
            {model:Album,include:[{model:Artist, attributes:['name']}]},
          ]
      },)
      if (!song) {
        return res.status(404).json({ message: 'Песня не найдена' });
      }

    res.json(song);
  }
  async addSongAudio(req, res, next) {
    try{
    const { id } = req.params;
    const { audio } = req.files;
    console.log(audio)
    let fileName = uuid.v4() + ".mp3";  
    audio.mv(path.resolve(__dirname, "..", "static", fileName));
    const song = await Song.findOne(
      {
          where: {id},
          include:[{model:Album}]
      },
     
  )
  if (!song) {
    return res.status(404).json({ message: 'Песня не найдена' });
  }

  song.audio = fileName;
  await song.save();
  console.log(song.audio)

  return res.json(song);
} catch (error) {
  console.error(error.message);
  return res.status(500).json({ message: 'Ошибка сервера' });
}
}
}
module.exports = new SongController();
