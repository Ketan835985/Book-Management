const bookModel = require('../models/bookModel');
const reviewModel = require('../models/reviewModel');
const { ratingRange } = require('../utils/validations');
const { ObjectIdCheck } = require('../utils/verification')



const createReview = async (req, res) => {
    try {
        const bookId = req.params.bookId
        const { rating, reviewedBy, review } = req.body;
        if (!bookId) {
            return res.status(404).json({ status: false, message: "book Id not found in params" })
        }
        if (!ObjectIdCheck(bookId)) {
            return res.status(400).json({ status: false, message: "book Id is invalid" })
        }
        const checkBook = await bookModel.findOne({ _id: bookId, isDeleted: false });
        if (!checkBook) {
            return res.status(404).json({ status: false, message: "book not found" })
        }
        if (!rating) {
            return res.status(400).json({ status: false, message: "details are missing" })
        }
        if (!ratingRange(rating)) {
            return res.status(400).json({ status: false, message: "rating is invalid" })
        }
        const reviewDetails = {
            bookId,
            reviewedBy,
            review,
            rating,
            reviewedAt: new Date()
        }
        checkBook.reviews += 1
        await checkBook.save()
        const reviewsCreate = await reviewModel.create(reviewDetails);

        const data = checkBook.toObject()
        data["reviewsData"] = reviewsCreate
        res.status(201).json({ status: true, message: "Review added successfully", data: data });
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
        if (!ObjectIdCheck(bookId) ) {
            return res.status(400).json({ status: false, message: "Object Id Is Invalid" });
        }
        if (!ObjectIdCheck(reviewId)) {
            return res.status(400).json({ status: false, message: "Object Id Is Invalid" });
        }
        const book = await bookModel.findOne({ _id: bookId, isDeleted: false });
        if (!book) {
            return res.status(404).json({ status: false, message: "book not found" })
        }
        const reviewFind = await reviewModel.findOne({ _id: reviewId, bookId: bookId, isDeleted: false });
        if (!reviewFind || reviewFind == null) {
            return res.status(404).json({ status: false, message: "review not found" })
        }

        const data = book.toObject()
        data['reviewsData'] = reviewFind

        if (!req.body) {
            return res.status(400).json({ status: false, message: "details are missing for update" })
        }

        const { review, rating, reviewedBy } = req.body
        const updateDetail = {}
        if (review.trim() != '') {
            if (!Object.prototype.hasOwnProperty.call(updateDetail, '$set')){
                updateDetail['$set'] = {}
            }
            updateDetail['$set']['review'] = review
        }
        if (reviewedBy.trim() != '') {
            if (!Object.prototype.hasOwnProperty.call(updateDetail, '$set')){
                updateDetail['$set'] = {}
            }
            updateDetail['$set']['reviewedBy'] = reviewedBy
        }
        if (rating){
            if (!ratingRange(rating)) {
                return res.status(400).json({ status: false, message: "rating is invalid" })
            }
            if (!Object.prototype.hasOwnProperty.call(updateDetail, '$set')){
                updateDetail['$set'] = {}
            }
            updateDetail['$set']['rating'] = rating
        }
        const updatedReview = await reviewModel.findByIdAndUpdate(reviewId, updateDetail, { new: true });
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
        if (!reviewId && !bookId) {
            return res.status(404).json({ status: false, message: "review Id or book Id not found in params" })
        }
        if (!ObjectIdCheck(bookId) ) {
            return res.status(400).json({ status: false, message: "Object Id Is Invalid" });
        }
        if (!ObjectIdCheck(reviewId)) {
            return res.status(400).json({ status: false, message: "Object Id Is Invalid" });
        }
        const book = await bookModel.findOne({ _id: bookId, isDeleted: false });
        if (!book || book == null) {
            return res.status(404).json({ status: false, message: "book not found" })
        }
        const review = await reviewModel.findOne({ _id: reviewId, bookId: bookId, isDeleted: false });
        if (!review || review == null) {
            return res.status(404).json({ status: false, message: "review not found" })
        }
        if (bookId != review.bookId) {
            return res.status(400).json({ status: false, message: "book Id is invalid" })
        }
        const reviewUpdated = await reviewModel.findOneAndUpdate({ _id: reviewId, isDeleted: false }, { $set: { isDeleted: true } }, { new: true });
        book.reviews = book.reviews === 0 ? 0 : book.reviews - 1
        await book.save()
        res.status(200).json({ status: true, message: "Review deleted successfully" });
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



module.exports = {
    createReview,
    updateReview,
    deletedReview
}