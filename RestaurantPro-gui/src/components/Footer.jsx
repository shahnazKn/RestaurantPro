import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Footer() {
    const navigate = useNavigate();
    const currentYear = new Date().getFullYear();

    return (
        <footer style={{ backgroundColor: '#F7DCB9', borderTop: '2px solid #DEAC80' }} className="py-5 mt-5">
            <Container>
                <Row className="g-4">
                    <Col md={4}>
                        <h5 style={{ color: '#914F1E', fontWeight: 'bold' }}>RestaurantPro</h5>
                        <p style={{ color: '#914F1E' }}>
                            Connecting food lovers with their favorite restaurants. 
                            Order food online, make reservations, and enjoy the best dining experience.
                        </p>
                    </Col>
                    <Col md={4}>
                        <h5 style={{ color: '#914F1E', fontWeight: 'bold' }}>Quick Links</h5>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <a 
                                    onClick={() => navigate('/about')} 
                                    style={{ color: '#914F1E', cursor: 'pointer', textDecoration: 'none' }}
                                >
                                    About Us
                                </a>
                            </li>
                            <li className="mb-2">
                                <a 
                                    onClick={() => navigate('/contact')} 
                                    style={{ color: '#914F1E', cursor: 'pointer', textDecoration: 'none' }}
                                >
                                    Contact Us
                                </a>
                            </li>
                            <li className="mb-2">
                                <a 
                                    onClick={() => navigate('/privacy-policy')} 
                                    style={{ color: '#914F1E', cursor: 'pointer', textDecoration: 'none' }}
                                >
                                    Privacy Policy
                                </a>
                            </li>
                            <li className="mb-2">
                                <a 
                                    onClick={() => navigate('/terms')} 
                                    style={{ color: '#914F1E', cursor: 'pointer', textDecoration: 'none' }}
                                >
                                    Terms & Conditions
                                </a>
                            </li>
                        </ul>
                    </Col>
                    <Col md={4}>
                        <h5 style={{ color: '#914F1E', fontWeight: 'bold' }}>Connect With Us</h5>
                        <div className="d-flex gap-3 mb-3">
                            <a href="#" style={{ color: '#914F1E', fontSize: '24px' }}>
                                <i className="bi bi-facebook"></i>
                            </a>
                            <a href="#" style={{ color: '#914F1E', fontSize: '24px' }}>
                                <i className="bi bi-twitter"></i>
                            </a>
                            <a href="#" style={{ color: '#914F1E', fontSize: '24px' }}>
                                <i className="bi bi-instagram"></i>
                            </a>
                            <a href="#" style={{ color: '#914F1E', fontSize: '24px' }}>
                                <i className="bi bi-linkedin"></i>
                            </a>
                        </div>
                        <p style={{ color: '#914F1E' }}>
                            <i className="bi bi-envelope me-2"></i>
                            contact@restaurantpro.com
                        </p>
                        <p style={{ color: '#914F1E' }}>
                            <i className="bi bi-telephone me-2"></i>
                            +(91) 8123456789
                        </p>
                    </Col>
                </Row>
                <hr style={{ borderColor: '#DEAC80' }} />
                <p className="text-center mb-0" style={{ color: '#914F1E' }}>
                    © {currentYear} RestaurantPro. All rights reserved.
                </p>
            </Container>
        </footer>
    );
}

export default Footer; 