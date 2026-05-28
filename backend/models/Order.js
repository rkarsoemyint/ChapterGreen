const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true 
    },
    orderItems: [
        {
            book: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Book', 
                required: true
            },
            title: { type: String, required: true },
            quantity: { type: String, required: true },
            price: { type: Number, required: true },
            coverImage: { type: String }
        }
    ],
   
    shippingAddress: {
        name: { type: String, required: [true, 'Please add a recipient name'] },
        email: { type: String },
        phone: { type: String, required: [true, 'Please add a contact phone number'] },
        city: { type: String, required: [true, 'Please add a city'] },
        address: { type: String, required: [true, 'Please add a delivery address'] },
        state: { type: String },
        zipCode: { type: String }
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending' 
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['COD', 'Online'],
        default: 'COD'
    },
    paymentResult: {
        id: String,
        status: String,
        update_time: String,
        email_address: String
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false
    },
    paidAt: {
        type: Date
    }
});

module.exports = mongoose.model('Order', orderSchema);