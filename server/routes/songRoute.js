const Router = require('express')
const router = new Router()
const songController=require('../controllers/songController')

router.post('/',songController.create)
router.post('/:id',songController.addSongAudio)
router.delete('/:id',songController.delete)
router.delete('/:id/info',songController.deleteInfo)

router.get('/', songController.getAll)
router.get('/moder', songController.getForModer)


module.exports=router