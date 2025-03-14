import { useState } from "react";
import { Container, Row, Col, Form, Button, Alert, Spinner, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function RestaurantSignup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        contactNumber: "",
        restaurantName: "",
        restaurantID: "",
        fssaiLicenceNumber: "",
        address: {},
        bankDetails: {}
    });

    const [address, setAddress] = useState({
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: ""
    });

    const [bankDetails, setBankDetails] = useState({
        accountNumber: "",
        ifscCode: "",
        bankName: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError("");
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddress(prev => ({ ...prev, [name]: value }));
        setError("");
    };

    const handleBankChange = (e) => {
        const { name, value } = e.target;
        setBankDetails(prev => ({ ...prev, [name]: value }));
        setError("");
    };

    const handleModalClose = () => {
        setShowSuccessModal(false);
        navigate('/');
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
                address,
                bankDetails
            };

            const ernakulamPostalRegex = /^682\d{3}$/;
            if (!ernakulamPostalRegex.test(dataToSubmit.address.postalCode)) {
                setError("Invalid postal code for Ernakulam, Kerala.");
                return;
            }

            const response = await fetch(`${backendUrl}/api/auth/signup/restaurant`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dataToSubmit)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Signup failed');
            }

            // Show success modal instead of redirecting
            setShowSuccessModal(true);
        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#F7DCB9' }}>
                <Row className="justify-content-center w-100">
                    <Col xs={12} sm={10} md={8} lg={6}>
                        <div className="bg-white p-4 rounded shadow" style={{ border: '2px solid #914F1E' }}>
                            <h2 className="text-center mb-4" style={{ color: '#914F1E' }}>Restaurant Registration</h2>

                            {error && (
                                <Alert variant="danger" className="mb-3">
                                    {error}
                                </Alert>
                            )}

                            <Form onSubmit={handleEmailValidation}>
                                <h5 className="mb-3">Personal Information</h5>
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

                                <Row>
                                    <Col md={6}>
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
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Contact Number</Form.Label>
                                            <Form.Control
                                                type="tel"
                                                name="contactNumber"
                                                value={formData.contactNumber}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

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

                                <h5 className="mt-4 mb-3">Restaurant Information</h5>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Restaurant Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="restaurantName"
                                                value={formData.restaurantName}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Restaurant ID</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="restaurantID"
                                                value={formData.restaurantID}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>FSSAI License Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="fssaiLicenceNumber"
                                        value={formData.fssaiLicenceNumber}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <h5 className="mt-4 mb-3">Restaurant Address</h5>
                                <Form.Group className="mb-3">
                                    <Form.Label>Street Address</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="street"
                                        value={address.street}
                                        onChange={handleAddressChange}
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
                                                onChange={handleAddressChange}
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
                                                onChange={handleAddressChange}
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
                                                maxLength={6}
                                                value={address.postalCode}
                                                onChange={handleAddressChange}
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
                                                onChange={handleAddressChange}
                                                required
                                            >
                                                <option value="India">India</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <h5 className="mt-4 mb-3">Bank Details</h5>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Account Number</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="accountNumber"
                                                value={bankDetails.accountNumber}
                                                onChange={handleBankChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>IFSC Code</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="ifscCode"
                                                value={bankDetails.ifscCode}
                                                onChange={handleBankChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-4">
                                    <Form.Label>Bank Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="bankName"
                                        value={bankDetails.bankName}
                                        onChange={handleBankChange}
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

            {/* Success Modal */}
            <Modal
                show={showSuccessModal}
                onHide={handleModalClose}
                centered
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header style={{ backgroundColor: '#F7DCB9', borderBottom: '2px solid #DEAC80' }}>
                    <Modal.Title style={{ color: '#914F1E' }}>Registration Submitted</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ backgroundColor: '#F7DCB9' }}>
                    <div className="text-center">
                        <i className="bi bi-check-circle-fill text-success display-4 mb-3"></i>
                        <p className="mb-3" style={{ color: '#914F1E', fontSize: '1.1rem' }}>
                            Thank you for registering your restaurant with us!
                        </p>
                        <p className="mb-3" style={{ color: '#914F1E' }}>
                            Our admin team will review your profile and verify the provided information.
                            You will receive an email notification once your account is approved.
                        </p>
                        <p style={{ color: '#914F1E' }}>
                            Thank you for your patience.
                        </p>
                    </div>
                </Modal.Body>
                <Modal.Footer style={{ backgroundColor: '#F7DCB9', borderTop: '2px solid #DEAC80' }}>
                    <Button
                        variant="primary"
                        onClick={handleModalClose}
                        style={{
                            backgroundColor: '#914F1E',
                            borderColor: '#914F1E',
                            width: '100%'
                        }}
                    >
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default RestaurantSignup;
