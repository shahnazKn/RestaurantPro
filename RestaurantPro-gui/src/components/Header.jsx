import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const isAuthenticated = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    const handleLogoClick = () => {
        if (!isAuthenticated) {
            navigate('/');
            return;
        }

        switch (userRole) {
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
                navigate('/');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/signin');
    };

    return (
        <Navbar 
            expand="lg" 
            className="py-3 shadow-sm"
            style={{ 
                backgroundColor: '#F7DCB9',
                borderBottom: '2px solid #DEAC80'
            }}
            fixed="top"
        >
            <Container>
                <Navbar.Brand 
                    onClick={handleLogoClick}
                    style={{ 
                        color: '#914F1E', 
                        fontSize: '24px', 
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    RestaurantPro
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto align-items-center">
                        {isAuthenticated ? (
                            <>
                                {userRole === 'Customer' && (
                                    <Nav.Link 
                                        onClick={() => navigate('/customer/orders')}
                                        style={{ color: '#914F1E' }}
                                        className={location.pathname === '/customer/orders' ? 'active mx-2' : 'mx-2'}
                                    >
                                        My Orders
                                    </Nav.Link>
                                )}
                                <Button
                                    variant="outline-primary"
                                    onClick={handleLogout}
                                    style={{ 
                                        color: '#914F1E',
                                        borderColor: '#914F1E'
                                    }}
                                    className="ms-2"
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Nav.Link 
                                    onClick={() => navigate('/signin')}
                                    style={{ color: '#914F1E' }}
                                    className={location.pathname === '/signin' ? 'active mx-2' : 'mx-2'}
                                >
                                    Sign In
                                </Nav.Link>
                                <Button
                                    variant="outline-primary"
                                    onClick={() => navigate('/signup/customer')}
                                    style={{ 
                                        color: '#914F1E',
                                        borderColor: '#914F1E'
                                    }}
                                    className="mx-2"
                                >
                                    Sign Up
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={() => navigate('/signup/restaurant')}
                                    style={{ 
                                        backgroundColor: '#914F1E',
                                        borderColor: '#914F1E'
                                    }}
                                    className="ms-2"
                                >
                                    Partner with Us
                                </Button>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header; 