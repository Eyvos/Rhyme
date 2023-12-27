const router = require('express').Router();
const userController = require('../controllers/user');
const auth = require('../middlewares/authMiddleware');

router.get('/', auth, userController.getAll);
router.get('/:id', auth, userController.getOne);
router.put('/', auth, userController.changeUsername);

module.exports = router;