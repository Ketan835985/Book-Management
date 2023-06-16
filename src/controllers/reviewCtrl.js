const bookModel = require('../models/bookModel');
const reviewModel = require('../models/reviewModel');
const { ratingRange } = require('../utils/validations');
const { ObjectIdCheck, bookCheck } = require('../utils/verification')



const createReview = async (req, res) => {
    try {
        const bookId = req.params.bookId
        const { rating, reviewedBy } = req.body;
        if (!bookId) {
            return res.status(404).json({ status: false, message: "book Id not found in params" })
        }
        if (!rating || !reviewedBy) {
            return res.status(400).json({ status: false, message: "details are missing" })
        }
        if (!ratingRange(rating)) {
            return res.status(400).json({ status: false, message: "rating is invalid" })
        }
        if (!ObjectIdCheck(bookId)) {
            return res.status(400).json({ status: false, message: "book Id is invalid" })
        }
        const checkBook = await bookModel.findOne({ id: bookId, isDeleted: false });
        if (!checkBook) {
            return res.status(404).json({ status: false, message: "book not found" })
        }
        const reviewDetails = {
            rating: rating,
            reviewedBy: reviewedBy,
            bookId: bookId,
            reviewedAt: new Date(),
        }
        if (req.body.review) {
            reviewDetails.review = req.body.review
        }
        const review = await reviewModel.create(reviewDetails);
        const book = await models.Book.findByIdAndUpdate(bookId, { $inc: { reviews: 1 } }, { new: true });
        book.reviewsData = review;
        res.status(201).json({ status: true, message: "Review added successfully", data: book });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message })
    }
}

const updateReview = async (req, res) => {
    try {
        const reviewId = req.params.reviewId;
        const bookId = req.params.bookId;
        if (!reviewId) {
            return res.status(404).json({ status: false, message: "review Id not found in params" })
        }
        if (!bookId) {
            return res.status(404).json({ status: false, message: "book Id not found in params" })
        }
        if (!ObjectIdCheck(bookId) && !ObjectIdCheck(reviewId)) {
            return res.status(400).json({ status: false, message: "Object Id Is Invalid" });
        }
        const book = await bookModel.findOne({ _id: bookId, isDeleted: false });
        if (!book) {
            return res.status(404).json({ status: false, message: "book not found" })
        }
        const review = await reviewModel.findOne({ _id: reviewId, isDeleted: false });
        if (!review) {
            return res.status(404).json({ status: false, message: "review not found" })
        }
        if (bookId !== review.bookId) {
            return res.status(400).json({ status: false, message: "book Id is invalid" })
        }
        const updatedReview = await reviewModel.findByIdAndUpdate(reviewId, req.body, { new: true });
        res.status(200).json({ status: true, message: "Review updated successfully", data: updatedReview });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message })
    }
}