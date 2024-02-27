const Router = require('express')
const router = new Router()
const commentController=require('../controllers/commentController')

router.post('/',commentController.addAlbumComment)
router.delete('/',commentController.delete)

router.get('/',  commentController.getAll)
router.get('/:albumId/comments', commentController.getCommentForAlbum)




module.exports=router