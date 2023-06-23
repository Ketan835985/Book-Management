const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true,
    },
    reviewedBy: {
        type: String,
        required: true,
        default: 'Guest',
        value : "reviewer's name"
    },
    reviewedAt: {
        type: Date,
        required: true,
        default: new Date(),
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },
    review: {
        type: String,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
})

module.exports = mongoose.model('Review', reviewSchema);