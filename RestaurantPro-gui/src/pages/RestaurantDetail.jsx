import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
function RestaurantDetail() {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);

    useEffect(() => {
        fetch(`${backendUrl}/api/restaurant/search/${id}`)
            .then(response => response.json())
            .then(data => setRestaurant(data.restaurant))
            .catch(error => console.error("Error fetching restaurant details:", error));
    }, [id]);

    if (!restaurant) {
        return <p>Loading...</p>;
    }

    return (
        <div style={containerStyle}>
            <h1>{restaurant.restaurantName}</h1>
            <p>{restaurant.address?.city}, {restaurant.address?.state}</p>
            <h3>Menu Items</h3>
            <ul>
                {restaurant.menuItems.map((item) => (
                    <li key={item._id}>
                        {item.name} - ${item.price}
                    </li>
                ))}
            </ul>
        </div>
    );
}

const containerStyle = { textAlign: "center", padding: "20px" };

export default RestaurantDetail;
