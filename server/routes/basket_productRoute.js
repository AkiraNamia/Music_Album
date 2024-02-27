const Router = require('express')
const router = new Router()
const basket_productController=require('../controllers/basket_productController')

router.post('/',basket_productController.create)
router.get('/', basket_productController.getAll)


module.exports=router