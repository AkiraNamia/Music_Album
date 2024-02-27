const uuid = require("uuid");
const path = require("path");
const {
  Album,
  AlbumInfo,
  Song,
  Artist,
  GenreInfo,
  Genre,
  User,
  Rating,
} = require("../models/models");
const ApiError = require("../error/ApiError");
class RatingController {
  async addAlbumRating(req, res, next) {
    try {
      const { newRating, userId, albumId } = req.body;
      if (newRating && userId && albumId) {
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
          const existingRating = await Rating.findOne({
            where: { albumId, userId },
          });
          if (existingRating) {
            await Rating.update(
              { rate: newRating },
              {
                where: { albumId, userId },
              }
            );
            {
              console.log("ex " + newRating);
            }
            return res.json({ message: "Рейтинг для альбома обновлен" });
          } else {
            await Rating.create({ albumId, userId, rate: newRating });
  
            return res.json({ message: "Рейтинг для альбома добавлен" });
          }
        } catch (error) {
          next(ApiError.badRequest(error.message + "sdfsdn"));
        }
        console.log("ex " + existingRating.rate);
        
      } else {
        console.log("rate" + newRating);
        console.log("al" + albumId);
        console.log("us" + userId);
      }
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
  async getAll(req, res) {
    const rating = await Rating.findAll();

    return res.json(rating);
  }
  async getUserRatingForAlbum(req, res, next) {
    const { albumId, userId } = req.query;
    try {
      const userRating = await Rating.findOne({
        where: { userId, albumId },
      });
      return res.json(userRating);
    } catch (error) {
      next(ApiError.badRequest(error.message));
      console.log(userId + " dsd " + albumId);
    }
  }
  
}
module.exports = new RatingController();
