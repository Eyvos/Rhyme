const router = require('express').Router();
const authController = require('../controllers/authController');

router.get('/login', authController.login);
// router.get('/:id', bookController.getBookById);
// router.post('/', bookController.addBook);
// router.delete('/:id', bookController.deleteBookById);

module.exports = router;