const Router = require('express')
const router = new Router()
const albumController=require('../controllers/albumController')

router.post('/',albumController.create)
router.delete('/:id',albumController.delete)

router.put('/:id',albumController.updateAlbum)

router.get('/', albumController.getAll)
router.get('/:id/rate', albumController.getAlbumRate)
router.get('/sales', albumController.getSale);
router.get('/new', albumController.getNew);

router.get('/', albumController.getAllWithoutPages)
router.get('/adm', albumController.getAllForAdm)

router.get('/:id', albumController.getOne)
router.get('/:id/songs', albumController.getSongsByAlbumId);


module.exports=router