import { useState, useEffect } from 'react';
import { Container, Row, Col, Tabs, Tab, Form, Button, Table, Badge, Modal, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

function RestaurantDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('menu');
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Menu States
    const [showMenuModal, setShowMenuModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingItemId, setEditingItemId] = useState(null);
    const [menuItem, setMenuItem] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        type: 'veg',
        stock: 0
    });

    // Staff States
    const [showStaffModal, setShowStaffModal] = useState(false);
    const [staffMember, setStaffMember] = useState({
        name: '',
        idProofNumber: ''
    });

    // Timing States
    const [timings, setTimings] = useState({
        open: '',
        close: ''
    });

    // Add new state for password update
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Add state for service options
    const [serviceOptions, setServiceOptions] = useState({
        deliveryAvailable: false,
        takeAwayAvailable: false,
        dineInAvailable: false,
        dineInCapacity: 0
    });

    // Add state for timing update alert
    const [showTimingAlert, setShowTimingAlert] = useState(false);

    // Add new state for orders management
    const [showOrderActionModal, setShowOrderActionModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderAction, setOrderAction] = useState({
        status: '',
        reason: '',
        deliveryStaffId: ''
    });

    // Add new state for orders
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);

    // Add common food categories
    const foodCategories = [
        'Starters',
        'Soups',
        'Salads',
        'Main Course',
        'Biriyani',
        'Breads',
        'Rice & Noodles',
        'Tandoor',
        'Chinese',
        'Desserts',
        'Beverages',
        'Snacks',
        'Thalis',
        'Combos'
    ];

    // Add state for available staff
    const [availableStaff, setAvailableStaff] = useState([]);

    useEffect(() => {
        fetchRestaurantDetails();
        fetchOrders();
    }, []);

    useEffect(() => {
        if (restaurant) {
            setServiceOptions({
                deliveryAvailable: restaurant.deliveryAvailable || false,
                takeAwayAvailable: restaurant.takeAwayAvailable || false,
                dineInAvailable: restaurant.dineInAvailable || false,
                dineInCapacity: restaurant.dineInCapacity || 0
            });
        }
    }, [restaurant]);

    const fetchRestaurantDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/signin');
                return;
            }

            const response = await fetch(`${backendUrl}/api/restaurant`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch restaurant details');
            }

            const data = await response.json();
            setRestaurant(data.restaurant);
            if (data.restaurant?.timings) {
                setTimings(data.restaurant.timings);
            }
        } catch (err) {
            setError(err.message || 'Failed to load restaurant details');
        } finally {
            setLoading(false);
        }
    };

    // Add fetchOrders function
    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/signin');
                return;
            }

            const response = await fetch(`${backendUrl}/api/orders/restaurant-orders`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }

            const data = await response.json();
            if (data.success) {
                setOrders(data.orders);
            }
        } catch (err) {
            setError(err.message || 'Failed to load orders');
        } finally {
            setOrdersLoading(false);
        }
    };

    // Menu Management
    const handleAddMenuItem = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${backendUrl}/api/restaurant/menu`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(menuItem)
            });

            if (!response.ok) {
                throw new Error('Failed to add menu item');
            }

            setShowMenuModal(false);
            setMenuItem({ name: '', description: '', price: '', category: '', type: 'veg', stock: 0 });
            await fetchRestaurantDetails();
        } catch (err) {
            setError(err.message || 'Failed to add menu item');
        }
    };

    const handleDeleteMenuItem = async (menuId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${backendUrl}/api/restaurant/menu/${menuId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete menu item');
            }

            await fetchRestaurantDetails();
        } catch (err) {
            setError(err.message || 'Failed to delete menu item');
        }
    };

    const handleEditMenuItem = (item) => {
        setMenuItem({
            name: item.name,
            description: item.description || '',
            price: item.price,
            category: item.category,
            type: item.type,
            stock: item.stock
        });
        setEditingItemId(item._id);
        setIsEditing(true);
        setShowMenuModal(true);
    };

    const handleUpdateMenuItem = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${backendUrl}/api/restaurant/menu/${editingItemId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(menuItem)
            });

            if (!response.ok) {
                throw new Error('Failed to update menu item');
            }

            setShowMenuModal(false);
            setIsEditing(false);
            setEditingItemId(null);
            setMenuItem({ name: '', description: '', price: '', category: '', type: 'veg', stock: 0 });
            await fetchRestaurantDetails();
        } catch (err) {
            setError(err.message || 'Failed to update menu item');
        }
    };

    // Staff Management
    const handleAddStaff = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${backendUrl}/api/restaurant/staff`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(staffMember)
            });

            if (!response.ok) {
                throw new Error('Failed to add staff member');
            }

            setShowStaffModal(false);
            setStaffMember({ name: '', idProofNumber: '' });
            await fetchRestaurantDetails();
        } catch (err) {
            setError(err.message || 'Failed to add staff member');
        }
    };

    const handleDeleteStaff = async (staffId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${backendUrl}/api/restaurant/staff/${staffId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete staff member');
            }

            await fetchRestaurantDetails();
        } catch (err) {
            setError(err.message || 'Failed to delete staff member');
        }
    };

    // Update Timings
    const handleUpdateTimings = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${backendUrl}/api/restaurant/update`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ timings })
            });

            if (!response.ok) {
                throw new Error('Failed to update timings');
            }

            await fetchRestaurantDetails();
            setShowTimingAlert(true);
            setTimeout(() => setShowTimingAlert(false), 3000); // Hide alert after 3 seconds
        } catch (err) {
            setError(err.message || 'Failed to update timings');
        }
    };

    // Password Update Handler
    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError("New passwords don't match");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${backendUrl}/api/restaurant/update-password`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update password');
            }

            setShowPasswordModal(false);
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setError('');
            // Show success message
            alert('Password updated successfully');
        } catch (err) {
            setError(err.message || 'Failed to update password');
        }
    };

    // Add handler for service options update
    const handleServiceOptionsUpdate = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${backendUrl}/api/restaurant/update`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(serviceOptions)
            });

            if (!response.ok) {
                throw new Error('Failed to update service options');
            }

            await fetchRestaurantDetails();
            // Show success message
            alert('Service options updated successfully');
        } catch (err) {
            setError(err.message || 'Failed to update service options');
        }
    };

    // Update handleOrderAction function
    const handleOrderAction = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${backendUrl}/api/orders/update-status/${selectedOrder._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status: orderAction.status.toLowerCase().replace(/ /g, '_'),
                    reason: orderAction.reason,
                    deliveryStaffId: orderAction.deliveryStaffId
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update order status');
            }

            const data = await response.json();
            
            // Update available staff list if preparing status
            if (data.availableStaff) {
                setAvailableStaff(data.availableStaff);
            }

            setShowOrderActionModal(false);
            setSelectedOrder(null);
            setOrderAction({ status: '', reason: '', deliveryStaffId: '' });
            
            // Refresh both orders and restaurant details to update staff status
            await Promise.all([
                fetchOrders(),
                fetchRestaurantDetails()
            ]);
            
            // Show success message with specific text based on status
            const statusMessages = {
                'preparing': 'Order is now being prepared',
                'out_for_delivery': 'Order is out for delivery',
                'delivered': 'Order has been marked as delivered',
                'cancelled': 'Order has been cancelled'
            };
            alert(statusMessages[orderAction.status.toLowerCase().replace(/ /g, '_')] || 'Order status updated successfully');
        } catch (err) {
            setError(err.message || 'Failed to update order status');
        }
    };

    // Add function to get status badge color
    const getOrderStatusBadgeColor = (status) => {
        switch (status) {
            case 'Pending':
                return 'warning';
            case 'Accepted':
                return 'info';
            case 'Preparing':
                return 'primary';
            case 'Out for Delivery':
                return 'info';
            case 'Delivered':
                return 'success';
            case 'Declined':
            case 'Rejected':
                return 'danger';
            default:
                return 'secondary';
        }
    };

    // Add new handler for updating staff availability
    const handleUpdateStaffAvailability = async (staffId, newAvailability) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${backendUrl}/api/restaurant/staff/${staffId}/availability`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ availability: newAvailability })
            });

            if (!response.ok) {
                throw new Error('Failed to update staff availability');
            }

            await fetchRestaurantDetails();
        } catch (err) {
            setError(err.message || 'Failed to update staff availability');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Container fluid className="py-4">

            {error && (
                <Alert variant="danger" onClose={() => setError('')} dismissible>
                    {error}
                </Alert>
            )}

            <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-4"
                style={{ borderBottom: '2px solid #DEAC80' }}
            >
                {/* Profile Tab */}
                <Tab eventKey="profile" title="Profile">
                    <Card>
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h4>Restaurant Profile</h4>
                                <Button 
                                    variant="primary" 
                                    onClick={() => setShowPasswordModal(true)}
                                    style={{ backgroundColor: '#914F1E', borderColor: '#914F1E' }}
                                >
                                    Change Password
                                </Button>
                            </div>
                            <Row>
                                <Col md={6}>
                                    <h5 className="mb-3">Basic Information</h5>
                                    <Table borderless>
                                        <tbody>
                                            <tr>
                                                <td><strong>Restaurant Name:</strong></td>
                                                <td>{restaurant?.restaurantName}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Owner Name:</strong></td>
                                                <td>{restaurant?.firstName} {restaurant?.lastName}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Email:</strong></td>
                                                <td>{restaurant?.email}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Contact Number:</strong></td>
                                                <td>{restaurant?.contactNumber}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>FSSAI License:</strong></td>
                                                <td>{restaurant?.fssaiLicenceNumber}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Col>
                                <Col md={6}>
                                    <h5 className="mb-3">Address</h5>
                                    <Table borderless>
                                        <tbody>
                                            <tr>
                                                <td><strong>Street:</strong></td>
                                                <td>{restaurant?.address?.street}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>City:</strong></td>
                                                <td>{restaurant?.address?.city}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>State:</strong></td>
                                                <td>{restaurant?.address?.state}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Zip Code:</strong></td>
                                                <td>{restaurant?.address?.zipCode}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Country:</strong></td>
                                                <td>{restaurant?.address?.country}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                            <Row className="mt-4">
                                <Col md={6}>
                                    <h5 className="mb-3">Bank Details</h5>
                                    <Table borderless>
                                        <tbody>
                                            <tr>
                                                <td><strong>Bank Name:</strong></td>
                                                <td>{restaurant?.bankDetails?.bankName}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Account Number:</strong></td>
                                                <td>
                                                    {restaurant?.bankDetails?.accountNumber?.replace(/\d(?=\d{4})/g, "*")}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><strong>IFSC Code:</strong></td>
                                                <td>{restaurant?.bankDetails?.ifscCode}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Col>
                                <Col md={6}>
                                    <h5 className="mb-3">Service Options</h5>
                                    <Card className="p-3">
                                        <Form>
                                            <Form.Group className="mb-3">
                                                <Form.Check
                                                    type="switch"
                                                    id="delivery-switch"
                                                    label="Delivery Service"
                                                    checked={serviceOptions.deliveryAvailable}
                                                    onChange={(e) => setServiceOptions({
                                                        ...serviceOptions,
                                                        deliveryAvailable: e.target.checked
                                                    })}
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Check
                                                    type="switch"
                                                    id="takeaway-switch"
                                                    label="Take Away Service"
                                                    checked={serviceOptions.takeAwayAvailable}
                                                    onChange={(e) => setServiceOptions({
                                                        ...serviceOptions,
                                                        takeAwayAvailable: e.target.checked
                                                    })}
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Check
                                                    type="switch"
                                                    id="dinein-switch"
                                                    label="Dine In Service"
                                                    checked={serviceOptions.dineInAvailable}
                                                    onChange={(e) => setServiceOptions({
                                                        ...serviceOptions,
                                                        dineInAvailable: e.target.checked
                                                    })}
                                                />
                                            </Form.Group>
                                            {serviceOptions.dineInAvailable && (
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Seating Capacity</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        min="1"
                                                        value={serviceOptions.dineInCapacity}
                                                        onChange={(e) => setServiceOptions({
                                                            ...serviceOptions,
                                                            dineInCapacity: parseInt(e.target.value) || 0
                                                        })}
                                                    />
                                                </Form.Group>
                                            )}
                                            <div className="d-flex justify-content-end">
                                                <Button
                                                    variant="primary"
                                                    onClick={handleServiceOptionsUpdate}
                                                    style={{ backgroundColor: '#914F1E', borderColor: '#914F1E' }}
                                                >
                                                    Update Service Options
                                                </Button>
                                            </div>
                                        </Form>
                                    </Card>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Tab>

                {/* Menu Management Tab */}
                <Tab eventKey="menu" title="Menu Management">
                    <Card className="mb-4">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4>Menu Items</h4>
                                <Button 
                                    variant="primary" 
                                    onClick={() => setShowMenuModal(true)}
                                    style={{ backgroundColor: '#914F1E', borderColor: '#914F1E' }}
                                >
                                    Add Menu Item
                                </Button>
                            </div>
                            <Table responsive hover>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Description</th>
                                        <th>Price</th>
                                        <th>Category</th>
                                        <th>Type</th>
                                        <th>Stock</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {restaurant?.menuItems.map((item) => (
                                        <tr key={item._id}>
                                            <td>{item.name}</td>
                                            <td>{item.description}</td>
                                            <td>₹{item.price}</td>
                                            <td>{item.category}</td>
                                            <td>
                                                <Badge bg={
                                                    item.type === 'veg' ? 'success' : 
                                                    item.type === 'non-veg' ? 'danger' : 
                                                    'warning'
                                                }>
                                                    {item.type}
                                                </Badge>
                                            </td>
                                            <td>{item.stock}</td>
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        onClick={() => handleEditMenuItem(item)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={() => handleDeleteMenuItem(item._id)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Tab>

                {/* Timings Tab */}
                <Tab eventKey="timings" title="Restaurant Timings">
                    <Card>
                        <Card.Body>
                            <h4 className="mb-4">Operating Hours</h4>
                            {showTimingAlert && (
                                <Alert variant="success" className="mb-3">
                                    Restaurant timings updated successfully!
                                </Alert>
                            )}
                            <Form onSubmit={handleUpdateTimings}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Opening Time</Form.Label>
                                            <Form.Control
                                                type="time"
                                                value={timings.open}
                                                onChange={(e) => setTimings({ ...timings, open: e.target.value })}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Closing Time</Form.Label>
                                            <Form.Control
                                                type="time"
                                                value={timings.close}
                                                onChange={(e) => setTimings({ ...timings, close: e.target.value })}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Button 
                                    type="submit"
                                    style={{ backgroundColor: '#914F1E', borderColor: '#914F1E' }}
                                >
                                    Update Timings
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Tab>

                {/* Staff Management Tab */}
                <Tab eventKey="staff" title="Staff Management">
                    <Card className="mb-4">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4>Delivery Staff</h4>
                                <Button 
                                    variant="primary" 
                                    onClick={() => setShowStaffModal(true)}
                                    style={{ backgroundColor: '#914F1E', borderColor: '#914F1E' }}
                                >
                                    Add Staff Member
                                </Button>
                            </div>
                            <Table responsive hover>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>ID Proof Number</th>
                                        <th>Availability</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {restaurant?.deliveryStaff.map((staff) => (
                                        <tr key={staff._id}>
                                            <td>{staff.name}</td>
                                            <td>{staff.idProofNumber}</td>
                                            <td>
                                                <div className="d-flex align-items-center" 
                                                    title={staff.deliveryAssigned ? "Staff member is currently assigned to a delivery" : ""}>
                                                    <Form.Check
                                                        type="switch"
                                                        id={`availability-switch-${staff._id}`}
                                                        checked={staff.availability}
                                                        onChange={(e) => handleUpdateStaffAvailability(staff._id, e.target.checked)}
                                                        disabled={staff.deliveryAssigned}
                                                        label={staff.availability ? 'Available' : 'Unavailable'}
                                                        style={{ cursor: staff.deliveryAssigned ? 'not-allowed' : 'pointer' }}
                                                    />
                                                    {staff.deliveryAssigned && (
                                                        <span className="ms-2 text-muted" style={{ fontSize: '0.8rem' }}>
                                                            (On Delivery)
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <Badge bg={staff.deliveryAssigned ? 'warning' : 'success'}>
                                                    {staff.deliveryAssigned ? 'On Delivery' : 'Free'}
                                                </Badge>
                                            </td>
                                            <td>
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => handleDeleteStaff(staff._id)}
                                                    disabled={staff.deliveryAssigned}
                                                    title={staff.deliveryAssigned ? "Cannot remove staff member while on delivery" : ""}
                                                >
                                                    Remove
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Tab>

                {/* Reservations Tab */}
                <Tab eventKey="reservations" title="Reservations">
                    <Card>
                        <Card.Body>
                            <h4 className="mb-4">Current Reservations</h4>
                            <Table responsive hover>
                                <thead>
                                    <tr>
                                        <th>Guest Name</th>
                                        <th>Time</th>
                                        <th>Persons</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {restaurant?.reservation.map((reservation) => (
                                        <tr key={reservation._id}>
                                            <td>{reservation.guestName}</td>
                                            <td>{new Date(reservation.reservationTime).toLocaleString()}</td>
                                            <td>{reservation.noOfPersons}</td>
                                            <td>
                                                <Badge bg={
                                                    reservation.status === 'Booked' ? 'primary' :
                                                    reservation.status === 'Completed' ? 'success' :
                                                    reservation.status === 'Cancelled' ? 'danger' :
                                                    'warning'
                                                }>
                                                    {reservation.status}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Tab>

                {/* Add Orders Tab */}
                <Tab eventKey="orders" title="Orders Management">
                    <Card>
                        <Card.Body>
                            <h4 className="mb-4">Orders</h4>
                            {ordersLoading ? (
                                <div className="text-center">
                                    <span>Loading orders...</span>
                                </div>
                            ) : (
                                <Table responsive hover>
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Customer</th>
                                            <th>Items</th>
                                            <th>Total Amount</th>
                                            <th>Order Type</th>
                                            <th>Status</th>
                                            <th>Order Date</th>
                                            <th>Last Updated</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order) => (
                                            <tr key={order._id}>
                                                <td>{order._id}</td>
                                                <td>{order.user.email || 'N/A'}</td>
                                                <td>
                                                    <Button
                                                        variant="link"
                                                        onClick={() => {
                                                            setSelectedOrder(order);
                                                            setShowOrderActionModal(true);
                                                        }}
                                                    >
                                                        View Items ({order.items.length})
                                                    </Button>
                                                </td>
                                                <td>₹{order.totalAmount / 100}</td>
                                                <td>Delivery</td>
                                                <td>
                                                    <Badge bg={getOrderStatusBadgeColor(order.status)}>
                                                        {order.status.replace(/_/g, ' ').toUpperCase()}
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
                                                <td>
                                                    {new Date(order.updatedAt).toLocaleString('en-IN', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-2">
                                                        {order.status === 'paid' && (
                                                            <>
                                                                <Button
                                                                    variant="success"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        setSelectedOrder(order);
                                                                        setOrderAction({ status: 'preparing' });
                                                                        setShowOrderActionModal(true);
                                                                    }}
                                                                >
                                                                    Start Preparing
                                                                </Button>
                                                                <Button
                                                                    variant="danger"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        setSelectedOrder(order);
                                                                        setOrderAction({ status: 'cancelled' });
                                                                        setShowOrderActionModal(true);
                                                                    }}
                                                                >
                                                                    Cancel
                                                                </Button>
                                                            </>
                                                        )}
                                                        {order.status === 'preparing' && (
                                                            <>
                                                                <Button
                                                                    variant="info"
                                                                    size="sm"
                                                                    onClick={async () => {
                                                                        try {
                                                                            const token = localStorage.getItem('token');
                                                                            const response = await fetch(`${backendUrl}/api/restaurant`, {
                                                                                headers: {
                                                                                    'Authorization': `Bearer ${token}`
                                                                                }
                                                                            });

                                                                            if (!response.ok) {
                                                                                throw new Error('Failed to fetch available staff');
                                                                            }

                                                                            const data = await response.json();
                                                                            if (data.restaurant?.deliveryStaff) {
                                                                                const availableStaffList = data.restaurant.deliveryStaff.filter(
                                                                                    staff => staff.availability && !staff.deliveryAssigned
                                                                                );
                                                                                setAvailableStaff(availableStaffList);
                                                                            }

                                                                            setSelectedOrder(order);
                                                                            setOrderAction({ status: 'out_for_delivery' });
                                                                            setShowOrderActionModal(true);
                                                                        } catch (err) {
                                                                            setError(err.message || 'Failed to fetch available staff');
                                                                        }
                                                                    }}
                                                                >
                                                                    Out for Delivery
                                                                </Button>
                                                                <Button
                                                                    variant="success"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        setSelectedOrder(order);
                                                                        setOrderAction({ status: 'delivered' });
                                                                        setShowOrderActionModal(true);
                                                                    }}
                                                                >
                                                                    Mark Delivered
                                                                </Button>
                                                            </>
                                                        )}
                                                        {order.status === 'out_for_delivery' && (
                                                            <Button
                                                                variant="success"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setSelectedOrder(order);
                                                                    setOrderAction({ status: 'delivered' });
                                                                    setShowOrderActionModal(true);
                                                                }}
                                                            >
                                                                Mark Delivered
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </Tab>
            </Tabs>

            {/* Add Menu Item Modal */}
            <Modal show={showMenuModal} onHide={() => {
                setShowMenuModal(false);
                setIsEditing(false);
                setEditingItemId(null);
                setMenuItem({ name: '', description: '', price: '', category: '', type: 'veg', stock: 0 });
            }} centered>
                <Modal.Header closeButton style={{ backgroundColor: '#F7DCB9', borderBottom: '2px solid #DEAC80' }}>
                    <Modal.Title style={{ color: '#914F1E' }}>{isEditing ? 'Edit Menu Item' : 'Add Menu Item'}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ backgroundColor: '#F7DCB9' }}>
                    <Form onSubmit={isEditing ? handleUpdateMenuItem : handleAddMenuItem}>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={menuItem.name}
                                onChange={(e) => setMenuItem({ ...menuItem, name: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={menuItem.description}
                                onChange={(e) => setMenuItem({ ...menuItem, description: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                value={menuItem.price}
                                onChange={(e) => setMenuItem({ ...menuItem, price: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Select
                                value={menuItem.category}
                                onChange={(e) => setMenuItem({ ...menuItem, category: e.target.value })}
                                required
                            >
                                <option value="">Select Category</option>
                                {foodCategories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                                <option value="Other">Other</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Type</Form.Label>
                            <Form.Select
                                value={menuItem.type}
                                onChange={(e) => setMenuItem({ ...menuItem, type: e.target.value })}
                            >
                                <option value="veg">Vegetarian</option>
                                <option value="non-veg">Non-Vegetarian</option>
                                <option value="contains-egg">Contains Egg</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Stock</Form.Label>
                            <Form.Control
                                type="number"
                                min="0"
                                value={menuItem.stock}
                                onChange={(e) => setMenuItem({ ...menuItem, stock: parseInt(e.target.value) })}
                                required
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={() => {
                                setShowMenuModal(false);
                                setIsEditing(false);
                                setEditingItemId(null);
                                setMenuItem({ name: '', description: '', price: '', category: '', type: 'veg', stock: 0 });
                            }}>
                                Cancel
                            </Button>
                            <Button type="submit" style={{ backgroundColor: '#914F1E', borderColor: '#914F1E' }}>
                                {isEditing ? 'Update Item' : 'Add Item'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Add Staff Modal */}
            <Modal show={showStaffModal} onHide={() => setShowStaffModal(false)} centered>
                <Modal.Header closeButton style={{ backgroundColor: '#F7DCB9', borderBottom: '2px solid #DEAC80' }}>
                    <Modal.Title style={{ color: '#914F1E' }}>Add Staff Member</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ backgroundColor: '#F7DCB9' }}>
                    <Form onSubmit={handleAddStaff}>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={staffMember.name}
                                onChange={(e) => setStaffMember({ ...staffMember, name: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>ID Proof Number</Form.Label>
                            <Form.Control
                                type="text"
                                value={staffMember.idProofNumber}
                                onChange={(e) => setStaffMember({ ...staffMember, idProofNumber: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={() => setShowStaffModal(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" style={{ backgroundColor: '#914F1E', borderColor: '#914F1E' }}>
                                Add Staff
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Password Update Modal */}
            <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)} centered>
                <Modal.Header closeButton style={{ backgroundColor: '#F7DCB9', borderBottom: '2px solid #DEAC80' }}>
                    <Modal.Title style={{ color: '#914F1E' }}>Change Password</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ backgroundColor: '#F7DCB9' }}>
                    <Form onSubmit={handlePasswordUpdate}>
                        <Form.Group className="mb-3">
                            <Form.Label>Current Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({
                                    ...passwordData,
                                    currentPassword: e.target.value
                                })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({
                                    ...passwordData,
                                    newPassword: e.target.value
                                })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Confirm New Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({
                                    ...passwordData,
                                    confirmPassword: e.target.value
                                })}
                                required
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" style={{ backgroundColor: '#914F1E', borderColor: '#914F1E' }}>
                                Update Password
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Update Order Action Modal */}
            <Modal show={showOrderActionModal} onHide={() => {
                setShowOrderActionModal(false);
                setSelectedOrder(null);
                setOrderAction({ status: '', reason: '', deliveryStaffId: '' });
            }} centered>
                <Modal.Header closeButton style={{ backgroundColor: '#F7DCB9', borderBottom: '2px solid #DEAC80' }}>
                    <Modal.Title style={{ color: '#914F1E' }}>
                        {orderAction.status ? `${orderAction.status.replace(/_/g, ' ').toUpperCase()} Order` : 'Order Details'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ backgroundColor: '#F7DCB9' }}>
                    {selectedOrder && (
                        <>
                            <div className="mb-4">
                                <h6>Order Details:</h6>
                                <Table borderless size="sm">
                                    <tbody>
                                        <tr>
                                            <td><strong>Customer:</strong></td>
                                            <td>{selectedOrder.user.name}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Items:</strong></td>
                                            <td>
                                                {selectedOrder.items.map((item, index) => (
                                                    <div key={index}>
                                                        {item.name} x {item.quantity} - ₹{item.menuItem.price * item.quantity}
                                                    </div>
                                                ))}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><strong>Total Amount:</strong></td>
                                            <td>₹{selectedOrder.totalAmount / 100}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Delivery Address:</strong></td>
                                            <td>{selectedOrder.deliveryAddress}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Phone:</strong></td>
                                            <td>{selectedOrder.phoneNumber}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                            {orderAction.status && (
                                <Form onSubmit={handleOrderAction}>
                                    {orderAction.status === 'cancelled' && (
                                        <Form.Group className="mb-3">
                                            <Form.Label>Cancellation Reason</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                value={orderAction.reason}
                                                onChange={(e) => setOrderAction({
                                                    ...orderAction,
                                                    reason: e.target.value
                                                })}
                                                required
                                            />
                                        </Form.Group>
                                    )}
                                    {orderAction.status === 'out_for_delivery' && (
                                        <Form.Group className="mb-3">
                                            <Form.Label>Select Delivery Staff</Form.Label>
                                            <Form.Select
                                                value={orderAction.deliveryStaffId}
                                                onChange={(e) => setOrderAction({
                                                    ...orderAction,
                                                    deliveryStaffId: e.target.value
                                                })}
                                                required
                                            >
                                                <option value="">Select Staff</option>
                                                {availableStaff.map((staff) => (
                                                    <option key={staff._id} value={staff._id}>
                                                        {staff.name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    )}
                                    <div className="d-flex justify-content-end gap-2">
                                        <Button variant="secondary" onClick={() => {
                                            setShowOrderActionModal(false);
                                            setSelectedOrder(null);
                                            setOrderAction({ status: '', reason: '', deliveryStaffId: '' });
                                        }}>
                                            Cancel
                                        </Button>
                                        <Button type="submit" style={{ backgroundColor: '#914F1E', borderColor: '#914F1E' }}>
                                            Confirm
                                        </Button>
                                    </div>
                                </Form>
                            )}
                        </>
                    )}
                </Modal.Body>
            </Modal>
        </Container>
    );
}

export default RestaurantDashboard; 