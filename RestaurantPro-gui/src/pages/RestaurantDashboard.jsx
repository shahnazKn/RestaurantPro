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

    useEffect(() => {
        fetchRestaurantDetails();
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

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Container fluid className="py-4">
            <Row className="mb-4">
                <Col>
                    <h2 style={{ color: '#914F1E' }}>Restaurant Dashboard</h2>
                </Col>
            </Row>

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
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {restaurant?.deliveryStaff.map((staff) => (
                                        <tr key={staff._id}>
                                            <td>{staff.name}</td>
                                            <td>{staff.idProofNumber}</td>
                                            <td>
                                                <Badge bg={staff.availability ? 'success' : 'danger'}>
                                                    {staff.availability ? 'Available' : 'Unavailable'}
                                                </Badge>
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
        </Container>
    );
}

export default RestaurantDashboard; 