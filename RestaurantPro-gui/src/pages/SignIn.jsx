import { useState } from "react";
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function SignIn() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(""); // Clear error when user starts typing
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        
        try {
            const response = await fetch(`${backendUrl}/api/auth/signin`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
                credentials: 'include'
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Sign in failed');
            }

            if (data.token) {
                localStorage.setItem('token', data.token);
                console.log('User Role from API:', data.userRole); // Debug log
                localStorage.setItem('userRole', data.userRole);
            }

            // Redirect based on user role
            const storedRole = localStorage.getItem('userRole');
            console.log('Stored Role:', storedRole); // Debug log

            switch (data.userRole) {
                case 'Customer':
                    navigate('/customer/home');
                    break;
                case 'Admin':
                    navigate('/admin/dashboard');
                    break;
                case 'RestaurantOwner':
                    navigate('/restaurant/dashboard');
                    break;
                default:
                    console.log('Invalid role:', data.userRole); // Debug log
                    throw new Error('Invalid user role');
            }
        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#F7DCB9' }}>
            <Row className="justify-content-center w-100">
                <Col xs={12} sm={8} md={6} lg={4}>
                    <div className="bg-white p-4 rounded shadow" style={{ border: '2px solid #914F1E' }}>
                        <h2 className="text-center mb-4" style={{ color: '#914F1E' }}>Welcome Back</h2>
                        
                        {error && (
                            <Alert variant="danger" className="mb-3">
                                {error}
                            </Alert>
                        )}

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Button 
                                variant="primary" 
                                type="submit" 
                                className="w-100"
                                disabled={loading}
                                style={{ 
                                    backgroundColor: '#914F1E',
                                    borderColor: '#914F1E'
                                }}
                            >
                                {loading ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                            className="me-2"
                                        />
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </Button>
                        </Form>

                        <div className="text-center mt-4">
                            <p className="mb-3" style={{ color: '#914F1E' }}>Don&apos;t have an account?</p>
                            <Row className="g-2">
                                <Col>
                                    <Button 
                                        variant="outline-primary" 
                                        onClick={() => navigate('/signup/customer')}
                                        className="w-100"
                                        style={{ 
                                            color: '#914F1E',
                                            borderColor: '#914F1E'
                                        }}
                                    >
                                        Sign Up
                                    </Button>
                                </Col>
                                <Col>
                                    <Button 
                                        variant="outline-primary" 
                                        onClick={() => navigate('/signup/restaurant')}
                                        className="w-100"
                                        style={{ 
                                            color: '#914F1E',
                                            borderColor: '#914F1E'
                                        }}
                                    >
                                        Partner with Us
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default SignIn;
