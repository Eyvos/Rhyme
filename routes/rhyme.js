const router = require('express').Router();
const rhymeController = require('../controllers/rhyme');

//Importing the auth middleware to secure the selected routes
const auth = require('../middlewares/authMiddleware');

//Routes
router.get('/', auth, rhymeController.getAll);
router.get('/parent/:id', auth, rhymeController.getByParentId);
router.get('/:id', rhymeController.getById);
router.post('/', auth, rhymeController.create);
router.delete('/:id', auth, rhymeController.delete);

module.exports = router;
