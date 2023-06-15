const mongoose = require('mongoose');
/*{
  bookId: {ObjectId, mandatory, refs to book model},
  reviewedBy: {string, mandatory, default 'Guest', value: reviewer's name},
  reviewedAt: {Date, mandatory},
  rating: {number, min 1, max 5, mandatory},
  review: {string, optional}
  isDeleted: {boolean, default: false},
}*/
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
    },
    reviewedAt: {
        type: Date,
        required: true,
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