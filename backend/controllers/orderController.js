const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private 
exports.createOrder = async (req, res) => {
    try {
        
        const { 
            orderItems, 
            shippingAddress, 
            totalPrice, 
            paymentMethod, 
            isPaid, 
            paidAt 
        } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ success: false, message: 'No order items provided' });
        }

        const order = await Order.create({
            user: req.user._id, 
            orderItems,
            shippingAddress, 
            totalPrice,
            paymentMethod,   
            isPaid,          
            paidAt          
        });

        res.status(201).json({ success: true, data: order });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        
        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 }); 

        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


// @desc    Update order status 
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        const updateFields = {
            status: req.body.status
        };

        if (req.body.status === 'Delivered') {
            updateFields.isPaid = true;
            updateFields.paidAt = new Date(); 
        }

        
        if (req.body.status === 'Cancelled' && order.paymentMethod === 'COD') {
            updateFields.isPaid = false;
            updateFields.paidAt = null;
        }

        
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { $set: updateFields },
            { 
                new: true, 
                runValidators: false 
            }
        );

        res.status(200).json({ success: true, data: updatedOrder });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};