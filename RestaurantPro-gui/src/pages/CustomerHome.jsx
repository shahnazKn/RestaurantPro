import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Form, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FiClock, FiSearch, FiMapPin } from 'react-icons/fi';
import './CustomerHome.css';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function CustomerHome() {
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/signin');
                return;
            }

            const response = await fetch(`${backendUrl}/api/restaurant/search`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch restaurants');
            }

            const data = await response.json();
            setRestaurants(data.restaurants);
        } catch (err) {
            console.error('Failed to load restaurants:', err);
        } finally {
            setLoading(false);
        }
    };

    const isRestaurantOpen = (timings) => {
        if (!timings?.open || !timings?.close) return false;
        
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        
        const [openHours, openMinutes] = timings.open.split(':').map(Number);
        const [closeHours, closeMinutes] = timings.close.split(':').map(Number);
        
        const openTime = openHours * 60 + openMinutes;
        const closeTime = closeHours * 60 + closeMinutes;
        
        return currentTime >= openTime && currentTime <= closeTime;
    };

    const filteredRestaurants = restaurants.filter(restaurant => 
        restaurant.restaurantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.address?.city?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
        <Container fluid className="py-4" style={{ backgroundColor: '#F7DCB9', minHeight: '100vh' }}>
            <Container>
                {/* Search Bar */}
                <Row className="mb-4">
                    <Col md={8} className="mx-auto">
                        <InputGroup size="lg">
                            <InputGroup.Text style={{ backgroundColor: 'white', borderRight: 'none' }}>
                                <FiSearch size={20} color="#914F1E" />
                            </InputGroup.Text>
                            <Form.Control
                                placeholder="Search restaurants by name or city..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ 
                                    borderLeft: 'none',
                                    boxShadow: 'none',
                                    borderColor: '#ced4da'
                                }}
                            />
                        </InputGroup>
                    </Col>
                </Row>

                {/* Restaurant Cards */}
                <Row xs={1} md={2} lg={3} className="g-4">
                    {filteredRestaurants.map((restaurant) => {
                        const isOpen = isRestaurantOpen(restaurant.timings);
                        return (
                            <Col key={restaurant._id}>
                                <Card 
                                    className="h-100 restaurant-card"
                                    style={{
                                        cursor: isOpen ? 'pointer' : 'not-allowed',
                                        opacity: isOpen ? 1 : 0.7,
                                        transition: 'all 0.3s ease',
                                        border: '1px solid #DEAC80'
                                    }}
                                    onClick={() => isOpen && navigate(`/restaurant/${restaurant._id}/menu`)}
                                >
                                    <Card.Body>
                                        <Card.Title className="d-flex justify-content-between align-items-start mb-3">
                                            <span style={{ color: '#914F1E', fontSize: '1.25rem' }}>
                                                {restaurant.restaurantName}
                                            </span>
                                            <Badge bg={isOpen ? 'success' : 'danger'}>
                                                {isOpen ? 'Open' : 'Closed'}
                                            </Badge>
                                        </Card.Title>
                                        
                                        <div className="mb-3 text-muted d-flex align-items-center">
                                            <FiMapPin className="me-2" />
                                            <small>
                                                {restaurant.address?.street}, {restaurant.address?.city}
                                            </small>
                                        </div>

                                        <div className="d-flex align-items-center text-muted">
                                            <FiClock className="me-2" />
                                            <small>
                                                {restaurant.timings?.open} - {restaurant.timings?.close}
                                            </small>
                                        </div>

                                        <div className="mt-3">
                                            {restaurant.deliveryAvailable && (
                                                <Badge bg="info" className="me-2">Delivery</Badge>
                                            )}
                                            {restaurant.takeAwayAvailable && (
                                                <Badge bg="primary" className="me-2">Take Away</Badge>
                                            )}
                                            {restaurant.dineInAvailable && (
                                                <Badge bg="success">Dine In</Badge>
                                            )}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>

                {filteredRestaurants.length === 0 && (
                    <div className="text-center mt-5">
                        <h3 style={{ color: '#914F1E' }}>No restaurants found</h3>
                        <p className="text-muted">Try adjusting your search criteria</p>
                    </div>
                )}
            </Container>
        </Container>
    );
}

export default CustomerHome;
