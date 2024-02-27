const uuid = require("uuid");
const path = require("path");
const { Album,AlbumInfo,Song,Artist, GenreInfo,Genre, User, Rating } = require("../models/models");
const ApiError = require("../error/ApiError");
const { where } = require("sequelize");

class InfoController {
    async deleteInfo(req, res) {
        try {
            const {id} = req.params;
            await AlbumInfo.findOne({where:{id}})
                .then( async data => {
                    if(data) {
                          await AlbumInfo.destroy({where:{id}}).then(() => {
                            return res.json("AlbumInfo deleted");
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
        const info = await AlbumInfo.findAll();
        return res.json(info);
      }
}
module.exports = new InfoController();
