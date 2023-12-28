const router = require('express').Router();
const authController = require('../controllers/auth');

router.post('/login', authController.login);
router.post('/register', authController.register);
// router.post('/', bookController.addBook);
// router.delete('/:id', bookController.deleteBookById);

module.exports = router;