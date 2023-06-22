const bookModel = require('../models/bookModel');
const reviewModel = require('../models/reviewModel');
const { ratingRange } = require('../utils/validations');
const { ObjectIdCheck } = require('../utils/verification')



const createReview = async (req, res) => {
    try {
        const bookId = req.params.bookId
        const { rating, reviewedAt, reviewedBy } = req.body;
        if (!bookId) {
            return res.status(404).json({ status: false, message: "book Id not found in params" })
        }
        if (!ObjectIdCheck(bookId)) {
            return res.status(400).json({ status: false, message: "book Id is invalid" })
        }
        if (!rating || !reviewedAt) {
            return res.status(400).json({ status: false, message: "details are missing" })
        }
        if (!ratingRange(rating)) {
            return res.status(400).json({ status: false, message: "rating is invalid" })
        }
        const checkBook = await bookModel.findOne({ _id: bookId, isDeleted: false });
        if (!checkBook) {
            return res.status(404).json({ status: false, message: "book not found" })
        }

        const reviewDetails = {
            rating: rating,
            bookId: bookId,
            reviewedAt: reviewedAt,
        }
        if (req.body.review) {
            reviewDetails.review = req.body.review
        }
        if (reviewedBy) {
            reviewDetails.reviewedBy = reviewedBy
        }
        const reviewsCreate = await reviewModel.create(reviewDetails);
        const book = await bookModel.findByIdAndUpdate(bookId, { $inc: { reviews: 1 } }, { new: true });
        book.reviewsData = reviewsCreate;
        res.status(201).json({ status: true, message: "Review added successfully", data: book });
    } catch (error) {
        if (error.message.includes('validation')) {
            return res.status(400).send({ status: false, message: error.message })
        } else if (error.message.includes('duplicate')) {
            return res.status(400).send({ status: false, message: error.message })
        } else {
            res.status(500).json({ status: false, message: error.message })
        }
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
        if (bookId != review.bookId) {
            return res.status(400).json({ status: false, message: "book Id is invalid" })
        }
        const updatedReview = await reviewModel.findByIdAndUpdate(reviewId, req.body, { new: true });
        res.status(200).json({ status: true, message: "Review updated successfully", data: updatedReview });
    } catch (error) {
        if (error.message.includes('validation')) {
            return res.status(400).send({ status: false, message: error.message })
        } else if (error.message.includes('duplicate')) {
            return res.status(400).send({ status: false, message: error.message })
        } else {
            res.status(500).json({ status: false, message: error.message })
        }
    }
}

const deletedReview = async (req, res) => {
    try {
        const reviewId = req.params.reviewId;
        const bookId = req.params.bookId;
        if (!reviewId || !bookId) {
            return res.status(404).json({ status: false, message: "review Id or book Id not found in params" })
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
        if (bookId != review.bookId) {
            return res.status(400).json({ status: false, message: "book Id is invalid" })
        }
        const bookUpdated = await bookModel.findByIdAndUpdate(bookId, { $inc: { reviews: -1 } }, { new: true });
        const reviewUpdated = await reviewModel.findByIdAndUpdate(reviewId, { $set: { isDeleted: true } }, { new: true });
        res.status(200).json({ status: true, message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message })
    }
}



module.exports = {
    createReview,
    updateReview,
    deletedReview
}