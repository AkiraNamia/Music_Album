const Router = require('express')
const router = new Router()
const userController=require('../controllers/userController')
const authMiddleware=require('../middleware/authMiddleware')

router.post('/registration',userController.registration)
router.post('/login', userController.login)
router.post('/', userController.addModerator)
router.delete('/:id', userController.deleteModer)
router.put('/:id', userController.editModer)

router.get('/auth', authMiddleware, userController.check)
router.get('/', userController.getAll)
router.get('/moder', userController.getModerator)
router.get('/:id/user', userController.getUserById)
router.put('/:id/user', userController.changeName)




module.exports=router