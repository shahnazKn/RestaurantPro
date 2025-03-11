const cron = require('node-cron');
const Order = require('../models/Order');

// Schedule cleanup job to run every hour
const scheduleCleanupJobs = () => {
    // Run every hour at minute 0
    cron.schedule('0 * * * *', async () => {
        console.log('Running pending orders cleanup job...');
        await Order.cleanupPendingOrders();
    });
};

module.exports = {
    scheduleCleanupJobs
}; 