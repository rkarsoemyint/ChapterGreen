const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a book title'],
        trim: true
    },
    author: {
        type: String,
        required: [true, 'Please add an author name']
    },
    description: {
        type: String,
        required: [true, 'Please add a book description']
    },
   
    publishedDate: {
        type: Date,
        default: Date.now
    },
   
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', 
        required: [true, 'Please add a book category']
    },
    coverImage: {
        type: String,
        default: 'no-photo.jpg' 
    },
    price: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0 
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Book', bookSchema);