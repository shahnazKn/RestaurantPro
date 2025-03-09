import { useState, useEffect } from 'react';
import { Table, Badge, Button, Form, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function OrderManagementTab({ setError }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        fetchOrders();
        // Poll for new orders every minute
        const interval = setInterval(fetchOrders, 60000);
        return () => clearInterval(interval);
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/orders/restaurant/orders`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }

            const data = await response.json();
            setOrders(data.orders);
            setError('');
        } catch (err) {
            setError('Failed to load orders');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await fetch(`${backendUrl}/api/orders/restaurant/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) {
                throw new Error('Failed to update order status');
            }

            // Update the order in the local state
            setOrders(prevOrders => 
                prevOrders.map(order => 
                    order._id === orderId 
                        ? { ...order, status: newStatus }
                        : order
                )
            );
            setError('');
        } catch (err) {
            setError('Failed to update order status');
            console.error('Error:', err);
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

    const filteredOrders = filterStatus === 'all' 
        ? orders 
        : orders.filter(order => order.status === filterStatus);

    if (loading) {
        return <div>Loading orders...</div>;
    }

    return (
        <div>
            <Row className="mb-4">
                <Col md={4}>
                    <Form.Group>
                        <Form.Label>Filter by Status</Form.Label>
                        <Form.Select 
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">All Orders</option>
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="preparing">Preparing</option>
                            <option value="out_for_delivery">Out for Delivery</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>

            <div className="table-responsive">
                <Table striped hover>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Items</th>
                            <th>Total Amount</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map(order => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>
                                    <div>{order.user?.firstName} {order.user?.lastName}</div>
                                    <small className="text-muted">{order.phoneNumber}</small>
                                </td>
                                <td>
                                    {order.items.map((item, index) => (
                                        <div key={index}>
                                            {item.menuItem.name} x {item.quantity}
                                        </div>
                                    ))}
                                </td>
                                <td>₹{order.totalAmount}</td>
                                <td>
                                    <Badge bg={getStatusColor(order.status)}>
                                        {order.status}
                                    </Badge>
                                </td>
                                <td>
                                    {order.status === 'paid' && (
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            onClick={() => updateOrderStatus(order._id, 'preparing')}
                                        >
                                            Start Preparing
                                        </Button>
                                    )}
                                    {order.status === 'preparing' && (
                                        <Button
                                            variant="outline-info"
                                            size="sm"
                                            onClick={() => updateOrderStatus(order._id, 'out_for_delivery')}
                                        >
                                            Send for Delivery
                                        </Button>
                                    )}
                                    {order.status === 'out_for_delivery' && (
                                        <Button
                                            variant="outline-success"
                                            size="sm"
                                            onClick={() => updateOrderStatus(order._id, 'delivered')}
                                        >
                                            Mark as Delivered
                                        </Button>
                                    )}
                                    {['pending', 'paid'].includes(order.status) && (
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            className="ms-2"
                                            onClick={() => updateOrderStatus(order._id, 'cancelled')}
                                        >
                                            Cancel Order
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
}

OrderManagementTab.propTypes = {
    setError: PropTypes.func.isRequired
};

export default OrderManagementTab; 