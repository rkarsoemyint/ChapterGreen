const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { getBooks, getBook, createBook, updateBook, deleteBook, rateBook } = require('./controllers/bookControllers');
const { register, login, googleAuth } = require('./controllers/authController');
const { protect, authorize } = require('./middleware/authMiddleware');
const { getCategories, createCategory, updateCategory, deleteCategory } = require('./controllers/categoryController'); 
const { createOrder, getMyOrders, getAllOrders, updateOrderStatus } = require('./controllers/orderController');
const Message = require('./models/Message');

dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
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

// ---  Newsletter Subscription Route  ---
app.post('/api/newsletter/subscribe', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: "Please provide a valid email address." });
        }

        console.log(`New Newsletter Subscriber: ${email}`);

        return res.status(200).json({ 
            success: true, 
            message: "Thank you for subscribing to our newsletter!" 
        });

    } catch (error) {
        console.error("Newsletter Error:", error);
        return res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }
});

// --- Contact Message Routes ---

//  Public Contact Route
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: "Please fill all fields." });
    }

    const fakeDomains = ['mailinator.com', '10minutemail.com', 'yopmail.com', 'tempmail.com', 'sharklasers.com'];
    const emailDomain = email.split('@')[1]?.toLowerCase();

    if (fakeDomains.includes(emailDomain)) {
      return res.status(400).json({ 
        success: false, 
        message: "Disposable or fake email addresses are not allowed. Please use a valid email." 
      });
    }

    const newMessage = await Message.create({ name, email, subject, message });
    res.status(201).json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Contact API Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Admin Fetch Route
app.get('/api/admin/messages', protect, authorize('admin'), async (req, res) => {
  try {
    const messages = await Message.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

//  Admin Mark as Read Route
app.put('/api/admin/messages/:id/read', protect, authorize('admin'), async (req, res) => {
  try {
    await Message.findByIdAndUpdate(req.params.id, { isRead: true });
    res.status(200).json({ success: true, message: "Marked as read." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Admin Delete Route
app.delete('/api/admin/messages/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    await Message.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Message deleted successfully." });
  } catch (error) {
    console.error("Delete API Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// --- Admin User Management Route ---

app.get('/api/admin/users', protect, authorize('admin'), async (req, res) => {
  try {
   
    const User = require('./models/User'); 
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    
    res.status(200).json({ 
      success: true, 
      count: users.length, 
      data: users 
    });
  } catch (error) {
    console.error("Fetch Users API Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

app.delete('/api/admin/users/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const User = require('./models/User');
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: "You cannot delete your own admin account!" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "User account deleted successfully." });
  } catch (error) {
    console.error("Delete User API Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});