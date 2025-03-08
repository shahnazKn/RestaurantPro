import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useState, useEffect } from 'react';

function HomePage() {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const fadeStyle = {
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 1s ease-in-out'
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#F7DCB9' }}>

            {/* Hero Section */}
            <Container className="py-5" style={fadeStyle}>
                <Row className="align-items-center py-5">
                    <Col lg={6} className="text-center text-lg-start">
                        <h1 className="display-4 fw-bold mb-4" style={{ color: '#914F1E' }}>
                            Discover Amazing Restaurants
                        </h1>
                        <p className="lead mb-4" style={{ color: '#914F1E' }}>
                            Order food from the best local restaurants, track your delivery in real-time, 
                            and enjoy a seamless dining experience.
                        </p>
                        <div className="d-grid gap-3 d-sm-flex justify-content-sm-center justify-content-lg-start">
                            <Button 
                                size="lg" 
                                onClick={() => navigate("/signup/customer")}
                                style={{ 
                                    backgroundColor: '#914F1E',
                                    borderColor: '#914F1E',
                                    padding: '10px 30px'
                                }}
                            >
                                Get Started
                            </Button>
                            <Button 
                                size="lg" 
                                variant="outline-primary"
                                onClick={() => navigate("/signup/restaurant")}
                                style={{ 
                                    color: '#914F1E',
                                    borderColor: '#914F1E',
                                    padding: '10px 30px'
                                }}
                            >
                                Partner with Us
                            </Button>
                        </div>
                    </Col>
                    <Col lg={6} className="text-center mt-5 mt-lg-0">
                        <img 
                            src="src/assets/HomePage.png" 
                            alt="Food Delivery" 
                            className="img-fluid rounded shadow-lg"
                            style={{ maxWidth: '80%' }}
                        />
                    </Col>
                </Row>
            </Container>

            {/* Features Section */}
            <Container className="py-5" style={fadeStyle}>
                <h2 className="text-center mb-5" style={{ color: '#914F1E' }}>Why Choose RestaurantPro?</h2>
                <Row className="g-4">
                    {[
                        {
                            title: "Fast Delivery",
                            description: "Get your food delivered quickly and efficiently",
                            icon: "🚀"
                        },
                        {
                            title: "Quality Food",
                            description: "Partner with top-rated restaurants in your area",
                            icon: "⭐"
                        },
                        {
                            title: "Live Tracking",
                            description: "Track your order in real-time",
                            icon: "📍"
                        }
                    ].map((feature, idx) => (
                        <Col key={idx} md={4}>
                            <Card className="h-100 border-0 shadow-sm" 
                                style={{ 
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    transition: 'transform 0.3s ease-in-out'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <Card.Body className="text-center p-4">
                                    <div className="display-4 mb-3">{feature.icon}</div>
                                    <Card.Title style={{ color: '#914F1E', fontSize: '1.25rem' }}>
                                        {feature.title}
                                    </Card.Title>
                                    <Card.Text className="text-muted">
                                        {feature.description}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>

            {/* Call to Action Section */}
            <Container fluid className="py-5" style={{ backgroundColor: '#DEAC80' }}>
                <Row className="justify-content-center">
                    <Col md={8} className="text-center">
                        <h2 className="mb-4" style={{ color: '#914F1E' }}>Ready to Get Started?</h2>
                        <p className="lead mb-4" style={{ color: '#914F1E' }}>
                            Join thousands of satisfied customers and restaurant partners.
                        </p>
                        <Button 
                            size="lg" 
                            onClick={() => navigate("/signin")}
                            style={{ 
                                backgroundColor: '#914F1E',
                                borderColor: '#914F1E',
                                padding: '15px 40px'
                            }}
                        >
                            Sign In Now
                        </Button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default HomePage;
