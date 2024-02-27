const { Basket_product } = require("../models/models");
const ApiError = require("../error/ApiError");

class Basket_productController {
  async create(req, res) {
    const { basketId, albumId,number } = req.body;
    const basket_pr = await Basket_product.create({ basketId, albumId,number });
    return res.json(basket_pr);
  }

  async getAll(req, res) {
    const baskets = await Basket_product.findAll();
    return res.json(baskets);
  }

}

module.exports = new Basket_productController();
