const uuid = require("uuid");
const path = require("path");
const { Album,AlbumInfo,Song,Artist, GenreInfo, Genre, User, Rating, AdminInfo } = require("../models/models");
const ApiError = require("../error/ApiError");
const { where } = require("sequelize");

class AlbumController {
  async create(req, res, next) {
    try {
      let { title, price, balance, cd, info,genres, songs, artistId } = req.body;
      const { img } = req.files;
      let fileName = uuid.v4() + ".jpg";  
      img.mv(path.resolve(__dirname, "..", "static", fileName));

      const album = await Album.create({
        title,
        price,
        balance, 
        cd,
        artistId,
        img: fileName,
      });

      if (info) {
        info = JSON.parse(info)
        info.forEach(i =>
            AlbumInfo.create({
                title: i.title,
                description: i.description,
                albumId: album.id
            }))
    }
    if (genres) {
      genres = JSON.parse(genres);
      genres.forEach(async (genreItem) => {
        const [existingGenre] = await Genre.findOrCreate({
          where: { name: genreItem.name },
        });
    
        const existingGenreInfo = await GenreInfo.findOne({
          where: {
            albumId: album.id,
            genreId: existingGenre.id,
          },
        });
    
        // Создание связи через GenreInfo, если ее еще нет
        if (!existingGenreInfo) {
          await GenreInfo.create({
            albumId: album.id,
            genreId: existingGenre.id,
          });
        }
      });
    }
    if (songs) {
      songs = JSON.parse(songs);
    
      for (const i of songs) {
        const createdSong = await Song.create({
          title: i.title,
          duration: i.duration,
          trackNumber: i.trackNumber,
          albumId: album.id,
          artistId: artistId,
        });
    
        if (i.genres && Array.isArray(i.genres)) {
          for (const genreItem of i.genres) {
        const [existingGenre] = await Genre.findOrCreate({
          where: { name: genreItem },
        });
    
        const existingGenreInfo = await GenreInfo.findOne({
          where: {
            genreId: existingGenre.id,
            songId: createdSong.id,

          },
        });
    
        if (!existingGenreInfo) {
          await GenreInfo.create({
            genreId: existingGenre.id,
            songId: createdSong.id,
          });
        }
          }
        }
      }
    }
    const { has_promotion, is_new_arrival, promotion_price } = req.body;
const hasPromotion = has_promotion || false;
const isNewArrival = is_new_arrival || false;
const promotionPrice = promotion_price || null; 
await AdminInfo.create({
  albumId: album.id,
  has_promotion: hasPromotion,
  is_new_arrival: isNewArrival,
  promotion_price: promotionPrice,
});
      return res.json(album);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
  async updateAlbum(req, res, next) {
    try {
      const { id } = req.params;
      const { title, price, balance, cd, info, songs, genres, artistId } = req.body;
  
      const album = await Album.findOne({where:{id}, include: [
        {
          model: Artist,
          attributes: ['id','name'], // Укажите необходимые атрибуты
        },
        {
          model: Song,
          attributes: ['id', 'title', 'duration', 'trackNumber'],
         // Если вам не нужны какие-либо атрибуты из GenreInfo
              include: [
                {
                  model: Genre,
                  attributes: ['name'],
                },
          ],
        },
        {
          model: Genre,
          attributes: ['id', 'name'], // Укажите необходимые атрибуты
        },
        {
          model: AlbumInfo,
          as: 'info',
          attributes: ['id', 'title', 'description'], // Укажите необходимые атрибуты
        },
        {
          model: Rating,
          attributes: ['rate', 'userId'], // Укажите необходимые атрибуты
        },
        {
          model:AdminInfo,
          attributes: ['id', 'has_promotion', 'promotion_price','is_new_arrival'], 
        }
      ],},);
      if (!album) {
        return res.status(404).json({ message: 'Альбом не найден' });
      }
  
      if (title) album.title = title;
      if (price) album.price = price;
      if (balance) album.balance = balance;
      if (cd) album.cd = cd;
      if (artistId) album.artistId = artistId;
      if (req.files) {
        const { img } = req.files;
        const fileName = uuid.v4() + '.jpg';
        img.mv(path.resolve(__dirname, '..', 'static', fileName));
        album.img = fileName;
      }
  
      await album.save();
  
      if (info) {
        const infoData = JSON.parse(info);
        // Обновить существующие записи AlbumInfo на основе предоставленных данных
        infoData.forEach(async (i) => {
          const existingInfo = await AlbumInfo.findOne({
            where: { id: i.id, albumId: id },
          });
          if (existingInfo) {
            existingInfo.title = i.title;
            existingInfo.description = i.description;
            await existingInfo.save();
          } else {
            // Если запись не найдена, создать новую
            await AlbumInfo.create({
              title: i.title,
              description: i.description,
              albumId: id,
            });
          }
        });
      }
      if (songs) {
        const songData = JSON.parse(songs);
        songData.forEach(async (i) => {
          const existingSong = await Song.findOne({
            where: { id: i.id, albumId: id },
          });
          if (existingSong) {
            existingSong.title = i.title;
            existingSong.duration = i.duration;
            existingSong.trackNumber = i.trackNumber;

            await existingSong.save();
            await GenreInfo.destroy({
              where: { songId: existingSong.id },
            });
            if (i.genres && Array.isArray(i.genres)) {
              for (const genreItem of i.genres) {
                const existingGenre = await Genre.findOne({ where: { name: genreItem.name } });
                if (existingGenre) {
                  // Жанр уже существует - добавляем только связь через GenreInfo
                  const existingGenreInfo = await GenreInfo.findOne({
                    where: {
                      genreId: existingGenre.id,
                      songId: existingSong.id,
                    },

                  });

                  if (!existingGenreInfo) {
                    await GenreInfo.create({
                      genreId: existingGenre.id,
                      songId: existingSong.id,
                    });
                  }
                } else {
                  // Жанра нет в базе - сначала создаем жанр, затем добавляем связь через GenreInfo
                  const newGenre = await Genre.create({ name: genreItem });
            
                  await GenreInfo.create({
                    genreId: newGenre.id,
                    songId: existingSong.id,
                  });
                }
              }
            }
            
          } else {
            // Если запись не найдена, создать новую
            const createdSong = await Song.create({
              title: i.title,
              duration: i.duration,
              trackNumber: i.trackNumber,
              albumId: id,
              artistId: artistId,
            });

            if (i.genres && Array.isArray(i.genres)) {
              for (const genreItem of i.genres) {
               // Проверка существующего жанра
            const [existingGenre] = await Genre.findOrCreate({
              where: { name: genreItem.name },
            });
            // Проверка существующей связи в GenreInfo
            const existingGenreInfo = await GenreInfo.findOne({
              where: {
                genreId: existingGenre.id,
                songId: createdSong.id,
    
              },
            });
            // Создание связи через GenreInfo, если ее еще нет
            if (!existingGenreInfo) {
              await GenreInfo.create({
                genreId: existingGenre.id,
                songId: createdSong.id,
              });
            }
              }
            }
          }
        });
      }
      if (genres) {
        const genreData = JSON.parse(genres);
        genreData.forEach(async (genreItem) => {
          // Проверка существующего жанра
          const [existingGenre] = await Genre.findOrCreate({
            where: { name: genreItem.name },
          });
      
          // Проверка существующей связи в GenreInfo
          const existingGenreInfo = await GenreInfo.findOne({
            where: {
              albumId: album.id,
              genreId: existingGenre.id,
            },
          });
      
          // Создание связи через GenreInfo, если ее еще нет
          if (!existingGenreInfo) {
            await GenreInfo.create({
              albumId: album.id,
              genreId: existingGenre.id,
            });
          }
        });
      }
      const { has_promotion, is_new_arrival, promotion_price } = req.body;
      if (has_promotion || is_new_arrival || promotion_price) {
        let albumFulfillment = await AdminInfo.findOne({ where: { albumId: album.id } });
  
        if (!albumFulfillment) {
          albumFulfillment = await AdminInfo.create({
            albumId: album.id,
            has_promotion,
            is_new_arrival,
            promotion_price,
          });
        } else {
          albumFulfillment.has_promotion = has_promotion;
          albumFulfillment.is_new_arrival = is_new_arrival;
          albumFulfillment.promotion_price = promotion_price;
          await albumFulfillment.save();
        }
      }
      return res.json({ message: 'Альбом успешно обновлен' ,album});
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
  
  async delete(req, res) {
    try {
        const {id} = req.params;
        await Album.findOne({where:{id}})
            .then( async data => {
                if(data) {
                    await Album.destroy({where:{id}}).then(() => {
                        return res.json("Album deleted");
                    })
                } else {
                    return res.json("This Album doesn't exist in DB");
                }
            })
    } catch (e) {
        return res.json(e);
    }
}

  async getAll(req, res) {
    let {artistId,genre} = req.query
    let albums;
    if(!artistId && !genre)
    {
        albums=await Album.findAll()
    }
    if(artistId && !genre)
    {
        albums=await Album.findAndCountAll({where:{artistId}})
    }
    if(!artistId && genre)
    {
        albums=await Album.findAndCountAll({include:[{
          model: Genre,
          attributes: ['name'],
          where:{name:genre}
        }]})
    }
    if(artistId && genre)
    {
        albums=await Album.findAndCountAll({where:{artistId}, include:[{
          model: Genre,
          attributes: ['name'],
          where:{name:genre}
        }]})
    }

    return res.json(albums);
  }
  async getAllWithoutPages(req, res) {
    const albums=await Album.findAndCountAll()

    return res.json(albums);
  }
  async getAllForAdm(req, res) {
    const albums = await Album.findAll({
      include: [
        {
          model: Artist,
          attributes: ['id','name'],
        },
        {
          model: Song,
          attributes: ['id', 'title', 'duration', 'trackNumber'],
              include: [
                {
                  model: Genre,
                  attributes: ['name'],
                },
          ],
        },
        {
          model: Genre,
          attributes: ['name'],
        },
        {
          model: AlbumInfo,
          as: 'info',
          attributes: ['id', 'title', 'description'],
        },
        {
          model: Rating,
          attributes: ['rate', 'userId'],
        },
        {
          model: AdminInfo,
          attributes: ['id', 'has_promotion', 'promotion_price','is_new_arrival'], 
        },
      ],
    });
  
    return res.json(albums);
  }
  async getSale(req, res) {
    const albums = await Album.findAll({
      include: [
        {
          model: Artist,
          attributes: ['id','name'],
        },
        {
          model: Song,
          attributes: ['id', 'title', 'duration', 'trackNumber'],
              include: [
                {
                  model: Genre,
                  attributes: ['name'],
                },
          ],
        },
        {
          model: Genre,
          attributes: ['name'],
        },
        {
          model: AlbumInfo,
          as: 'info',
          attributes: ['id', 'title', 'description'],
        },
        {
          model: Rating,
          attributes: ['rate', 'userId'],
        },
        {
          model: AdminInfo,
          attributes: ['id', 'has_promotion', 'promotion_price','is_new_arrival'], 
          where:{has_promotion:true}
        },
      ],
    });
  
    return res.json(albums);
  }
  async getNew(req, res) {
    const albums = await Album.findAll({
      include: [
        {
          model: Artist,
          attributes: ['id','name'],
        },
        {
          model: Song,
          attributes: ['id', 'title', 'duration', 'trackNumber'],
              include: [
                {
                  model: Genre,
                  attributes: ['name'],
                },
          ],
        },
        {
          model: Genre,
          attributes: ['name'],
        },
        {
          model: AlbumInfo,
          as: 'info',
          attributes: ['id', 'title', 'description'],
        },
        {
          model: Rating,
          attributes: ['rate', 'userId'],
        },
        {
          model: AdminInfo,
          attributes: ['id', 'has_promotion', 'promotion_price','is_new_arrival'], 
          where:{is_new_arrival:true}
        },
      ],
    });
  
    return res.json(albums);
  }
  async getOne(req, res) {
    const { id } = req.params;
    const album = await Album.findOne(
      {
          where: {id},
          include: [{model: AlbumInfo, as: 'info'}, {
            model: AdminInfo,
            attributes: ['id', 'has_promotion', 'promotion_price','is_new_arrival'], 
          },]
      },
     
  )
  return res.json(album)
}
async getSongsByAlbumId(req, res, err) {
  const albumId = req.params.id; // Извлекаем albumId из параметров запроса
  try {
    const songs = await Song.findAll({ where: { albumId }, 
      include: [
      {
        model: Genre,
        attributes: ['name'],
      },
     
        {model:Album,include:[{model:Artist, attributes:['name']}]},
      
], }); 
    res.json(songs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
async getAlbumRate(req, res, err) {
  
  const albumId = req.params.id; 
    const ratingAlbum = await Rating.findAll({ where: { albumId } });
const sum = ratingAlbum.reduce((accumulator, currentValue) => accumulator + currentValue.rate, 0);
const totalRatings = ratingAlbum.length;
const averageRating = sum / totalRatings;
const roundedRating = Math.round(averageRating * 100) / 100; // Округление до сотых

    res.json(roundedRating);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

  
};



module.exports = new AlbumController();
