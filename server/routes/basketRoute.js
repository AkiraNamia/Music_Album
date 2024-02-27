const Router = require('express')
const router = new Router()
const basketController=require('../controllers/basketController')

router.post('/',basketController.create)
router.post('/addProduct',basketController.addProductToBasket)
router.delete('/', basketController.deleteProduct)
router.put('/:id', basketController.updateNumber)

router.get('/', basketController.getAll)
router.get('/:id', basketController.getBasketByUserId)
router.get('/:id/product', basketController.getBasketProduct)


module.exports=router