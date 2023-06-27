const router = require('express').Router();
const { createBook, getBooks, getBooksById, updateBook, deleteBookById, bookCover } = require('../controllers/bookCtrl');
const { createReview, updateReview, deletedReview } = require('../controllers/reviewCtrl');
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
router.post('/booksCover', bookCover)

// ===================== review routes ====================

router.post('/books/:bookId/review', createReview)
router.put('/books/:bookId/review/:reviewId', updateReview)
router.delete('/books/:bookId/review/:reviewId', deletedReview)

module.exports = router