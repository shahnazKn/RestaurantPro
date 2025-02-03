const Customer = require('../models/Customers');

// Get customer details
exports.getCustomerDetails = async (req, res) => {
    try {
        const { customerId } = req.user;
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ message: "Customer details not found." });
        }

        return res.status(200).json({ customer });
    } catch (error) {
        res.status(500).json({ message: "Error fetching customer details", error });
    }
};

// Update customer details
exports.updateCustomerDetails = async (req, res) => {
    try {
        const { customerId } = req.user;
        const { address } = req.body;
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ message: "Customer details not found." });
        }

        if (address){
            customer.address.street = address.street || customer.address.street;
            customer.address.city = address.city || customer.address.city;
            customer.address.state = address.state || customer.address.state;
            customer.address.postalCode = address.postalCode || customer.address.postalCode;
            customer.address.country = address.country || customer.address.country;
        }

        await customer.save();
        res.status(200).json({ message: 'Customer details updated' });

    } catch (error) {
        res.status(500).json({ message: "Error updating customer details", error });
    }
};