const router = require('express').Router();
const { createBook, getBooks, getBooksById, updateBook, deleteBookById } = require('../controllers/bookCtrl');
const { userRegister, userLogin } = require('../controllers/userCtrl');
const { authentication } = require('../middlewares/authMidd');




//=======================user routes======================
router.post("/register", userRegister)
router.post('/login', userLogin)


//======================= Book routes======================

router.post('/books', authentication, createBook)
router.get('/books', authentication, getBooks)
router.get('/books/:bookId', authentication, getBooksById)
router.put('/books/:bookId', authentication, updateBook)
router.delete('/books/:bookId', authentication, deleteBookById)

module.exports = router