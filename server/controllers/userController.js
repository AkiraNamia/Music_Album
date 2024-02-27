const ApiError = require("../error/ApiError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, Basket } = require("../models/models");
const { json } = require("sequelize");
const crypto = require('crypto');
const nodemailer = require('nodemailer'); 

function generateRandomPassword() {
  return crypto.randomBytes(8).toString('hex'); 
}

function sendEmail(email, password) {
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
    text: `Ваш временный пароль: ${password}`
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

const generateJwt = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });
};

class UserController {
  async registration(req, res, next) {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return next(ApiError.badRequest("Некорректный email или password"));
    }
    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      return next(
        ApiError.badRequest("Пользователь с таким email уже существует")
      );
    }
    const hashPassword = await bcrypt.hash(password, 5);
    const user = await User.create({ email, role, password: hashPassword });
    if( user){ await Basket.create({ userId:user.id });}
    const token = generateJwt(user.id, user.email, user.role);
    return res.json({ token });
  }

  async login(req, res, next) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(ApiError.internal("Пользователь не найден"));
    }
    let comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      return next(ApiError.internal("Указан неверный пароль"));
    }
    const token = generateJwt(user.id, user.email, user.role);
    return res.json({ token });
  }

  async check(req, res, next) {
    try{
    const token = generateJwt(req.user.id, req.user.email, req.user.role);
    console.log(token)
    return res.json({ token });}
    catch(e){
      console.error('Ошибка проверки токена:', error);
      return false
    }
  }
  async getAll(req, res) {
    const users = await User.findAll();
    return res.json(users);
  }
  async getUserById(req, res) {
    const {id}=req.params;
    const users = await User.findOne({where:{id}});
    return res.json(users);
  }
  async changeName(req, res) {
    const {id}=req.params;
    const {name}=req.body;
    try{
    const user = await User.findOne({where:{id}});
    if(!user)
    {
      return res.status(404).json({ message: 'User не найден' });
    }
    if(name) user.name=name;
  
    await user.save()
    return res.json({ message: 'User успешно обновлен' ,user});
  
  } catch (e) {
      return res.json(e.message);
  }
  }
  async getModerator(req, res) {
    const users = await User.findAll(  {
      where: {
      role: 'MODERATOR'
    }});
    return res.json(users);
  }
  async addModerator(req, res, next) {
    const {name, email } = req.body;
    if (!email) {
      return next(ApiError.badRequest("Некорректный email"));
    }
    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      return next(
        ApiError.badRequest("Пользователь с таким email уже существует")
      );
    }
  const generatedPassword = generateRandomPassword();
  const hashPassword = await bcrypt.hash(generatedPassword, 5);
  const user = await User.create({ name, email, role:"MODERATOR", password: hashPassword });
 
  sendEmail(email, generatedPassword);
  const token = generateJwt(user.id, user.name, user.email, user.role);
  return res.json({ token });
}
async deleteModer(req, res) {
  try {
      const {id} = req.params;
      await User.findOne({where:{id}})
          .then( async data => {
              if(data) {
                  await User.destroy({where:{id}}).then(() => {
                      return res.json("Moder deleted");
                  })
              } else {
                  return res.json("This Moder doesn't exist in DB");
              }
          })
  } catch (e) {
      return res.json(e);
  }
}
async editModer(req, res) {
  try {
    const {id} = req.params;
    const { name,role,email } = req.body;

const moder = await User.findOne({where:{id}})
if (!moder) {
    return res.status(404).json({ message: 'Модератор не найден' });
  }
  if(name) moder.name=name;
  if(email) moder.email=email;
  if(role) moder.role=role;

  await moder.save()
  return res.json({ message: 'Модератор успешно обновлен' ,moder});

} catch (e) {
    return res.json(e.message);
}
}
}

module.exports = new UserController();
