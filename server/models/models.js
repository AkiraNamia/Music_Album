const sequelize=require('../db');
const {DataTypes} = require('sequelize');

const User = sequelize.define('user', {
    id:{type:DataTypes.INTEGER, primaryKey:true, autoIncrement: true},
    name:{type:DataTypes.STRING},
    email:{type:DataTypes.STRING, unique:true},
    password:{type:DataTypes.STRING, allowNull:false},
    role:{type:DataTypes.STRING, defaultValue:"USER"},

})

const Basket = sequelize.define('basket', {
    id:{type:DataTypes.INTEGER, primaryKey:true, autoIncrement: true},
})

const Basket_product = sequelize.define('basket_product', {
    id:{type:DataTypes.INTEGER, primaryKey:true, autoIncrement: true},
    number:{type:DataTypes.INTEGER, allowNull:false},
})

const Order = sequelize.define('order', {
    id:{type:DataTypes.INTEGER, primaryKey:true, autoIncrement: true},
    order_date:{type:DataTypes.DATEONLY},
    status:{type:DataTypes.STRING, defaultValue:"Заказ принят"},
    totalAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0.0 },
    paymentType:{type:DataTypes.STRING,allowNull:false, defaultValue:"Наличными при получении"},
})
const OrderInfo = sequelize.define('orderInfo', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    country: { type: DataTypes.STRING, allowNull: false },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    city: { type: DataTypes.STRING, allowNull: false },
    countryRegion: { type: DataTypes.STRING, allowNull: true },
    address: { type: DataTypes.STRING, allowNull: false },
    zipCode: { type: DataTypes.INTEGER, allowNull: false },
    phoneNumber: { type: DataTypes.STRING, allowNull: false },

  });
const Order_product = sequelize.define('order_product', {
    id:{type:DataTypes.INTEGER, primaryKey:true, autoIncrement: true},
    number:{type:DataTypes.INTEGER, allowNull:false},})

const Artist = sequelize.define('artist', {
    id:{type:DataTypes.INTEGER, primaryKey:true, autoIncrement: true},
    name:{type:DataTypes.STRING, allowNull:false},
})

const Genre = sequelize.define('genre', {
    id:{type:DataTypes.INTEGER, primaryKey:true, autoIncrement: true},
    name:{type:DataTypes.STRING, unique:true, allowNull:false},
})

const Rating = sequelize.define('rating', {
    id:{type:DataTypes.INTEGER, primaryKey:true, autoIncrement: true},
    rate:{type:DataTypes.INTEGER, allowNull:false},
})

// const Poster = sequelize.define('poster', {
//     id:{type:DataTypes.INTEGER, primaryKey:true, autoIncrement: true},
//     name:{type:DataTypes.STRING, allowNull:false},
//     price:{type:DataTypes.INTEGER, allowNull:false},
//     img:{type:DataTypes.STRING, allowNull:false},
//     size:{type:DataTypes.STRING, allowNull:false},
//     rating:{type:DataTypes.INTEGER, allowNull:false, defaultValue:0},
//     balance:{type:DataTypes.INTEGER, allowNull:false, defaultValue:0},
// })

// const Office = sequelize.define('office', {
//     id:{type:DataTypes.INTEGER, primaryKey:true, autoIncrement: true},
//     name:{type:DataTypes.STRING, allowNull:false},
//     price:{type:DataTypes.INTEGER, allowNull:false},
//     img:{type:DataTypes.STRING, allowNull:false},
//     rating:{type:DataTypes.INTEGER, allowNull:false, defaultValue:0},
//     balance:{type:DataTypes.INTEGER, allowNull:false, defaultValue:0},
// })

// const Clothes = sequelize.define('clothes', {
//     id:{type:DataTypes.INTEGER, primaryKey:true, autoIncrement: true},
//     name:{type:DataTypes.STRING, allowNull:false},
//     price:{type:DataTypes.INTEGER, allowNull:false},
//     img:{type:DataTypes.STRING, allowNull:false},
//     size:{type:DataTypes.STRING, allowNull:false},
//     color:{type:DataTypes.STRING, allowNull:false},
//     rating:{type:DataTypes.INTEGER, allowNull:false, defaultValue:0},
//     balance:{type:DataTypes.INTEGER, allowNull:false, defaultValue:0},
// })

const Album = sequelize.define('album', {
    id:{type:DataTypes.INTEGER, primaryKey:true, autoIncrement: true},
    title:{type:DataTypes.STRING, allowNull:false},
    price:{type:DataTypes.INTEGER, allowNull:false},
    img:{type:DataTypes.STRING, allowNull:false},
    balance:{type:DataTypes.INTEGER, allowNull:false, defaultValue:0},
    cd:{type:DataTypes.INTEGER, allowNull:true},
})
const AlbumInfo = sequelize.define('albumInfo', {
    id:{type:DataTypes.INTEGER, primaryKey:true, autoIncrement: true},
    title:{type:DataTypes.STRING, allowNull:false},
    description: {type:DataTypes.STRING, allowNull:false},
  });
const Comment = sequelize.define('comment', {
    id:{type:DataTypes.INTEGER, primaryKey:true, autoIncrement: true},
    description:{type:DataTypes.STRING, allowNull:false},
})

const Song = sequelize.define('song', {
    id:{type:DataTypes.INTEGER, primaryKey:true, autoIncrement: true},
    title:{type:DataTypes.STRING, allowNull:false},
    duration: {type:DataTypes.STRING, allowNull:false},
    trackNumber: {type:DataTypes.INTEGER, allowNull:false},
    audio:{type:DataTypes.STRING},

})
const GenreInfo = sequelize.define('genreInfo', {
    id:{type:DataTypes.INTEGER, primaryKey:true, autoIncrement: true},

})
const AdminInfo = sequelize.define('adminInfo', {
    id:{type:DataTypes.INTEGER, primaryKey:true, autoIncrement: true},
    has_promotion:{type:DataTypes.BOOLEAN, allowNull:true },
    promotion_price:{type:DataTypes.INTEGER, allowNull:true },
    is_new_arrival:{type:DataTypes.BOOLEAN, allowNull:true},
})


User.hasOne(Basket, {
    foreignKey: {
      name: 'userId',
      allowNull: false,
      unique: true,
    },
    onUpdate: 'CASCADE',
  });
Basket.belongsTo(User)
  Order.hasMany(OrderInfo,{as:'info', onUpdate: 'CASCADE',}); // Адрес привязан к заказу
  OrderInfo.belongsTo(Order);
  
User.hasMany(Rating)
Rating.belongsTo(User)
User.hasMany(Comment)
Comment.belongsTo(User)

Basket.hasMany(Order)
Order.belongsTo(Basket)
Basket.belongsToMany(Album, { through: Basket_product });
Album.belongsToMany(Basket, { through: Basket_product });
Order.belongsToMany(Album, { through: Order_product });
Album.belongsToMany(Order, { through: Order_product });

Artist.hasMany(Song)
Song.belongsTo(Artist)

Album.hasMany(AdminInfo)
AdminInfo.belongsTo(Album)
Album.hasMany(Comment)
Comment.belongsTo(Album)
Album.hasMany(Rating)
Rating.belongsTo(Album)
// Модель Album
Album.hasMany(AlbumInfo, {as:'info', onUpdate: 'CASCADE',});
// Модель AlbumInfo
AlbumInfo.belongsTo(Album);

Album.hasMany(Song)
Song.belongsTo(Album)
Album.belongsToMany(Genre,{ through: GenreInfo });
Genre.belongsToMany(Album,{ through: GenreInfo });

Song.belongsToMany(Genre,{ through: GenreInfo });
Genre.belongsToMany(Song,{ through: GenreInfo });

Artist.hasMany(Album);
Album.belongsTo(Artist);

// async function CreateUser() {
//     try {
//       // Здесь вы можете добавить логику для создания начальных данных
//       // Пример добавления пользователя:
//       await User.create({name: 'Иван',email: 'ivan@example.com',password: 'пароль',role: 'User',},)
//       await User.create({ name: "Olga", "email": "olgaksenghik@gmail.com","password": "Kumamon3",  "role": "Admin" },)
//       await User.create({ name: "Ksenia","email": "kseniaKendish@gmail.com","password": "kdhnfk",    "role": "Moderator"},)
//       await User.create({ name: "Irina",   "email": "IrinaMolosh@gmail.com", "password": "skmiv211",   "role": "User"},)
//       await User.create({ name: "Alina","email": "alinaSevryuk@gmail.com", "password": "mkcdnvjd", "role": "User"},)
//       await User.create({ name: "Yulia","email": "YuliaZubareva@gmail.com","password": "cdkmkc", "role": "Admin"},)
//       await User.create({ name: "Sasha","email": "TolohAlexandr@gmail.com","password": "scdcnj", "role": "Admin"},)  
//     } catch (error) {
//       console.log('Ошибка при заполнении базы данных:', error);
//     }
//   }
//   CreateUser();

// async function CreateBasket() {
//     try {
      
//     await Basket.create({userId: 1},)
//     await Basket.create({userId: 2},)
//     await Basket.create({userId: 3},)
//     await Basket.create({userId: 4},)
//     await Basket.create({userId: 5},)
//     await Basket.create({userId: 6},)
//     } catch (error) {
//       console.log('Ошибка при заполнении базы данных:', error);
//     }
//   }
//   CreateBasket();

  
// async function CreateArtist() {
//     try {
      
//     await Artist.create({name: 'Ghostemane'},)
//     await Artist.create({name: 'BTS'},)
//     await Artist.create({name: 'LSP'},)
//     await Artist.create({name: 'Melanie Martinez'},)
//     await Artist.create({name: 'DuaLipa'},)
//     await Artist.create({name: 'SubUrban'},)
//     await Artist.create({name: 'Gorillaz'},)
//     await Artist.create({name: 'OneOkRock'},)
//     await Artist.create({name: 'G-Dragon'},)

//     } catch (error) {
//       console.log('Ошибка при заполнении базы данных:', error);
//     }
//   }
//   CreateArtist()

//   async function CreateAlbum() {
//     try {
      
//     await Album.create({title: 'Plagues', price:20, img:'gh1.jpg',balance:30,artistId:1},)
//     await Album.create({title: 'Hexada', price:25,img:'gh.jpg',balance:30,artistId:1},)
//     await Album.create({title: 'ANTI-ICON', price:30,img:'anti.jpg',balance:30,artistId:1},)
//     await Album.create({title: 'Dark&Wild', price:18,img:'dw.jpg',balance:30,artistId:2},)
//     await Album.create({title: 'Love Yourself: Answer', price:20,img:'ly.jpg',balance:30,cd:1, artistId:2},)
//     await Album.create({title: 'Love Yourself: Answer', price:20,img:'ly.jpg',balance:30,cd:2, artistId:2},)
//     await Album.create({title: 'Love Yourself: Tear', price:20,img:'tear.jpg',balance:30,artistId:2},)
//     await Album.create({title: 'Map of the Soul: Persona', price:30,img:'ms.jpg',balance:30,artistId:2},)
//     await Album.create({title: 'Map of the Soul: 7', price:30,img:'ms7.jpg',balance:30,artistId:2},)
//     await Album.create({title: 'Wings', price:15,img:'wings.jpg',balance:30,artistId:2},)
//     await Album.create({title: 'EP', price:20,img:'ep.jpg',balance:30,artistId:3},)
//     await Album.create({title: 'Кондитерская', price:15,img:'kond.jpg',balance:30,artistId:3},)
//     await Album.create({title: 'Magic City', price:22,img:'magic.jpg',balance:30,artistId:3},)
//     await Album.create({title: 'One More City', price:22,img:'oms.jpg',balance:30,artistId:3},)
//     await Album.create({title: 'Tragic City', price:25,img:'tr.jpg',balance:30,artistId:3},)
//     await Album.create({title: 'Виселица', price:20,img:'vis.jpg',balance:30,artistId:3},)
//     await Album.create({title: 'K-12', price:30,img:'k12.jpg',balance:30,artistId:4},)
//     await Album.create({title: 'After School', price:20,img:'as.jpg',balance:30,artistId:4},)
//     await Album.create({title: 'Cry Baby', price:27,img:'cry.jpg',balance:30,artistId:4},)
//     await Album.create({title: 'Ambitions', price:30,img:'okr3.jpg',balance:30,artistId:8},)
//     await Album.create({title: 'Eye of the Storm', price:30,img:'okr2.jpg',balance:30,artistId:8},)
//     await Album.create({title: '35xxxv', price:30,img:'okr1.jpg',balance:30,artistId:8},)
//     await Album.create({title: 'Coup D`etat', price:30,img:'coupdetat.jpg',balance:30,artistId:9},)
//     await Album.create({title: 'Kwon Ji-Yong', price:30,img:'kwon.jpg',balance:30,artistId:9},)

// } catch (error) {
//       console.log('Ошибка при заполнении базы данных:', error);
//     }
//   }
//   CreateAlbum()

// async function CreateRating() {
//     try {
//       // Здесь вы можете добавить логику для создания начальных данных
//       // Пример добавления пользователя:
//       await Rating.create({rate: 5,userId: 1,albumId: 1},)
//       await Rating.create({rate: 3,userId: 1,albumId: 2},)
//       await Rating.create({rate: 2,userId: 3,albumId: 1},)
//       await Rating.create({rate: 5,userId: 5,albumId: 3},)
//       await Rating.create({rate: 5,userId: 2,albumId: 1},)
//       await Rating.create({rate: 4,userId: 2,albumId: 2},)
//       await Rating.create({rate: 1,userId: 2,albumId: 8},)
//       await Rating.create({rate: 5,userId: 3,albumId: 1},)
//       await Rating.create({rate: 3,userId: 5,albumId: 4},)
//       await Rating.create({rate: 2,userId: 4,albumId: 2},)
//       await Rating.create({rate: 4,userId: 6,albumId: 5},)
//       await Rating.create({rate: 4,userId: 2,albumId: 7},)
//       await Rating.create({rate: 5,userId: 1,albumId: 6},)

//     } catch (error) {
//       console.log('Ошибка при заполнении базы данных:', error);
//     }
//   }
//       CreateRating()

// async function CreateComment() {
//     try {
//       // Здесь вы можете добавить логику для создания начальных данных
//       // Пример добавления пользователя:
//       await Comment.create({description: 'Amazing!!!',userId: 1,albumId: 1},)
//       await Comment.create({description: 'Wonderful album',userId: 2,albumId: 2},)
//       await Comment.create({description: 'That`s my favorite album forever',userId: 1,albumId: 3},)
//       await Comment.create({description: 'Trash',userId: 3,albumId: 4},)
//       await Comment.create({description: 'Good album, but not for me',userId: 4,albumId: 5},)
//       await Comment.create({description: 'So expansive..',userId: 5,albumId: 6},)
//       await Comment.create({description: 'OMG!!!',userId: 6,albumId: 6},)
//       await Comment.create({description: 'What a peace of shit!',userId: 1,albumId: 3},)
//       await Comment.create({description: 'Hate him!',userId: 2,albumId: 1},)
//       await Comment.create({description: 'I love it',userId: 3,albumId: 5},)
//       await Comment.create({description: 'Noooooo',userId: 4,albumId: 2},)


//     } catch (error) {
//       console.log('Ошибка при заполнении базы данных:', error);
//     }
//   }
//     CreateComment()

// async function CreateSong() {
//     try {
//       // Здесь вы можете добавить логику для создания начальных данных
//       // Пример добавления пользователя:
//       await Song.create({title: 'Plagues',duration: '3.18',trackNumber: 1, artistId:1,albumId:1},)
//       await Song.create({title: 'Until The Light Takes Us',duration: '3.04',trackNumber: 2, artistId:1,albumId:1},)
//       await Song.create({title: 'Lady Mandini',duration: '0.49',trackNumber: 3, artistId:1,albumId:1},)
//       await Song.create({title: 'Axis',duration: '3.03',trackNumber: 4, artistId:1,albumId:1},)
//       await Song.create({title: 'Andromeda',duration: '2.02',trackNumber: 5, artistId:1,albumId:1},)
//       await Song.create({title: 'GodHead',duration: '1.56',trackNumber: 6, artistId:1,albumId:1},)
//       await Song.create({title: 'Rapture',duration: '2.11',trackNumber: 7, artistId:1,albumId:1},)
//       await Song.create({title: 'Cult Of Thoth',duration: '2.11',trackNumber: 8, artistId:1,albumId:1},)
//       await Song.create({title: 'Wishers Lose Coopper Dreamers Lose Everething',duration: '2.48',trackNumber: 9, artistId:1,albumId:1},)
//       await Song.create({title: 'Euronymous',duration: '2.33',trackNumber: 10, artistId:1,albumId:1},)
//       await Song.create({title: 'Plague Dr Mask II',duration: '3.28',trackNumber: 11, artistId:1,albumId:1},)
//       await Song.create({title: 'Intro.Decadence',duration: '0.59',trackNumber: 1, artistId:1,albumId:2},)
//       await Song.create({title: 'Hexada',duration: '2.15',trackNumber: 2, artistId:1,albumId:2},)
//       await Song.create({title: 'Rake',duration: '1.32',trackNumber: 3, artistId:1,albumId:2},)
//       await Song.create({title: 'Mercury: Retrograde',duration: '2.04',trackNumber: 4, artistId:1,albumId:2},)
//       await Song.create({title: 'NAILS',duration: '2.14',trackNumber: 5, artistId:1,albumId:2},)
//       await Song.create({title: 'D(r)own',duration: '2.07',trackNumber: 6, artistId:1,albumId:2},)
//       await Song.create({title: 'Smog (City Of Angeles)',duration: '1.46',trackNumber: 7, artistId:1,albumId:2},)
//       await Song.create({title: 'Changing Of The Tides',duration: '2.52',trackNumber: 8, artistId:1,albumId:2},)
//       await Song.create({title: 'Idle Hands',duration: '3.02',trackNumber: 9, artistId:1,albumId:2},)
//       await Song.create({title: 'Tartarus',duration: '2.17',trackNumber: 10, artistId:1,albumId:2},)
//       await Song.create({title: 'Squeeze',duration: '2.20',trackNumber: 11, artistId:1,albumId:2},)
//       await Song.create({title: 'Polaris',duration: '3.39',trackNumber: 12, artistId:1,albumId:2},)
//       await Song.create({title: 'Intro.Destitute',duration: '1.56',trackNumber: 1, artistId:1,albumId:3},)
//       await Song.create({title: 'Vagabond',duration: '1.54',trackNumber: 2, artistId:1,albumId:3},)
//       await Song.create({title: 'Lazaretto',duration: '1.53',trackNumber: 3, artistId:1,albumId:3},)
//       await Song.create({title: 'Sacrilege',duration: '2.22',trackNumber: 4, artistId:1,albumId:3},)
//       await Song.create({title: 'AI',duration: '2.55',trackNumber: 5, artistId:1,albumId:3},)
//       await Song.create({title: 'Fed Up',duration: '2.32',trackNumber: 6, artistId:1,albumId:3},)
//       await Song.create({title: 'The Winds of Change',duration: '2.40',trackNumber: 7, artistId:1,albumId:3},)
//       await Song.create({title: 'Hydrochloride',duration: '2.27',trackNumber: 8, artistId:1,albumId:3},)
//       await Song.create({title: 'Hellrap',duration: '2.11',trackNumber: 9, artistId:1,albumId:3},)
//       await Song.create({title: 'Anti-Social Masochistic Rage [ASMR]',duration: '3.14',trackNumber: 10, artistId:1,albumId:3},)
//       await Song.create({title: 'Melancholic',duration: '4.43',trackNumber: 11, artistId:1,albumId:3},)
//       await Song.create({title: 'Calamity',duration: '2.43',trackNumber: 12, artistId:1,albumId:3},)
//       await Song.create({title: 'Falling Down',duration: '4.41',trackNumber: 13, artistId:1,albumId:3},)
//       await Song.create({title: 'Intro: What am I to You',duration: '4.41',trackNumber: 1, artistId:2,albumId:4},)
//       await Song.create({title: 'Danger',duration: '4.41',trackNumber: 2, artistId:2,albumId:4},)
//       await Song.create({title: '호르몬 전쟁 (War of Hormone)',duration: '4.41',trackNumber: 3, artistId:2,albumId:4},)
//       await Song.create({title: '힙합성애자 (Hip Hop Lover)',duration: '4.41',trackNumber: 4, artistId:2,albumId:4},)
//       await Song.create({title: 'Let Me Know',duration: '4.41',trackNumber: 5, artistId:2,albumId:4},)
//       await Song.create({title: 'Rain',duration: '4.41',trackNumber: 6, artistId:2,albumId:4},)
//       await Song.create({title: 'BTS Cypher Pt. 3: Killer',duration: '4.41',trackNumber: 7, artistId:2,albumId:4},)
//       await Song.create({title: 'Interlude:뭐해 (Interlude: What Are You Doing)',duration: '4.41',trackNumber: 8, artistId:2,albumId:4},)
//       await Song.create({title: '핸드폰 좀 꺼줄래 (Would You Turn off Your cellphone?)',duration: '4.41',trackNumber: 9, artistId:2,albumId:4},)
//       await Song.create({title: '이불킥 (Blanket Kick',duration: '4.41',trackNumber: 10, artistId:2,albumId:4},)
//       await Song.create({title: '24/7=Heaven',duration: '4.41',trackNumber: 11, artistId:2,albumId:4},)
//       await Song.create({title: '여기 봐 (Look Here)',duration: '4.41',trackNumber: 12, artistId:2,albumId:4},)
//       await Song.create({title: '2학년 (2nd Grade)',duration: '4.41',trackNumber: 13, artistId:2,albumId:4},)
//       await Song.create({title: 'Outro: 그게 말이 돼? (Outro: Does that make sense?',duration: '4.41',trackNumber: 14, artistId:2,albumId:4},)
//       await Song.create({title: 'Euphoria',duration: '3.49',trackNumber: 1, artistId:2,albumId:5},)
//       await Song.create({title: 'Trivia 起 : Just Dance',duration: '3.45',trackNumber: 2, artistId:2,albumId:5},)
//       await Song.create({title: 'Serendipity (Full Length Edition)',duration: '4.37',trackNumber: 3, artistId:2,albumId:5},)
//       await Song.create({title: 'DNA',duration: '3.43',trackNumber: 4, artistId:2,albumId:5},)
//       await Song.create({title: 'Dimple',duration: '3.16',trackNumber: 5, artistId:2,albumId:5},)
//       await Song.create({title: 'Trivia 承 : Love',duration: '3.46',trackNumber: 6, artistId:2,albumId:5},)
//       await Song.create({title: 'Her',duration: '3.49',trackNumber: 7, artistId:2,albumId:5},)
//       await Song.create({title: 'Singularity',duration: '3.17',trackNumber: 8, artistId:2,albumId:5},)
//       await Song.create({title: 'FAKE LOVE',duration: '4.02',trackNumber: 9, artistId:2,albumId:5},)
//       await Song.create({title: 'The Truth Untold (Feat. Steve Aoki)',duration: '4.06',trackNumber: 10, artistId:2,albumId:5},)
//       await Song.create({title: 'Trivia 轉 : Seesaw',duration: '4.06',trackNumber: 11, artistId:2,albumId:5},)
//       await Song.create({title: 'Tear',duration: '4.45',trackNumber: 12, artistId:2,albumId:5},)
//       await Song.create({title: 'Epiphany',duration: '4.00',trackNumber: 13, artistId:2,albumId:5},)
//       await Song.create({title: 'I`m Fine',duration: '4.00',trackNumber: 14, artistId:2,albumId:5},)
//       await Song.create({title: 'IDOL',duration: '3.43',trackNumber: 15, artistId:2,albumId:5},)
//       await Song.create({title: 'Answer : Love Myself',duration: '4.11',trackNumber: 16, artistId:2,albumId:5},)
//       await Song.create({title: 'Magic Shop',duration: '4.36',trackNumber: 1, artistId:2,albumId:6},)
//       await Song.create({title: 'Best Of Me',duration: '3.46',trackNumber: 2, artistId:2,albumId:6},)
//       await Song.create({title: 'Airplane pt.2',duration: '3.39',trackNumber: 3, artistId:2,albumId:6},)
//       await Song.create({title: 'Go Go',duration: '3.55',trackNumber: 4, artistId:2,albumId:6},)
//       await Song.create({title: 'Anpanman',duration: '3.54',trackNumber: 5, artistId:2,albumId:6},)
//       await Song.create({title: 'MIC Drop',duration: '3.57',trackNumber: 6, artistId:2,albumId:6},)
//       await Song.create({title: 'DNA (Pedal 2 LA Mix)',duration: '4.07',trackNumber: 7, artistId:2,albumId:6},)
//       await Song.create({title: 'FAKE LOVE (Rocking Vibe Mix)',duration: '3.58',trackNumber: 8, artistId:2,albumId:6},)
//       await Song.create({title: 'MIC Drop (Steve Aoki Remix) (Full Length Edition)',duration: '5.08',trackNumber: 9, artistId:2,albumId:6},)
//       await Song.create({title: 'Into: Singularity',duration: '3.14',trackNumber: 1, artistId:2,albumId:7},)
//       await Song.create({title: 'FAKE LOVE',duration: '4.06',trackNumber: 2, artistId:2,albumId:7},)
//       await Song.create({title: 'The Truth Untold (Feat. Steve Aoki)',duration: '4.02',trackNumber: 3, artistId:2,albumId:7},)
//       await Song.create({title: '134340',duration: '3.49',trackNumber: 4, artistId:2,albumId:7},)
//       await Song.create({title: 'Paradise',duration: '3.30',trackNumber: 5, artistId:2,albumId:7},)
//       await Song.create({title: 'Love Maze',duration: '3.40',trackNumber: 6, artistId:2,albumId:7},)
//       await Song.create({title: 'Magic Shop',duration: '4.36',trackNumber: 7, artistId:2,albumId:7},)
//       await Song.create({title: 'Airplane pt.2',duration: '3.39',trackNumber: 8, artistId:2,albumId:7},)
//       await Song.create({title: 'Anpanman',duration: '3.54',trackNumber: 9, artistId:2,albumId:7},)
//       await Song.create({title: 'So What',duration: '4.44',trackNumber: 10, artistId:2,albumId:7},)
//       await Song.create({title: 'Outro: Tear',duration: '4.45',trackNumber: 11, artistId:2,albumId:7},)
//       await Song.create({title: 'Intro: Persona',duration: '4.45',trackNumber: 1, artistId:2,albumId:8},)


//     } catch (error) {
//       console.log('Ошибка при заполнении базы данных:', error);
//     }
//   }
//     CreateSong()

// async function CreateGenre() {
//     try {
      
//      await Genre.create({name: 'Pop'})
//      await Genre.create({name: 'K-pop'})
//      await Genre.create({name: 'Rock'})
//      await Genre.create({name: 'Metall'})
//      await Genre.create({name: 'Punk'})
//      await Genre.create({name: 'Alternative'})
//      await Genre.create({name: 'Hip-Hop/Rap'})
//      await Genre.create({name: 'Electronic'})
//      await Genre.create({name: 'Electronic'})
//      await Genre.create({name: 'Indie'})

//     } catch (error) {
//       console.log('Ошибка при заполнении базы данных:', error);
//     }
//   }
//     CreateGenre()
//     async function CreateGenreInfo() {
//         try {
          
//          await GenreInfo.create({albumId: 1, genreId:3, songId:1})
//          await GenreInfo.create({albumId: 1, genreId:3, songId:2})
//          await GenreInfo.create({albumId: 1, genreId:3, songId:3})
//          await GenreInfo.create({albumId: 1, genreId:3, songId:4})
//          await GenreInfo.create({albumId: 1, genreId:3, songId:5})
//          await GenreInfo.create({albumId: 1, genreId:3, songId:6})
//          await GenreInfo.create({albumId: 1, genreId:3, songId:7})
//          await GenreInfo.create({albumId: 1, genreId:3, songId:8})
//          await GenreInfo.create({albumId: 1, genreId:3, songId:9})
//          await GenreInfo.create({albumId: 2, genreId:3, songId:10})
//          await GenreInfo.create({albumId: 3, genreId:3, songId:11})
//          await GenreInfo.create({albumId: 4, genreId:1, songId:33})


    
//         } catch (error) {
//           console.log('Ошибка при заполнении базы данных:', error);
//         }
//       }
//         CreateGenreInfo()

// async function CreateAlbumInfo() {
//     try {
      
//      await AlbumInfo.create({title: 'Lengh', description:'13 tracks, 30:40', albumId:1})
//      await AlbumInfo.create({title: 'Release date', description:'14 November 2016', albumId:1})
//      await AlbumInfo.create({title: 'Lable', description:'GHOSTEMANE', albumId:1})
//      await AlbumInfo.create({title: 'Formats', description:'CD', albumId:1})
//      await AlbumInfo.create({title: 'Catalog Number', description:'597264', albumId:1})
//      await AlbumInfo.create({title: 'Balance in stock', description:'30', albumId:1})

//      await AlbumInfo.create({title: 'Lengh', description:'12 tracks, 26.45', albumId:2})
//      await AlbumInfo.create({title: 'Release date', description:'5 September 2017', albumId:2})
//      await AlbumInfo.create({title: 'Lable', description:'GHOSTEMANE', albumId:2})
//      await AlbumInfo.create({title: 'Formats', description:'CD', albumId:2})
//      await AlbumInfo.create({title: 'Catalog Number', description:'268418', albumId:2})
//      await AlbumInfo.create({title: 'Balance in stock', description:'30', albumId:2})

//      await AlbumInfo.create({title: 'Lengh', description:'13 tracks, 36:04', albumId:3})
//      await AlbumInfo.create({title: 'Release date', description:'21 October 2020', albumId:3})
//      await AlbumInfo.create({title: 'Lable', description:'GHOSTEMANE', albumId:3})
//      await AlbumInfo.create({title: 'Formats', description:'CD', albumId:3})
//      await AlbumInfo.create({title: 'Catalog Number', description:'354157', albumId:3})
//      await AlbumInfo.create({title: 'Balance in stock', description:'30', albumId:3})
//     } catch (error) {
//       console.log('Ошибка при заполнении базы данных:', error);
//     }
//   }
//   CreateAlbumInfo()

module.exports={
    User,
    Basket,
    Basket_product,
    Order,
    OrderInfo,
    Order_product,
    Artist,
    Genre,
    Rating,
    AlbumInfo,
    GenreInfo,
    AdminInfo,
    // Office,
    // Clothes,
    Album,
    Comment,
    Song
}