const Message = require('../models/Message');

// @desc    Subscribe to Newsletter
// @route   POST /api/newsletter/subscribe
exports.subscribeNewsletter = async (req, res) => {
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
};

// @desc    Send Contact Message (With Fake Email Validation)
// @route   POST /api/contact
exports.sendContactMessage = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ success: false, message: "Please fill all fields." });
        }
        
        // Fake/Disposable Domain Logic
        const fakeDomains = ['mailinator.com', '10minutemail.com', 'yopmail.com', 'tempmail.com', 'sharklasers.com'];
        const emailDomain = email.split('@')[1]?.toLowerCase();
        if (fakeDomains.includes(emailDomain)) {
            return res.status(400).json({ 
                success: false, 
                message: "Disposable or fake email addresses are not allowed. Please use a valid email." 
            });
        }
        
        await Message.create({ name, email, subject, message });
        res.status(201).json({ success: true, message: "Message sent successfully!" });
    } catch (error) {
        console.error("Contact API Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Get All Messages (Admin)
// @route   GET /api/admin/messages
exports.getAdminMessages = async (req, res) => {
    try {
        const messages = await Message.find({}).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: messages });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Mark Message as Read (Admin)
// @route   PUT /api/admin/messages/:id/read
exports.readAdminMessage = async (req, res) => {
    try {
        await Message.findByIdAndUpdate(req.params.id, { isRead: true });
        res.status(200).json({ success: true, message: "Marked as read." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Delete Message (Admin)
// @route   DELETE /api/admin/messages/:id
exports.deleteAdminMessage = async (req, res) => {
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
};