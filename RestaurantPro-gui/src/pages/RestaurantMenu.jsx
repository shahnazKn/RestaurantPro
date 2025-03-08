import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Spinner, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Cart from '../components/Cart';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function RestaurantMenu() {
    const { restaurantId } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        fetchRestaurantDetails();
        fetchMenuItems();
    }, [restaurantId]);

    const fetchRestaurantDetails = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/restaurant/search/${restaurantId}`);
            if (!response.ok) throw new Error('Failed to fetch restaurant details');
            const data = await response.json();
            setRestaurant(data.restaurant);
        } catch (error) {
            console.error('Error fetching restaurant details:', error);
        }
    };

    const fetchMenuItems = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/restaurant/menu/${restaurantId}`);
            if (!response.ok) throw new Error('Failed to fetch menu items');
            const data = await response.json();
            setMenuItems(data.menuItems);
        } catch (error) {
            console.error('Error fetching menu items:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (item) => {
        console.log('Adding item to cart with restaurantId:', restaurantId);
        console.log('Item being added:', item);
        
        setCartItems(prev => {
            const existingItem = prev.find(i => i._id === item._id);
            if (existingItem) {
                if (existingItem.quantity >= item.stock) return prev;
                return prev.map(i => 
                    i._id === item._id 
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            }
            const newItem = { ...item, quantity: 1, restaurantId };
            console.log('New item with restaurantId:', newItem);
            return [...prev, newItem];
        });
    };

    const updateQuantity = (itemId, newQuantity) => {
        if (newQuantity === 0) {
            removeItem(itemId);
            return;
        }
        setCartItems(prev => 
            prev.map(item => 
                item._id === itemId 
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    const removeItem = (itemId) => {
        setCartItems(prev => prev.filter(item => item._id !== itemId));
    };

    // Group menu items by category
    const categorizedItems = menuItems.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
    }, {});

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <Spinner animation="border" role="status" style={{ color: '#914F1E' }}>
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    return (
        <Container className="py-4">
            {/* Restaurant Header */}
            <Card className="mb-4 border-0 shadow-sm">
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-start">
                        <div>
                            <h2 className="mb-3" style={{ color: '#914F1E' }}>{restaurant?.restaurantName}</h2>
                            <p className="text-muted mb-2">{restaurant?.address?.street}, {restaurant?.address?.city}</p>
                            <div className="d-flex gap-2">
                                {restaurant?.deliveryAvailable && <Badge bg="info">Delivery</Badge>}
                                {restaurant?.takeAwayAvailable && <Badge bg="primary">Take Away</Badge>}
                                {restaurant?.dineInAvailable && <Badge bg="success">Dine In</Badge>}
                            </div>
                        </div>
                        <Button 
                            variant="outline-primary" 
                            onClick={() => setShowCart(true)}
                            className="position-relative"
                        >
                            View Cart
                            {cartItems.length > 0 && (
                                <Badge 
                                    bg="danger" 
                                    className="position-absolute top-0 start-100 translate-middle"
                                >
                                    {cartItems.length}
                                </Badge>
                            )}
                        </Button>
                    </div>
                </Card.Body>
            </Card>

            {/* Menu Items by Category */}
            {Object.entries(categorizedItems).map(([category, items]) => (
                <div key={category} className="mb-5">
                    <h3 className="mb-4" style={{ color: '#914F1E' }}>{category}</h3>
                    <Row>
                        {items.map((item) => (
                            <Col key={item._id} xs={12} md={6} lg={4} className="mb-4">
                                <Card className="h-100 border-0 shadow-sm">
                                    <Card.Body>
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div>
                                                <h5 className="mb-2">{item.name}</h5>
                                                <p className="text-muted mb-2">{item.description}</p>
                                                <h6 className="mb-2">₹{item.price}</h6>
                                                <small className="text-muted">
                                                    {item.stock > 0 ? `${item.stock} left` : 'Out of stock'}
                                                </small>
                                            </div>
                                            <div className="d-flex flex-column align-items-end">
                                                {item.isVeg ? (
                                                    <Badge bg="success">Veg</Badge>
                                                ) : (
                                                    <Badge bg="danger">Non-Veg</Badge>
                                                )}
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    className="mt-2"
                                                    onClick={() => addToCart(item)}
                                                    disabled={!item.stock || item.stock === 0 || 
                                                        cartItems.find(i => i._id === item._id)?.quantity >= item.stock}
                                                >
                                                    {item.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                                </Button>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            ))}

            {menuItems.length === 0 && (
                <div className="text-center mt-5">
                    <h3 style={{ color: '#914F1E' }}>No menu items available</h3>
                    <p className="text-muted">This restaurant hasn&apos;t added any items yet</p>
                </div>
            )}

            <Cart 
                show={showCart}
                handleClose={() => setShowCart(false)}
                cartItems={cartItems}
                updateQuantity={updateQuantity}
                removeItem={removeItem}
            />
        </Container>
    );
}

RestaurantMenu.propTypes = {
    restaurant: PropTypes.shape({
        restaurantName: PropTypes.string,
        address: PropTypes.shape({
            street: PropTypes.string,
            city: PropTypes.string
        }),
        deliveryAvailable: PropTypes.bool,
        takeAwayAvailable: PropTypes.bool,
        dineInAvailable: PropTypes.bool
    })
};

export default RestaurantMenu; 