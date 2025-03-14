import { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button, Badge, Tabs, Tab, Spinner, Alert, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import emailjs from 'emailjs-com';
import PropTypes from 'prop-types';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

function AdminDashboard() {
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState('pending');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [restaurantToReject, setRestaurantToReject] = useState(null);

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

            const response = await fetch(`${backendUrl}/api/admin/restaurants`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch restaurants');
            }

            const data = await response.json();
            setRestaurants(data);
        } catch (err) {
            setError(err.message || 'Failed to load restaurants');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (restaurantId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${backendUrl}/api/admin/verify-restaurant/${restaurantId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to verify restaurant');
            } else {
                    const templateParams = {
                      to_email: restaurants[0].email, 
                      from_name: "Restaurant Pro",
                      name: restaurants[0].firstName
                    };
                  
                    emailjs.send(
                      "service_pdz9l6r", 
                      "template_75gubyl", 
                      templateParams, 
                      "ELMjEPk-rsMIPNRJT"
                    ).then(response => {
                      console.log("Email sent successfully!", response);
                    }).catch(error => {
                      console.error("Error sending email:", error);
                    });
            }

            await fetchRestaurants();
        } catch (err) {
            setError(err.message || 'Failed to verify restaurant');
        }
    };

    const handleRejectClick = (restaurant) => {
        setRestaurantToReject(restaurant);
        setShowConfirmModal(true);
    };

    const handleReject = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${backendUrl}/api/admin/reject-restaurant/${restaurantToReject._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to reject restaurant');
            }

            setShowConfirmModal(false);
            setRestaurantToReject(null);
            await fetchRestaurants();
        } catch (err) {
            setError(err.message || 'Failed to reject restaurant');
        }
    };

    const filteredRestaurants = restaurants.filter(restaurant => {
        if (activeTab === 'pending') return !restaurant.isVerified;
        return restaurant.isVerified;
    });

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
        <>
            <Container fluid className="py-4">
                <Row className="mb-4">
                    <Col>
                        <h2 style={{ color: '#914F1E' }}>Admin Dashboard</h2>
                    </Col>
                </Row>

                {error && (
                    <Alert variant="danger" onClose={() => setError("")} dismissible>
                        {error}
                    </Alert>
                )}

                <Tabs
                    activeKey={activeTab}
                    onSelect={(k) => setActiveTab(k)}
                    className="mb-4"
                    style={{ borderBottom: '2px solid #DEAC80' }}
                >
                    <Tab 
                        eventKey="pending" 
                        title={
                            <span>
                                Pending Verification{' '}
                                <Badge bg="warning">
                                    {restaurants.filter(r => !r.isVerified).length}
                                </Badge>
                            </span>
                        }
                    >
                        <RestaurantTable 
                            restaurants={filteredRestaurants}
                            handleVerify={handleVerify}
                            handleReject={handleRejectClick}
                            isPending={true}
                        />
                    </Tab>
                    <Tab 
                        eventKey="verified" 
                        title={
                            <span>
                                Verified Restaurants{' '}
                                <Badge bg="success">
                                    {restaurants.filter(r => r.isVerified).length}
                                </Badge>
                            </span>
                        }
                    >
                        <RestaurantTable 
                            restaurants={filteredRestaurants}
                            handleVerify={handleVerify}
                            handleReject={handleRejectClick}
                            isPending={false}
                        />
                    </Tab>
                </Tabs>
            </Container>

            {/* Confirmation Modal */}
            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
                <Modal.Header closeButton style={{ backgroundColor: '#F7DCB9', borderBottom: '2px solid #DEAC80' }}>
                    <Modal.Title style={{ color: '#914F1E' }}>Confirm Rejection</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ backgroundColor: '#F7DCB9' }}>
                    <p style={{ color: '#914F1E' }}>
                        Are you sure you want to reject and remove {restaurantToReject?.restaurantName}?
                        This action cannot be undone.
                    </p>
                </Modal.Body>
                <Modal.Footer style={{ backgroundColor: '#F7DCB9', borderTop: '2px solid #DEAC80' }}>
                    <Button 
                        variant="secondary" 
                        onClick={() => setShowConfirmModal(false)}
                    >
                        Cancel
                    </Button>
                    <Button 
                        variant="danger" 
                        onClick={handleReject}
                    >
                        Reject
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

function RestaurantTable({ restaurants, handleVerify, handleReject, isPending }) {
    return (
        <div className="table-responsive">
            <Table hover bordered style={{ backgroundColor: 'white' }}>
                <thead>
                    <tr>
                        <th>Restaurant Name</th>
                        <th>Owner Name</th>
                        <th>Contact</th>
                        <th>Location</th>
                        <th>FSSAI License</th>
                        <th>Status</th>
                        {isPending && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {restaurants.length === 0 ? (
                        <tr>
                            <td colSpan={isPending ? 7 : 6} className="text-center">
                                No restaurants found
                            </td>
                        </tr>
                    ) : (
                        restaurants.map((restaurant) => (
                            <tr key={restaurant._id}>
                                <td>{restaurant.restaurantName}</td>
                                <td>{`${restaurant.firstName} ${restaurant.lastName}`}</td>
                                <td>
                                    <div>{restaurant.email}</div>
                                    <div>{restaurant.contactNumber}</div>
                                </td>
                                <td>
                                    <div>{restaurant.address.city}</div>
                                    <div>{restaurant.address.state}</div>
                                </td>
                                <td>{restaurant.fssaiLicenceNumber}</td>
                                <td>
                                    <Badge bg={restaurant.isVerified ? 'success' : 'warning'}>
                                        {restaurant.isVerified ? 'Verified' : 'Pending'}
                                    </Badge>
                                </td>
                                {isPending && (
                                    <td>
                                        <div className="d-flex gap-2">
                                            <Button
                                                variant="outline-success"
                                                size="sm"
                                                onClick={() => handleVerify(restaurant._id)}
                                            >
                                                Verify
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleReject(restaurant)}
                                            >
                                                Reject
                                            </Button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>
        </div>
    );
}

RestaurantTable.propTypes = {
    restaurants: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string.isRequired,
        restaurantName: PropTypes.string.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        contactNumber: PropTypes.string.isRequired,
        address: PropTypes.shape({
            city: PropTypes.string.isRequired,
            state: PropTypes.string.isRequired
        }).isRequired,
        fssaiLicenceNumber: PropTypes.string.isRequired,
        isVerified: PropTypes.bool.isRequired
    })).isRequired,
    handleVerify: PropTypes.func.isRequired,
    handleReject: PropTypes.func.isRequired,
    isPending: PropTypes.bool.isRequired
};

export default AdminDashboard; 