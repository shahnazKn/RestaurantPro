import { useEffect, useState } from "react";
import RestaurantCard from "../components/RestaurantCard";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
function CustomerHome() {
    const [restaurants, setRestaurants] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetch(`${backendUrl}/api/restaurant/search`)
            .then(response => response.json())
            .then(data => setRestaurants(data.restaurants))
            .catch(error => console.error("Error fetching restaurants:", error));
    }, []);

    const filteredRestaurants = restaurants.filter(restaurant =>
        restaurant.restaurantName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div style={containerStyle}>
            <h1>Find Your Favorite Restaurant</h1>
            <input
                type="text"
                placeholder="Search restaurants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={searchStyle}
            />

            <div style={gridStyle}>
                {filteredRestaurants.length > 0 ? (
                    filteredRestaurants.map((restaurant) => (
                        <RestaurantCard key={restaurant._id} restaurant={restaurant} />
                    ))
                ) : (
                    <p>No restaurants found</p>
                )}
            </div>
        </div>
    );
}

const containerStyle = { textAlign: "center", padding: "20px" };
const searchStyle = { padding: "10px", width: "50%", marginBottom: "20px" };
const gridStyle = { display: "flex", flexWrap: "wrap", justifyContent: "center" };

export default CustomerHome;
