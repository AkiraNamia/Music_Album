const { Genre, GenreInfo } = require("../models/models");
const ApiError = require("../error/ApiError");

class GenreController {
  async create(req, res) {
    const { name } = req.body;
    try{
    const genre = await Genre.create({ name});
    return res.json(genre); } 
    catch (e) {
      return res.json(e.message);
    }

    
  }
  async deleteInfo(req, res) {
    try {
      const { id: alId } = req.params;
      const { name } = req.body;
      console.log(name, alId);
      await Genre.findOne({
        where: { name: name },
      }).then(async (data) => {
        if (data) {
          // Если жанр найден, удаляем запись в GenreInfo
          await GenreInfo.destroy({
            where: { genreId: data.id, albumId: alId },
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
  async delete(req, res) {
    try {
      const { id } = req.params;

      const genre = await Genre.findOne({
        where: { id },
      });
      console.log(genre.id);

      if (genre) {
        await Genre.destroy({
          where: { id: genre.id },
        });
        return res.json("Genre deleted");
      } else {
        console.error(`Жанр с названием ${name} не найден`);
      }
    } catch (e) {
      return res.json(e);
    }
  }
  async getAll(req, res) {
    const genres = await Genre.findAll();
    return res.json(genres);
  }
  async getOne(req, res) {
    const { id } = req.params;
    const genre = await Genre.findOne({
      where: { id },
    });
    return res.json(genre);
  }
  async edit(req,res){
    try {
        const {id} = req.params;
        const { name } = req.body;

    const genre = await Genre.findOne({where:{id}})
    if (!genre) {
        return res.status(404).json({ message: 'Жанр не найден' });
      }
      if(name) genre.name=name;
      await genre.save()
      return res.json({ message: 'Жанр успешно обновлен' ,genre});

    } catch (e) {
        return res.json(e);
    }
}
}

module.exports = new GenreController();
