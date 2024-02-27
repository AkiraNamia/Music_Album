const ApiError = require("../error/ApiError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, Basket, Order, OrderInfo,Album,Artist } = require("../models/models");

class ModerController {
  async getAll(req, res) {
    const orders = await Order.findAll(
        {include: [
            {
              model: OrderInfo,
              as: "info",
            },
            {
              model: Album,
              include:[{model:Artist, attributes:['name'],}]

            },
            {
                model: Basket,
               include:[{model:User, attributes:['email'],}],

              },
          ],}
    );
    return res.json(orders);
  }
}

module.exports = new ModerController();
