const Message = require('../models/Message');

// @desc    Send a new message (Customer / Contact Form မှ ပို့မည့်အပိုင်း)
// @route   POST /api/messages
exports.sendMessage = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        const newMessage = await Message.create({
            name,
            email,
            subject,
            message
        });

        res.status(201).json({ success: true, data: newMessage });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get all messages (Admin Dashboard အတွက်)
// @route   GET /api/messages
exports.getMessages = async (req, res) => {
    try {
        // နောက်ဆုံး ပို့လိုက်တဲ့ မက်ဆေ့ခ်ျတွေကို အပေါ်ဆုံးမှာ ပြရန်
        const messages = await Message.find().sort({ createdAt: -1 });
        
        res.status(200).json({ success: true, count: messages.length, data: messages });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Delete a message
// @route   DELETE /api/messages/:id
exports.deleteMessage = async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);

        if (!message) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }

        await message.deleteOne();
        res.status(200).json({ success: true, message: 'Message deleted successfully' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};