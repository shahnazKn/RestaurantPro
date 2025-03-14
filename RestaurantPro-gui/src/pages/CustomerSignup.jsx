import { useState } from "react";
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function CustomerSignup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        address: {}
    });

    const [address, setAddress] = useState({
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (['street', 'city', 'state', 'postalCode', 'country'].includes(name)) {
            setAddress(prev => ({ ...prev, [name]: value }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        setError("");
    };

    const handleEmailValidation = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const { email } = formData;
            const response = await fetch(`https://emailvalidation.abstractapi.com/v1/?api_key=4f16243cd77e41fdb5590c3b888ddb6a&email=${email}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });

            const data = await response.json();
            const isValidEmail = data.is_smtp_valid.text;

            if (isValidEmail === "TRUE") {
                handleSubmit(e);
            } else {
                throw new Error(data.message || 'Not a valid email');
            }

        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const dataToSubmit = {
                ...formData,
                address: address
            };

            const ernakulamPostalRegex = /^682\d{3}$/;
            if (!ernakulamPostalRegex.test(dataToSubmit.address.postalCode)) {
                setError("Invalid postal code for Ernakulam, Kerala.");
                return;
            }

            const response = await fetch(`${backendUrl}/api/auth/signup/customer`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dataToSubmit)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Signup failed');
            }

            // Show success message and redirect to sign in
            alert('Registration successful! Please sign in.');
            navigate('/signin');
        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#F7DCB9' }}>
            <Row className="justify-content-center w-100">
                <Col xs={12} sm={10} md={8} lg={6}>
                    <div className="bg-white p-4 rounded shadow" style={{ border: '2px solid #914F1E' }}>
                        <h2 className="text-center mb-4" style={{ color: '#914F1E' }}>Customer Registration</h2>

                        {error && (
                            <Alert variant="danger" className="mb-3">
                                {error}
                            </Alert>
                        )}

                        <Form onSubmit={handleEmailValidation}>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>First Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Last Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group className="mb-3">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength={6}
                                />
                                <Form.Text className="text-muted">
                                    Password must be at least 6 characters long
                                </Form.Text>
                            </Form.Group>

                            <h5 className="mt-4 mb-3">Address Information</h5>

                            <Form.Group className="mb-3">
                                <Form.Label>Street Address</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="street"
                                    value={address.street}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>City</Form.Label>
                                        <Form.Select
                                            name="city"
                                            value={address.city}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select a city</option>
                                            <option value="Ernakulam">Ernakulam</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>State</Form.Label>
                                        <Form.Select
                                            name="state"
                                            value={address.state}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="Kerala">Kerala</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Postal Code</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="postalCode"
                                            value={address.postalCode}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Country</Form.Label>
                                        <Form.Select
                                            name="country"
                                            value={address.country}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="India">India</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Button
                                variant="primary"
                                type="submit"
                                className="w-100 mt-3"
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
                                        Creating Account...
                                    </>
                                ) : (
                                    'Sign Up'
                                )}
                            </Button>
                        </Form>

                        <div className="text-center mt-3">
                            <p className="mb-0">
                                Already have an account?{" "}
                                <Button
                                    variant="link"
                                    onClick={() => navigate('/signin')}
                                    style={{ color: '#914F1E', textDecoration: 'none' }}
                                >
                                    Sign In
                                </Button>
                            </p>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default CustomerSignup;
