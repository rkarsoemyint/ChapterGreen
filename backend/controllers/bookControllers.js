const Book = require('../models/Book');

// @desc    Get all books
// @route   GET /api/books
exports.getBooks = async (req, res) => {
    try {
        const books = await Book.find().populate('category', 'name');  
        if (!books) {
            return res.status(404).json({ success: false, message: 'Books not found' });
        }
        res.status(200).json({ success: true, count: books.length, data: books });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get single book 
// @route   GET /api/books/:id
exports.getBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('category', 'name');

        if (!book) {
            return res.status(404).json({ success: false, message: 'Book not found' });
        }

        res.status(200).json({ success: true, data: book });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Create new book
// @route   POST /api/books
exports.createBook = async (req, res) => {
    try {
       
        const bookData = { ...req.body };
        if (bookData.image) {
            bookData.coverImage = bookData.image;
        }

        const book = await Book.create(bookData);
        res.status(201).json({ success: true, data: book });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ success: false, message: 'Book not found' });
        }

        await book.deleteOne();
        res.status(200).json({ success: true, message: 'Book deleted successfully' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Update a book
// @route   PUT /api/books/:id
exports.updateBook = async (req, res) => {
    try {
        let book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ success: false, message: 'Book not found' });
        }

        const updateData = { ...req.body };
        if (updateData.image) {
            updateData.coverImage = updateData.image;
        }

        book = await Book.findByIdAndUpdate(req.params.id, updateData, {
            returnDocument: 'after',
            runValidators: true 
        }).populate('category', 'name'); 

        res.status(200).json({ success: true, data: book });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Rate a book
// @route   PUT /api/books/:id/rate
// @access  Private 

exports.rateBook = async (req, res) => {
    try {
        const { rating } = req.body; 

      
        if (rating < 0 || rating > 5) {
            return res.status(400).json({ success: false, message: 'Rating must be between 0 and 5' });
        }

       
        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            { rating: Number(rating) },
            { new: true, runValidators: true }
        );

        if (!updatedBook) {
            return res.status(404).json({ success: false, message: 'Book not found' });
        }

    
        res.status(200).json({ success: true, data: updatedBook });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};