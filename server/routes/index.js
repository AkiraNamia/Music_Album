const Router = require('express')
const router = new Router()
const userRouter = require('./userRoute')
const genreRouter = require('./genreRoute')
const artistRouter = require('./artistRoute')
const albumRouter = require('./albumRoute')
const songRouter = require('./songRoute')
const basketRouter = require('./basketRoute')
const ratingRouter = require('./ratingRoute')
const infoRouter = require('./infoRoute')
const commentRoute = require('./commentRoute')
const orderRouter = require('./orderRoute')
const moderRouter = require('./moderRoute')

const basket_productRouter = require('./basket_productRoute')


router.use('/user', userRouter)
 router.use('/album', albumRouter)
 router.use('/artist', artistRouter)
router.use('/rating', ratingRouter)
router.use('/info', infoRouter)
router.use('/comment', commentRoute)
 router.use('/genre', genreRouter)
router.use('/order', orderRouter)
router.use('/song', songRouter)
router.use('/basket', basketRouter)
router.use('/moder', moderRouter)

router.use('/basket_product', basket_productRouter)




module.exports=router