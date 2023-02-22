const Router = require('express').Router
const userController = require('../controllers/user-controller')
// const multer = require('multer')
const authMiddleware = require('../middlewares/auth-middleware')
const { body } = require('express-validator')

const router = new Router()
// const storage = multer.memoryStorage()
// const upload = multer({ storage: storage })

router.post(
   '/registration',
   body('email').isEmail(),
   body('password').isLength({ min: 3, max: 30 }),
   userController.registration,
)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.get('/refresh', userController.refresh)
router.get('/users', authMiddleware, userController.getUsers)
router.get('/profile/:id', authMiddleware, userController.getProfile)
router.post('/profile/status/:id', authMiddleware, userController.setStatus)
router.post('/profile/uploadCover/:id', authMiddleware, userController.setPhoto)





module.exports = router









