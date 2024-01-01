const router = require('express').Router();
const userController = require('../controllers/user');
const auth = require('../middlewares/authMiddleware');
const authAdmin = require('../middlewares/authAdmin');

router.get('/', auth, userController.getAll);
router.get('/:id', userController.getOne);
router.put('/', auth, userController.changeUsername);
router.put('/password', auth, userController.changePassword);
router.delete('/:id', authAdmin, userController.deleteUserAdmin);
router.delete('/', auth, userController.deleteUser);

module.exports = router;