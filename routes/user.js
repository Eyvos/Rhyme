const router = require('express').Router();
const userController = require('../controllers/user');
const auth = require('../middlewares/authMiddleware');

router.get('/', auth, userController.getAll);
router.get('/:id', userController.getOne);
router.put('/', auth, userController.changeUsername);
router.delete('/:id', auth, userController.deleteUser);
router.put('/password', auth, userController.changePassword)
module.exports = router;