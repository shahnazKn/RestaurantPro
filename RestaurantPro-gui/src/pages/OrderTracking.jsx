import { useState, useEffect } from 'react';
import { Container, Card, Badge, ListGroup, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function OrderTracking() {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { orderId } = useParams();

    useEffect(() => {
        fetchOrderDetails();
        // Poll for updates every 30 seconds
        const interval = setInterval(fetchOrderDetails, 30000);
        return () => clearInterval(interval);
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/orders/${orderId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch order details');
            }

            const data = await response.json();
            setOrder(data.order);
            setError('');
        } catch (err) {
            setError('Failed to load order details');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'warning';
            case 'paid': return 'info';
            case 'preparing': return 'primary';
            case 'out_for_delivery': return 'info';
            case 'delivered': return 'success';
            case 'cancelled': return 'danger';
            case 'failed': return 'danger';
            default: return 'secondary';
        }
    };

    const getStatusText = (status) => {
        return status.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="py-5">
                <Card className="text-center">
                    <Card.Body>
                        <Card.Title className="text-danger">Error</Card.Title>
                        <Card.Text>{error}</Card.Text>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <Card className="shadow">
                <Card.Header 
                    className="d-flex justify-content-between align-items-center"
                    style={{ backgroundColor: '#914F1E', color: 'white' }}
                >
                    <h4 className="mb-0">Order #{order?._id}</h4>
                    <Badge bg={getStatusColor(order?.status)}>
                        {getStatusText(order?.status)}
                    </Badge>
                </Card.Header>
                <Card.Body>
                    <div className="mb-4">
                        <h5>Order Details</h5>
                        <p className="mb-1">
                            <strong>Restaurant:</strong> {order?.restaurant?.restaurantName}
                        </p>
                        <p className="mb-1">
                            <strong>Delivery Address:</strong> {order?.deliveryAddress}
                        </p>
                        <p className="mb-1">
                            <strong>Phone Number:</strong> {order?.phoneNumber}
                        </p>
                        <p className="mb-1">
                            <strong>Order Date:</strong> {new Date(order?.orderDate).toLocaleString()}
                        </p>
                    </div>

                    <div className="mb-4">
                        <h5>Items</h5>
                        <ListGroup variant="flush">
                            {order?.items.map((item, index) => (
                                <ListGroup.Item 
                                    key={index}
                                    className="d-flex justify-content-between align-items-center"
                                >
                                    <div>
                                        <h6 className="mb-0">{item.menuItem.name}</h6>
                                        <small className="text-muted">Quantity: {item.quantity}</small>
                                    </div>
                                    <span>₹{item.price * item.quantity}</span>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </div>

                    <div className="d-flex justify-content-between">
                        <h5>Total Amount:</h5>
                        <h5>₹{order?.totalAmount}</h5>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default OrderTracking; 