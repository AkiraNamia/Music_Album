const Router = require('express')
const router = new Router()
const infoController=require('../controllers/infoController')

router.delete('/:id',infoController.deleteInfo)
router.get('/', infoController.getAll)


module.exports=router