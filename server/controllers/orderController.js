const {
  Basket,
  Basket_product,
  Album,
  Artist,
  Order,
  OrderInfo,
  Order_product,
  User
} = require("../models/models");
const ApiError = require("../error/ApiError");
const sequelize = require("../db");
const nodemailer = require('nodemailer'); 



function sendEmail(email, orderId) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: false,
    service: 'Gmail',
    auth: {
        user: "olgaksenzhik@gmail.com",
        pass: "igbtqxihxobwytxs"
    }
});


  // Тело письма
  const mailOptions = {
    from: 'olgaksenzhik@gmail.com',
    to: email,
    subject: 'ALBUM.BY',
    text: `Пожалуйста, оплатите заказ №${orderId}`
  };

  // Отправка письма
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

class OrderController {
  async create(req, res, next) {
    try {
      let { totalAmount, paymentType, basketId, info } = req.body;

      await sequelize.transaction(async (t) => {
        // Создание заказа
        const order = await Order.create(
          {
            order_date: Date.now(),
            status: "Заказ создан",
            totalAmount: totalAmount,
            paymentType: paymentType,
            basketId: basketId,
          },
          { transaction: t }
        );

        if (info) {
          info = JSON.parse(info);
          const orderInfoPromises = info.map(async (i) => {
            OrderInfo.create(
              {
                country: i.country,
                firstName: i.firstName,
                lastName: i.lastName,
                city: i.city,
                countryRegion: i.countryRegion,
                address: i.address,
                zipCode: i.zipCode,
                phoneNumber: i.phoneNumber,
                orderId: order.id,
              },
              { transaction: t }
            );
          });

          await Promise.all(orderInfoPromises);
        }
        const basketProducts = await Basket_product.findAll({
          where: { basketId: basketId },
        });
        const orderProductPromises = basketProducts.map(async (product) => {
          await Order_product.create(
            {
              orderId: order.id,
              albumId: product.albumId,
              number: product.number,
            },
            { transaction: t }
          );

          await Basket_product.destroy({
            where: { basketId: basketId, albumId: product.albumId },
            transaction: t,
          });
        });

        await Promise.all(orderProductPromises);
        return res.json(order);
      });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
  async getAll(req, res) {
    const orders = await Order.findAll({
      include: [
        {
          model: OrderInfo,
          as: "info",
        },
        {
          model: Album,
        },
      ],
    });

    return res.json(orders);
  }
  async getByUserId(req, res) {
    const { id } = req.params;
    try {
      const basket = await Basket.findOne({ where: { userId: id } });
      if (basket) {
        const order = await Order.findAll({
          where: { basketId: basket.id },
          include: [
            {
              model: OrderInfo,

              as: "info",
            },
           
            {
              model: Album,
              include:[{model:Artist, attributes:['name'],}]

            },
          ],
        });
        return res.json(order)
      }
      else{        return res.status(404).json({ message: 'Корзина не найдена' });
    }
    } catch (error) {
      console.error(error.message);
    }
  }
  async changeStatus(req,res,next){
    try {
      const { id } = req.params;

      const { newStatus } = req.body;
const order= await Order.findOne({where:{id}, include:[
  {
    model: Basket,
    include:[{model:User, attributes:['email'],}]

  },
]})

if (!order) {
  return res.status(404).json({ message: 'Заказ не найден' });
}

order.status = newStatus;
await order.save();
if (newStatus === 'Ожидает оплаты') {

  await sendEmail(order.basket.user.email, order.id);
}

        return res.json(order);

      }
      catch (error) {
        console.error(error.message);
      }
  }
}

module.exports = new OrderController();
