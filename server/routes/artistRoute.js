const Router = require('express')
const router = new Router()
const artistController=require('../controllers/artistController')

router.post('/',artistController.create)
router.delete('/:id',artistController.delete)
router.put('/:id',artistController.edit)

router.get('/', artistController.getAll)
router.get('/:id', artistController.getOne)
router.get('/:id/albums', artistController.getAlbumByArtistId);


module.exports=router