import { useState } from "react";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

function CustomerSignup() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        address: {}
    });

    const [address, setAddress] = useState({
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: ""
    });

    const handleChange = (e) => {
        if (e.target.name == 'street' || e.target.name == 'city' ||
            e.target.name == 'state' || e.target.name == 'postalCode' ||
            e.target.name == 'country'
        ) {
            setAddress({ ...address, [e.target.name]: e.target.value });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        formData.address = address;
        const response = await fetch(`${backendUrl}/api/auth/customer/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        alert(data.message);
    };

    return (
        <div style={containerStyle}>
            <h2>Customer Signup</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required />
                <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="text" name="street" placeholder="Street" onChange={handleChange} required />
                <input type="text" name="city" placeholder="city" onChange={handleChange} required />
                <input type="text" name="state" placeholder="state" onChange={handleChange} required />
                <input type="text" name="postalCode" placeholder="postalCode" onChange={handleChange} required />
                <input type="text" name="country" placeholder="country" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
}

const containerStyle = { textAlign: "center", marginTop: "50px" };

export default CustomerSignup;
