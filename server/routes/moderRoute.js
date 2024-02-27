const Router = require('express')
const router = new Router()
const moderController=require('../controllers/moderController')
const authMiddleware=require('../middleware/authMiddleware')

router.get('/', moderController.getAll)




module.exports=router