const Customer = require('../models/Customers');

// Get customer details
exports.getCustomerDetails = async (req, res) => {
    try {
        const { customerId } = req.user;
        const customer = await Customer.findById(customerId);
        if (!customer){
            return res.status(404).json({ message: "Customer details not found." });
        }
        
        return res.status(200).json({ customer });
    } catch(error){
        res.status(500).json({ message: "Error fetching customer details", error});
    }
};