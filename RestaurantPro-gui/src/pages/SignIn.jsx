import { useState } from "react";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

function SignIn() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`${backendUrl}/api/auth/signin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        alert(data.message);
    };

    return (
        <div style={containerStyle}>
            <h2>Sign In</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                <button type="submit">Sign In</button>
            </form>
        </div>
    );
}

const containerStyle = { textAlign: "center", marginTop: "50px" };

export default SignIn;
