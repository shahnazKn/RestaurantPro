import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function loadRazorpay() {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
}

function Checkout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [orderDetails, setOrderDetails] = useState({
        items: location.state?.cartItems || [],
        totalAmount: location.state?.totalAmount || 0,
        deliveryAddress: '',
        phoneNumber: '',
    });

    useEffect(() => {
        console.log('Initial cart items:', location.state?.cartItems);
        if (!location.state?.cartItems || !location.state?.totalAmount) {
            navigate('/customer/home');
        }
        fetchCustomerDetails();
    }, [location.state, navigate]);

    const fetchCustomerDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${backendUrl}/api/customer/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch customer details');
            }

            const { customer } = await response.json();
            setOrderDetails(prev => ({
                ...prev,
                deliveryAddress: `${customer.address.street}, ${customer.address.city}, ${customer.address.state}, ${customer.address.postalCode}`,
                phoneNumber: customer.contactNumber || ''
            }));
        } catch (err) {
            console.error('Error fetching customer details:', err);
            setError('Failed to load your delivery information');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOrderDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Validate required fields
            if (!orderDetails.deliveryAddress.trim()) {
                throw new Error('Delivery address is required');
            }
            if (!orderDetails.phoneNumber.trim()) {
                throw new Error('Phone number is required');
            }
            if (!orderDetails.items.length) {
                throw new Error('No items in cart');
            }
            if (!orderDetails.totalAmount) {
                throw new Error('Invalid order amount');
            }

            console.log('Current order details:', orderDetails);
            console.log('Cart items before payment:', orderDetails.items);

            const res = await loadRazorpay();
            if (!res) {
                throw new Error('Razorpay SDK failed to load');
            }

            // Convert amount to paisa and prepare order data
            const orderData = {
                amount: Math.round(orderDetails.totalAmount * 100), // Convert to paisa
                items: orderDetails.items.map(item => {
                    console.log('Processing item:', item);
                    return {
                        _id: item._id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        restaurantId: item.restaurantId
                    };
                }),
                deliveryAddress: orderDetails.deliveryAddress.trim(),
                phoneNumber: orderDetails.phoneNumber.trim()
            };
            console.log('Final order data being sent:', orderData);

            // Create order on backend
            const response = await fetch(`${backendUrl}/api/payment/create-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(orderData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to create order');
            }

            const { orderId, amount, currency, keyId } = await response.json();

            const options = {
                key: keyId,
                amount: amount,
                currency: currency,
                name: "RestaurantPro",
                description: "Food Order Payment",
                order_id: orderId,
                handler: async function (response) {
                    try {
                        const verifyResponse = await fetch(`${backendUrl}/api/payment/verify-payment`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${localStorage.getItem('token')}`
                            },
                            body: JSON.stringify({
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_signature: response.razorpay_signature
                            })
                        });

                        if (!verifyResponse.ok) {
                            throw new Error('Payment verification failed');
                        }

                        navigate('/payment-success');
                    } catch (err) {
                        console.error('Payment verification error:', err);
                        navigate('/payment-cancel');
                    }
                },
                prefill: {
                    contact: orderDetails.phoneNumber,
                },
                theme: {
                    color: "#914F1E"
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="shadow">
                        <Card.Header 
                            style={{ 
                                backgroundColor: '#914F1E',
                                color: 'white'
                            }}
                        >
                            <h4 className="mb-0">Checkout</h4>
                        </Card.Header>
                        <Card.Body>
                            {error && (
                                <Alert variant="danger" className="mb-4">
                                    {error}
                                </Alert>
                            )}

                            <Form onSubmit={handlePayment}>
                                {/* Order Summary */}
                                <div className="mb-4">
                                    <h5>Order Summary</h5>
                                    {orderDetails.items.map((item, index) => (
                                        <div key={index} className="d-flex justify-content-between mb-2">
                                            <span>{item.name} x {item.quantity}</span>
                                            <span>₹{item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                    <hr />
                                    <div className="d-flex justify-content-between">
                                        <strong>Total Amount:</strong>
                                        <strong>₹{orderDetails.totalAmount}</strong>
                                    </div>
                                </div>

                                {/* Delivery Details */}
                                <Form.Group className="mb-3">
                                    <Form.Label>Delivery Address</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="deliveryAddress"
                                        value={orderDetails.deliveryAddress}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        name="phoneNumber"
                                        value={orderDetails.phoneNumber}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>

                                <div className="d-grid">
                                    <Button 
                                        type="submit" 
                                        disabled={loading}
                                        style={{ 
                                            backgroundColor: '#914F1E',
                                            borderColor: '#914F1E'
                                        }}
                                    >
                                        {loading ? 'Processing...' : 'Proceed to Pay'}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Checkout; 