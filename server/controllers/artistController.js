const {Artist, Album} = require('../models/models')
const ApiError=require('../error/ApiError')

class ArtistController{
    async create(req,res,next){

const {name}=req.body
try{
const artist=await Artist.create({name:name})
return res.json(artist)} catch (e) {
    next(ApiError.badRequest(e.message));
  }
    }
    async edit(req,res){
        try {
            const {id} = req.params;
            const { name } = req.body;

        const artist = await Artist.findOne({where:{id}})
        if (!artist) {
            return res.status(404).json({ message: 'Артист не найден' });
          }
          if(name) artist.name=name;
          await artist.save()
          return res.json({ message: 'Артист успешно обновлен' ,artist});

        } catch (e) {
            return res.json(e);
        }
    }
    async delete(req, res) {
      try {
          const {id} = req.params;
          await Artist.findOne({where:{id}})
              .then( async data => {
                  if(data) {
                      await Artist.destroy({where:{id}}).then(() => {
                          return res.json("Artist deleted");
                      })
                  } else {
                      return res.json("This Artist doesn't exist in DB");
                  }
              })
      } catch (e) {
          return res.json(e);
      }
  }
    async getAll(req,res){
        const artists=await  Artist.findAll()
        return res.json(artists)
    }

    async getOne(req, res) {
        const { id } = req.params;
        const artist = await Artist.findOne(
          {
              where: {id},
          },
      )
      return res.json(artist)
    }
    async getAlbumByArtistId(req, res, err) {
        const artistId = req.params.id; // Извлекаем albumId из параметров запроса
        try {
          const album = await Album.findAll({ where: { artistId } }); // Выполняем запрос к базе данных, используя albumId
          res.json(album);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      };
}

module.exports= new ArtistController();
