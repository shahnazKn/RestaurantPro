const Order = require('../models/Order');
const RestaurantOwner = require('../models/RestaurantOwner');

// Get all orders for a restaurant
const getRestaurantOrders = async (req, res) => {
    try {
        const { restaurantId } = req.user;
        const orders = await Order.find({ restaurant: restaurantId })
            .populate('user', 'name email')
            .populate('restaurant', 'menuItems')
            .sort({ orderDate: -1 });

        // Transform orders to include menu item names
        const transformedOrders = orders.map(order => {
            const orderObj = order.toObject();
            orderObj.items = orderObj.items.map(item => ({
                ...item,
                name: order.restaurant.menuItems.find(menuItem => 
                    menuItem._id.toString() === item.menuItem.toString()
                )?.name || 'Unknown Item'
            }));
            return orderObj;
        });

        res.json({ success: true, orders: transformedOrders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ success: false, message: 'Error fetching orders' });
    }
};

// Update order status
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { restaurantId } = req.user;
        const { status, reason, deliveryStaffId } = req.body;

        // Verify the order belongs to the restaurant
        const order = await Order.findOne({
            _id: orderId,
            restaurant: restaurantId
        });

        if (!order) {
            return res.status(404).json({ 
                success: false, 
                message: 'Order not found or not authorized' 
            });
        }

        // Validate status transition
        const validTransitions = {
            'paid': ['preparing', 'cancelled'],
            'preparing': ['out_for_delivery', 'delivered', 'cancelled'],
            'out_for_delivery': ['delivered', 'cancelled']
        };

        if (!validTransitions[order.status]?.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status transition'
            });
        }

        // If status is out_for_delivery, require delivery staff assignment
        if (status === 'out_for_delivery') {
            if (!deliveryStaffId) {
                return res.status(400).json({
                    success: false,
                    message: 'Delivery staff must be assigned for out for delivery status'
                });
            }

            // Get restaurant and verify delivery staff exists and is available
            const restaurant = await RestaurantOwner.findById(restaurantId);
            const deliveryStaff = restaurant.deliveryStaff.id(deliveryStaffId);

            if (!deliveryStaff) {
                return res.status(404).json({
                    success: false,
                    message: 'Delivery staff not found'
                });
            }

            if (!deliveryStaff.availability) {
                return res.status(400).json({
                    success: false,
                    message: 'Selected delivery staff is not available'
                });
            }

            // Update delivery staff availability
            deliveryStaff.availability = false;
            await restaurant.save();

            // Add delivery staff to order
            order.deliveryStaff = deliveryStaffId;
        }

        // If order is completed or cancelled, make delivery staff available again
        if (['delivered', 'cancelled'].includes(status) && order.deliveryStaff) {
            const restaurant = await RestaurantOwner.findById(restaurantId);
            const deliveryStaff = restaurant.deliveryStaff.id(order.deliveryStaff);
            if (deliveryStaff) {
                deliveryStaff.availability = true;
                await restaurant.save();
            }
        }

        // Update order status
        order.status = status;

        // If order is cancelled, require a reason
        if (status === 'cancelled' && !reason) {
            return res.status(400).json({
                success: false,
                message: 'Reason is required for cancelling an order'
            });
        }

        await order.save();

        // Get available delivery staff list if preparing status
        let availableStaff = [];
        if (status === 'preparing') {
            console.log("preparing status");
            const restaurant = await RestaurantOwner.findById(restaurantId);
            availableStaff = restaurant.deliveryStaff;
        }

        res.json({ 
            success: true, 
            message: 'Order status updated successfully',
            order,
            availableStaff: status === 'preparing' ? availableStaff : undefined
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error updating order status' 
        });
    }
};

// Get order details
const getOrderDetails = async (req, res) => {
    try {
        const { restaurantId } = req.user;
        const order = await Order.findOne({
            _id: req.params.orderId,
            restaurant: restaurantId
        })
        .populate('user', 'name email phoneNumber')
        .populate({
            path: 'restaurant',
            select: 'menuItems',
            populate: {
                path: 'menuItems',
                select: 'name price'
            }
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found or not authorized'
            });
        }

        res.json({ success: true, order });
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching order details'
        });
    }
};

// Add this new controller function
const getMyOrders = async (req, res) => {
    try {
        console.log("getMyOrders");
        const o = await Order.find({ user: req.user.customerId });
        console.log("customerId", req.user.customerId);
        console.log("getMyOrders", o);
        const orders = await Order.find({ user: req.user.customerId })
            .populate('restaurant', 'restaurantName')
            .populate('items', 'name price')
            .sort({ orderDate: -1 }); // Sort by date, newest first

        res.json({
            success: true,
            orders
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching orders'
        });
    }
};

module.exports = {
    getRestaurantOrders,
    updateOrderStatus,
    getOrderDetails,
    getMyOrders
};
