const mongoose = require('mongoose');
const userModel = require('../models/userModel');
const bookModel = require('../models/bookModel');
const reviewModel = require('../models/reviewModel');

const ObjectIdCheck = (Id) => {
    if (mongoose.Types.ObjectId.isValid(Id)) return true
    return false
}

const userCheck = async(ID) => {
    const user = await userModel.findById(ID);
    if(user) return true
    return false
}

const bookCheck = async(ID) => {
    const book = await bookModel.findById(ID);
    if(book) return true
    return false
}

const reviewsCheck = async(ID) => {
    const book = await reviewModel.findById(ID);
    if(book) return true
    return false
}


module.exports = {
    ObjectIdCheck,
    userCheck,
    bookCheck,
    reviewsCheck
}