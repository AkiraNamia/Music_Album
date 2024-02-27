const uuid = require("uuid");
const path = require("path");
const {
  Album,
  Comment,
  Song,
  Artist,
  GenreInfo,
  Genre,
  User,
  Rating,
} = require("../models/models");
const ApiError = require("../error/ApiError");
class CommentController {
  async addAlbumComment(req, res, next) {
    try {
      const { description, userId, albumId } = req.body;
      if (description && userId && albumId) {
        const album = await Album.findOne({
          where: { id: albumId },
        });
        const user = await User.findOne({
          where: { id: userId },
        });
        if (!album) {
          return res.status(404).json({ message: "Альбом не найден" });
        }
        if (!user) {
          return res.status(404).json({ message: "User не найден" });
        }
        try {
         
            await Comment.create({ albumId, userId, description: description });
  
            return res.json({ message: "Комментарий для альбома добавлен" });
          
        } catch (error) {
          next(ApiError.badRequest(error.message + "sdfsdn"));
        }
        console.log("ex " + existingRating.rate);
        
      } else {
        console.log("com " + description);
        console.log("al " + albumId);
        console.log("us " + userId);
      }
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
  async getAll(req, res) {
    const desc = await Comment.findAll();

    return res.json(desc);
  }
  async getCommentForAlbum(req, res, next) {
    const { albumId } = req.params;
    try {
      const albumComment = await Comment.findAll({
        where: { albumId },
        include: [
            {
              model: User,
              attributes: ['name'],
            },]
      });
      return res.json(albumComment);
    } catch (error) {
      next(ApiError.badRequest(error.message));
      console.log(" dsd " + albumId);
    }
  }
  async delete(req, res) {
    try {
        const {id} = req.params;
        await Comment.findOne({where:{id}})
            .then( async data => {
                if(data) {
                    await Comment.destroy({where:{id}}).then(() => {
                        return res.json("Comment deleted");
                    })
                } else {
                    return res.json("This Commment doesn't exist in DB");
                }
            })
    } catch (e) {
        return res.json(e);
    }
}
}
module.exports = new CommentController();
