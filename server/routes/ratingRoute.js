const Router = require('express')
const router = new Router()
const ratingController=require('../controllers/ratingController')

router.post('/',ratingController.addAlbumRating)
router.get('/', ratingController.getAll)
router.get('/userRate', ratingController.getUserRatingForAlbum)


module.exports=router