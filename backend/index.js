const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// --- Controllers Import ---
const { getBooks, getBook, createBook, updateBook, deleteBook, rateBook } = require('./controllers/bookControllers');
const { register, login, googleAuth } = require('./controllers/authController');
const { protect, authorize } = require('./middleware/authMiddleware');
const { getCategories, createCategory, updateCategory, deleteCategory } = require('./controllers/categoryController'); 
const { createOrder, getMyOrders, getAllOrders, updateOrderStatus } = require('./controllers/orderController');
const { getUsers, deleteUser } = require('./controllers/userController');

const { 
    subscribeNewsletter, 
    sendContactMessage, 
    getAdminMessages, 
    readAdminMessage, 
    deleteAdminMessage 
} = require('./controllers/messageControllers');

dotenv.config();
connectDB();
const app = express();

// --- Middleware ---
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true
}));
app.use(express.json());

// --- Base Route ---
app.get('/', (req, res) => {
    res.send('BookBound API is running...');
});

// --- Book Routes ---
app.get('/api/books', getBooks);
app.get('/api/books/:id', getBook);
app.post('/api/books', protect, authorize('admin'), createBook);
app.put('/api/books/:id', protect, authorize('admin'), updateBook);
app.delete('/api/books/:id', protect, authorize('admin'), deleteBook);
app.put('/api/books/:id/rate', protect, rateBook);

// --- Category Routes ---
app.get('/api/categories', getCategories);
app.post('/api/categories', protect, authorize('admin'), createCategory);
app.put('/api/categories/:id', protect, authorize('admin'), updateCategory);
app.delete('/api/categories/:id', protect, authorize('admin'), deleteCategory);

// --- Auth Routes ---
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.post('/api/auth/google', googleAuth);

// --- Order Routes ---
app.post('/api/orders', protect, createOrder);
app.get('/api/orders/myorders', protect, getMyOrders);
app.get('/api/orders', protect, authorize('admin'), getAllOrders);
app.put('/api/orders/:id/status', protect, authorize('admin'), updateOrderStatus);

// ---  Message & Newsletter Routes  ---
app.post('/api/newsletter/subscribe', subscribeNewsletter);
app.post('/api/contact', sendContactMessage);
app.get('/api/admin/messages', protect, authorize('admin'), getAdminMessages);
app.put('/api/admin/messages/:id/read', protect, authorize('admin'), readAdminMessage);
app.delete('/api/admin/messages/:id', protect, authorize('admin'), deleteAdminMessage);

// --- Admin User Management Routes ---
app.get('/api/admin/users', protect, authorize('admin'), getUsers);
app.delete('/api/admin/users/:id', protect, authorize('admin'), deleteUser);

// --- Server Listen ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});