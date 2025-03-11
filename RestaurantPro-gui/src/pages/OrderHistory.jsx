import { useState, useEffect } from 'react';
import { Container, Card, Table, Badge, Button, Modal, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/signin');
                return;
            }

            const response = await fetch(`${backendUrl}/api/orders/my-orders`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }

            const data = await response.json();
            // Sort orders by date (latest first)
            const sortedOrders = data.orders.sort((a, b) => 
                new Date(b.orderDate) - new Date(a.orderDate)
            );
            setOrders(sortedOrders);
        } catch (err) {
            setError(err.message || 'Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setShowOrderModal(true);
    };

    const getStatusBadgeColor = (status) => {
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

    const formatStatus = (status) => {
        return status.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    if (loading) {
        return <div className="text-center mt-5">Loading...</div>;
    }

    return (
        <Container className="py-4">
            <Card className="shadow">
                <Card.Header 
                    className="d-flex justify-content-between align-items-center"
                    style={{ backgroundColor: '#914F1E', color: 'white' }}
                >
                    <h4 className="mb-0">Order History</h4>
                </Card.Header>
                <Card.Body>
                    {error && <div className="alert alert-danger">{error}</div>}
                    
                    {orders.length === 0 ? (
                        <div className="text-center py-4">
                            <p>No orders found</p>
                        </div>
                    ) : (
                        <Table responsive hover>
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Restaurant</th>
                                    <th>Items</th>
                                    <th>Total Amount</th>
                                    <th>Status</th>
                                    <th>Order Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order._id}>
                                        <td>{order._id}</td>
                                        <td>{order.restaurant.restaurantName}</td>
                                        <td>
                                            <Button
                                                variant="link"
                                                onClick={() => handleViewOrder(order)}
                                            >
                                                View Items ({order.items.length})
                                            </Button>
                                        </td>
                                        <td>₹{order.totalAmount / 100}</td>
                                        <td>
                                            <Badge bg={getStatusBadgeColor(order.status)}>
                                                {formatStatus(order.status)}
                                            </Badge>
                                        </td>
                                        <td>
                                            {new Date(order.orderDate).toLocaleString('en-IN', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>

            {/* Order Details Modal */}
            <Modal 
                show={showOrderModal} 
                onHide={() => setShowOrderModal(false)}
                size="lg"
                centered
            >
                <Modal.Header closeButton style={{ backgroundColor: '#F7DCB9', borderBottom: '2px solid #DEAC80' }}>
                    <Modal.Title style={{ color: '#914F1E' }}>Order Details</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ backgroundColor: '#F7DCB9' }}>
                    {selectedOrder && (
                        <>
                            <div className="mb-4">
                                <h6>Order Information</h6>
                                <Table borderless size="sm">
                                    <tbody>
                                        <tr>
                                            <td><strong>Order ID:</strong></td>
                                            <td>{selectedOrder._id}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Restaurant:</strong></td>
                                            <td>{selectedOrder.restaurant.restaurantName}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Status:</strong></td>
                                            <td>
                                                <Badge bg={getStatusBadgeColor(selectedOrder.status)}>
                                                    {formatStatus(selectedOrder.status)}
                                                </Badge>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><strong>Delivery Address:</strong></td>
                                            <td>{selectedOrder.deliveryAddress}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Phone Number:</strong></td>
                                            <td>{selectedOrder.phoneNumber}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Order Date:</strong></td>
                                            <td>
                                                {new Date(selectedOrder.orderDate).toLocaleString('en-IN', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>

                            <div className="mb-4">
                                <h6>Order Items</h6>
                                <ListGroup variant="flush">
                                    {selectedOrder.items.map((item, index) => (
                                        <ListGroup.Item 
                                            key={index}
                                            className="d-flex justify-content-between align-items-center"
                                            style={{ backgroundColor: 'transparent' }}
                                        >
                                            <div>
                                                <h6 className="mb-0">{item.menuItem.name}</h6>
                                                <small className="text-muted">Quantity: {item.quantity}</small>
                                            </div>
                                            <span>₹{(item.price * item.quantity) / 100}</span>
                                        </ListGroup.Item>
                                    ))}
                                    <ListGroup.Item 
                                        className="d-flex justify-content-between align-items-center"
                                        style={{ backgroundColor: 'transparent', fontWeight: 'bold' }}
                                    >
                                        <span>Total Amount</span>
                                        <span>₹{selectedOrder.totalAmount / 100}</span>
                                    </ListGroup.Item>
                                </ListGroup>
                            </div>

                            <div className="d-flex justify-content-end">
                                <Button
                                    variant="primary"
                                    onClick={() => navigate(`/order-tracking/${selectedOrder._id}`)}
                                    style={{ backgroundColor: '#914F1E', borderColor: '#914F1E' }}
                                >
                                    Track Order
                                </Button>
                            </div>
                        </>
                    )}
                </Modal.Body>
            </Modal>
        </Container>
    );
}

export default OrderHistory; 