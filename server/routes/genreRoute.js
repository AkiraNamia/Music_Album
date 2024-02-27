const Router = require('express')
const router = new Router()
const genreController=require('../controllers/genreController')

router.post('/',genreController.create)
router.delete('/:id/info',genreController.deleteInfo)
router.delete('/:id',genreController.delete)
router.put('/:id',genreController.edit)

router.get('/', genreController.getAll)
router.get('/:id', genreController.getOne)


module.exports=router