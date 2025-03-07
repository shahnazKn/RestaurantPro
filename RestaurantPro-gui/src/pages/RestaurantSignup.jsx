import { useState } from "react";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

function RestaurantSignup() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        contactNumber: "",
        restaurantName: "",
        restaurantID: "",
        fssaiLicenceNumber: "",
        address: {},
        bankDetails: {}
    });

    const [address, setAddress] = useState({
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: ""
    });

    const [bankDetails, setBankDetails] = useState({
        accountNumber: "",
        ifscCode: "",
        bankName: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddressChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const handleBankChange = (e) => {
        setBankDetails({ ...bankDetails, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        formData.address = address;
        formData.bankDetails = bankDetails;
        const response = await fetch(`${backendUrl}/api/auth/restaurant/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        alert(data.message);
    };

    return (
        <div style={containerStyle}>
            <h2>Restaurant Owner Signup</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required />
                <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                <input type="text" name="contactNumber" placeholder="Contact Number" onChange={handleChange} required />
                <input type="text" name="restaurantName" placeholder="Restaurant Name" onChange={handleChange} required />
                <input type="text" name="restaurantID" placeholder="Restaurant ID" onChange={handleChange} required />
                Address:
                <input type="text" name="street" placeholder="Street" onChange={handleAddressChange} required />
                <input type="text" name="city" placeholder="city" onChange={handleAddressChange} required />
                <input type="text" name="state" placeholder="state" onChange={handleAddressChange} required />
                <input type="text" name="postalCode" placeholder="postalCode" onChange={handleAddressChange} required />
                <input type="text" name="country" placeholder="country" onChange={handleAddressChange} required />
                Bank details:
                <input type="text" name="accountNumber" placeholder="accountNumber" onChange={handleBankChange} required />
                <input type="text" name="ifscCode" placeholder="ifscCode" onChange={handleBankChange} required />
                <input type="text" name="bankName" placeholder="bankName" onChange={handleBankChange} required />
                <input type="text" name="fssaiLicenceNumber" placeholder="FSSAI Licence Number" onChange={handleChange} required />
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
}

const containerStyle = { textAlign: "center", marginTop: "50px" };

export default RestaurantSignup;
