const bookModel = require('../models/bookModel');
const validator = require('validator');
const { ObjectIdCheck } = require('../utils/verification');
const reviewModel = require('../models/reviewModel');
const userModel = require('../models/userModel');
const moment = require('moment')
const uploadFile = require('../aws/aws');

const dateFormat = 'YYYY-MM-DD'
const createBook = async (req, res) => {
    try {
        const { title, excerpt, releasedAt, userId, subcategory, category, ISBN } = req.body
        if (!title || !excerpt || !userId || !subcategory || !category || !ISBN || !releasedAt) {
            return res.status(400).json({ status: false, message: 'All fields are required' });
        }
        if (!ObjectIdCheck(userId)) {
            return res.status(400).json({ status: false, message: 'User Id is invalid' });
        }
        const titleBook = await bookModel.findOne({ title: title });
        if (titleBook) {
            return res.status(400).json({ status: false, message: 'Title already exists' });
        }
        const user = await userModel.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ status: false, message: 'User does not exist' });
        }
        if (!releasedAt || !moment(releasedAt, dateFormat, true).isValid()) {
            return res.status(400).json({ status: false, message: 'date is invalid' });
        }
        
        else {
            const IsbnBook = await bookModel.findOne({ ISBN: ISBN });
            if (IsbnBook) {
                return res.status(400).json({ status: false, message: 'ISBN already exists' });
            }
            else {
                
                const bookDetails = {
                    title: title,
                    excerpt: excerpt,
                    userId: userId,
                    ISBN: ISBN,
                    category: category,
                    subcategory: subcategory,
                    releasedAt: releasedAt,
                    
                }
                const book = await bookModel.create(bookDetails);
                return res.status(201).json({ status: true, data: book });
            }
        }
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

const bookCover = async(req, res) => {
    try {
        const files = req.files
        if(!files && files.length==0){
            return res.status(400).json({ status: false, message: 'No file uploaded' });
        }
        const data = await uploadFile(files[0]);
        res.status(200).json({
            status: true,
            data : data
        })
    }
    catch(err){
        res.status(500).json({ status: false, message: err.message })
    }
}



const getBooks = async (req, res) => {
    try {
        const frequency = { isDeleted: false }
        const paramsQuery = req.query;
        if (paramsQuery) {
            const { userId, category, subcategory } = paramsQuery;
            if (userId.trim() !== '' && ObjectIdCheck(userId) && userId) {
                frequency[userId] = userId;
            }
            if (category) {
                frequency[category] = category;
            }
            if (subcategory) {
                frequency[subcategory] = subcategory;
            }
        }


        const books = await bookModel.find(frequency).sort({ title: 1 }).select({ _id: 1, title: 1, excerpt: 1, releasedAt: 1, userId: 1, category: 1, review: 1 });
        if (books.length == 0 && Array.isArray(books)) {
            return res.status(404).send({ status: false, message: "Book not found" })
        }
        return res.status(200).json({ status: true, message: 'Books list', data: books });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
}


const getBooksById = async (req, res) => {
    try {
        const bookId = req.params.bookId;
        if (!ObjectIdCheck(bookId)) {
            return res.status(400).json({ status: false, message: 'Book Id is invalid' });
        }
        const book = await bookModel.findOne({ _id: bookId, isDeleted: false });
        if (!book) {
            return res.status(404).json({ status: false, message: 'Book does not exist' });
        }
        const reviewsData = await reviewModel.find({ bookId: bookId, isDeleted: false })
        const data = book.toObject();
        data["reviewsData"] = reviewsData;
        res.status(200).json({ status: true, data: data });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
}

const updateBook = async (req, res) => {
    try {
        const bookId = req.params.bookId;
        const userId = req.userId;
        if (!bookId) {
            return res.status(404).json({ status: false, message: 'Book Id is required' });
        }
        if (!ObjectIdCheck(bookId)) {
            return res.status(400).json({ status: false, message: 'Book Id is invalid' });
        }
        const book = await bookModel.findOne({ _id: bookId, isDeleted: false });
        if (!book) {
            return res.status(404).json({ status: false, message: 'Book does not exist' });
        }
        if (book.userId.toString() !== userId) {
            return res.status(403).json({ status: false, message: 'Access denied' });
        }

        const updateBookDetail = {}

        const { title, excerpt, ISBN, releasedAt } = req.body;
        if (title.trim() != '') {
            const titleCheck = await bookModel.findOne({ title: title })
            if (titleCheck) {
                return res.status(400).json({ status: false, message: 'duplicate title' })
            }
            if (!Object.prototype.hasOwnProperty.call(updateBookDetail, '$set')) {
                updateBookDetail['$set'] = {};
            }

            updateBookDetail['$set']['title'] = title
        }
        if (ISBN.trim() != '') {
            const isbnCheck = await bookModel.findOne({ ISBN: ISBN })
            if (isbnCheck) {
                return res.status(400).json({ status: false, message: 'duplicate ISBN' })
            }
            if (!Object.prototype.hasOwnProperty.call(updateBookDetail, '$set')) {
                updateBookDetail['$set'] = {};
            }
            updateBookDetail['$set']['ISBN'] = ISBN
        }
        if (excerpt.trim() != '') {
            if (!Object.prototype.hasOwnProperty.call(updateBookDetail, '$set')) {
                updateBookDetail['$set'] = {};
            }
            updateBookDetail['$set']['excerpt'] = excerpt
        }
        if (releasedAt.trim() != '') {
            if (!Object.prototype.hasOwnProperty.call(updateBookDetail, '$set')) {
                updateBookDetail['$set'] = {};
            }
            updateBookDetail['$set']['releasedAt'] = releasedAt
        }
        const updateBookData = await bookModel.findOneAndUpdate({ _id: bookId }, updateBookDetail, { new: true });
        res.status(200).json({ status: true, message: "Update book Success", data: updateBookData });
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


const deleteBookById = async (req, res) => {
    try {
        const bookId = req.params.bookId;
        if (!ObjectIdCheck(bookId)) {
            return res.status(400).json({ status: false, message: 'Book Id is invalid' });
        }
        const book = await bookModel.findOne({ _id: bookId, isDeleted: false });
        if (!book) {
            return res.status(404).json({ status: false, message: 'Book does not exist' });
        }
        if (book.userId.toString() !== req.userId) {
            return res.status(403).json({ status: false, message: 'Access denied' });
        }
        const deleteBook = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true });
        if (deleteBook) {
        return res.status(200).json({ status: true, message: "Delete book Successfully" });
        }
    } catch (error) {
        if (error.message.includes('validation')) {
            return res.status(400).send({ status: false, message: error.message })
        } else if (error.message.includes('duplicate')) {
            return res.status(400).send({ status: false, message: error.message })
        } else {
            res.status(404).json({ status: false, message: error.message })
        }
    }
}
module.exports = {
    createBook,
    getBooks,
    getBooksById,
    updateBook,
    deleteBookById,
    bookCover
}