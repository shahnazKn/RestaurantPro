import { useNavigate } from "react-router-dom";

function RestaurantCard({ restaurant }) {
    const navigate = useNavigate();

    return (
        <div style={cardStyle} onClick={() => navigate(`/restaurant/${restaurant._id}`)}>
            <h3>{restaurant.restaurantName}</h3>
            <p>{restaurant.address?.city}, {restaurant.address?.state}</p>
        </div>
    );
}

const cardStyle = {
    border: "1px solid #ddd",
    padding: "15px",
    margin: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    textAlign: "center",
    backgroundColor: "#f9f9f9",
    transition: "0.3s",
};

export default RestaurantCard;
