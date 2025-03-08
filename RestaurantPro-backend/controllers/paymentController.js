const Razorpay = require('razorpay');
const Order = require('../models/Order');
const crypto = require('crypto');

// Verify required environment variables
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error('Missing required Razorpay credentials');
    process.exit(1);
}

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Log successful initialization
console.log('Razorpay initialized successfully');

exports.createOrder = async (req, res) => {
    try {
        console.log('Request body:', req.body);
        console.log('User details:', req.user);

        const { amount, items, deliveryAddress, phoneNumber } = req.body;

        // Validate required fields
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Valid amount is required' });
        }

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Valid items array is required' });
        }

        if (!deliveryAddress) {
            return res.status(400).json({ message: 'Delivery address is required' });
        }

        if (!phoneNumber) {
            return res.status(400).json({ message: 'Phone number is required' });
        }

        // Get restaurant ID from the first item
        const restaurantId = items[0].restaurantId;
        if (!restaurantId) {
            return res.status(400).json({ message: 'Restaurant ID is required' });
        }

        console.log('Creating Razorpay order with amount:', amount);

        // Create Razorpay order
        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(amount * 100), // Convert to smallest currency unit (paise)
            currency: 'INR',
            receipt: `order_${Date.now()}`,
            notes: {
                userId: req.user.customerId,
                restaurantId: restaurantId,
                deliveryAddress: deliveryAddress,
                phoneNumber: phoneNumber
            }
        });

        console.log('Razorpay order created:', razorpayOrder);

        // Create order in our database
        const order = new Order({
            user: req.user.customerId,
            restaurant: restaurantId,
            items: items.map(item => ({
                menuItem: item._id,
                quantity: item.quantity,
                price: item.price
            })),
            totalAmount: amount,
            deliveryAddress,
            phoneNumber,
            razorpayOrderId: razorpayOrder.id,
            status: 'pending'
        });

        await order.save();
        console.log('Order saved in database:', order._id);

        // Send the order ID and key to client
        res.json({
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            keyId: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        console.error('Order Creation Error:', error);
        res.status(500).json({ 
            message: 'Error creating order',
            error: error.message 
        });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        // Verify signature
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign)
            .digest("hex");

        if (razorpay_signature !== expectedSign) {
            return res.status(400).json({ message: "Invalid signature" });
        }

        // Update order status
        const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
        if (order) {
            order.status = 'paid';
            order.paymentStatus = 'completed';
            order.razorpayPaymentId = razorpay_payment_id;
            await order.save();
        }

        res.json({ 
            message: "Payment verified successfully",
            orderId: order._id
        });
    } catch (error) {
        console.error('Payment Verification Error:', error);
        res.status(500).json({ message: 'Error verifying payment' });
    }
};