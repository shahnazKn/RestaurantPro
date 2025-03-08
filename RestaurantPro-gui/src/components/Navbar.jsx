import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

function NavigationBar({ isAuthenticated, userRole, onLogout }) {
    return (
        <Navbar bg="light" expand="lg" className="mb-4">
            <Container>
                <Navbar.Brand as={Link} to="/">RestaurantPro</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {!isAuthenticated && (
                            <>
                                <Nav.Link as={Link} to="/">Home</Nav.Link>
                                <Nav.Link as={Link} to="/signin">Sign In</Nav.Link>
                            </>
                        )}
                        {isAuthenticated && userRole === 'admin' && (
                            <Nav.Link as={Link} to="/admin/dashboard">Admin Dashboard</Nav.Link>
                        )}
                        {isAuthenticated && userRole === 'customer' && (
                            <Nav.Link as={Link} to="/customer/home">Home</Nav.Link>
                        )}
                        {isAuthenticated && userRole === 'restaurant' && (
                            <Nav.Link as={Link} to="/restaurant/dashboard">Restaurant Dashboard</Nav.Link>
                        )}
                    </Nav>
                    <Nav>
                        {!isAuthenticated && (
                            <>
                                <Nav.Link as={Link} to="/customer/signup">Customer Sign Up</Nav.Link>
                                <Nav.Link as={Link} to="/restaurant/signup">Restaurant Sign Up</Nav.Link>
                            </>
                        )}
                        {isAuthenticated && (
                            <Button variant="outline-primary" onClick={onLogout}>
                                Logout
                            </Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

NavigationBar.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    userRole: PropTypes.string,
    onLogout: PropTypes.func.isRequired
};

export default NavigationBar; 