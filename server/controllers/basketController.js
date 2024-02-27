const { Basket, Basket_product, Album, Artist } = require("../models/models");
const ApiError = require("../error/ApiError");

class BasketController {
  async create(req, res) {
    const { userId } = req.body;
    const basket = await Basket.create({ userId });
    return res.json(basket);
  }

  async getAll(req, res) {
    const baskets = await Basket.findAll();
    return res.json(baskets);
  }
  async getBasketByUserId (req,res) {
    const{id}=req.params
    try {
      const basket = await Basket.findOne({ where: { userId:id } });
      return res.json(basket);;
    } catch (error) {
      console.error(error.message)
    }
  };
  async getBasketProduct (req,res) {
    const{id}=req.params

    try {
      const basket = await Basket.findOne({ where: { userId:id }, include: [
        {
          model: Album,
          include:[{model:Artist, attributes:['name'],}]
        },] });
      // if(basket){
      //   const basketProduct = await Basket_product.findAll({ where: { basketId:basket.id },   });
      // }
      return res.json(basket);
    } catch (error) {
      console.error(error.message)
    }
  };
  async addProductToBasket(req, res) {
    const { basketId, productId, num } = req.body;
    const parsedNum = parseInt(num, 10); 
    
    if (isNaN(parsedNum)) {
      return res.status(400).json({ message: 'Неверный формат числа' });
    }
  
    try {
      const album = await Album.findByPk(productId);
  
      if (!album) {
        return res.status(404).json({ message: 'Альбом не найден' });
      }
  
      const basketProduct = await Basket_product.findOne({ 
        where: { 
          basketId: basketId,
          albumId: productId
        } 
      });
  
      if (basketProduct) {
        basketProduct.number += parsedNum; 
        await basketProduct.save();
      } else {
        const newBasketProduct = await Basket_product.create({ 
          basketId, 
          albumId: productId, 
          number: parsedNum 
        });
      }
  
      album.balance -= parsedNum; 
      await album.save();
  
      return res.json({ message: 'Товар успешно добавлен в корзину' });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ message: "Произошла ошибка при добавлении товара в корзину" });
    }
  };
  async deleteProduct(req, res) {
    const { basketId, productId } = req.body;
  
    try {
      const basketProduct = await Basket_product.findOne({ 
        where: { 
          basketId: basketId,
          albumId: productId
        } 
      });
  
      if (!basketProduct) {
        return res.status(404).json({ message: 'Товар не найден в корзине' });
      }
  
      const album = await Album.findByPk(productId);
  
      if (!album) {
        return res.status(404).json({ message: 'Альбом не найден' });
      }
  
      const { number } = basketProduct;
      await basketProduct.destroy();
  
      // Увеличение остатка товара в таблице Album
      album.balance += number; // Увеличиваем количество остатка на количество удаленного товара
      await album.save();
  
      return res.json({ message: 'Товар успешно удален из корзины' });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ message: "Произошла ошибка при удалении товара из корзины" });
    }
  };
  
  async updateNumber(req,res){
    const { id } = req.params;
    const { number, albumId } = req.body;
  
    try {
      const basketProduct = await Basket_product.findOne({
        where: { basketId: id, albumId:albumId }
      });
  
      if (!basketProduct) {
        return res.status(404).json({ message: 'Товар в корзине не найден' });
      }
    // Получите текущий остаток товара
    const album = await Album.findByPk(albumId);

    if (!album) {
      return res.status(404).json({ message: 'Альбом не найден' });
    }

    const quantityDifference = number - basketProduct.number;

      basketProduct.number = number;
      await basketProduct.save();
      album.balance = album.balance - quantityDifference;
      await album.save();
      return res.json(basketProduct); 
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  

}

module.exports = new BasketController();
