import { useNavigate } from "react-router-dom";

function HomePage() {
    const navigate = useNavigate();

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Restaurant Pro</h1>
            <button onClick={() => navigate("/signup/customer")} style={buttonStyle}>
                Sign Up as Customer
            </button>
            <button onClick={() => navigate("/signup/restaurant")} style={buttonStyle}>
                Sign Up as Restaurant Owner
            </button>
            <button onClick={() => navigate("/signin")} style={buttonStyle}>
                Sign In
            </button>
        </div>
    );
}

const buttonStyle = {
    display: "block",
    width: "250px",
    margin: "10px auto",
    padding: "10px",
    fontSize: "18px",
    cursor: "pointer"
};

export default HomePage;
