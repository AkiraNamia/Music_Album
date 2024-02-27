const Router = require('express')
const router = new Router()
const orderController=require('../controllers/orderController')

router.post('/',orderController.create)
router.get('/', orderController.getAll)
router.get('/:id', orderController.getByUserId)
router.put('/:id', orderController.changeStatus)



module.exports=router