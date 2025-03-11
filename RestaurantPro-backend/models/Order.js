const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RestaurantOwner',
        required: true
    },
    items: [{
        menuItem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MenuItem',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    deliveryAddress: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'preparing', 'out_for_delivery', 'delivered', 'cancelled', 'failed'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    razorpayOrderId: {
        type: String,
        required: false
    },
    razorpayPaymentId: {
        type: String,
        required: false
    },
    razorpaySignature: {
        type: String,
        required: false
    },
    orderDate: {
        type: Date,
        default: Date.now,
        index: true
    }
}, {
    timestamps: true
});

// Add static method to clean up old pending orders
orderSchema.statics.cleanupPendingOrders = async function() {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago
    try {
        const result = await this.deleteMany({
            status: 'pending',
            orderDate: { $lt: twoHoursAgo }
        });
        console.log(`Cleaned up ${result.deletedCount} pending orders older than 2 hours`);
    } catch (error) {
        console.error('Error cleaning up pending orders:', error);
    }
};

module.exports = mongoose.model('Order', orderSchema);
