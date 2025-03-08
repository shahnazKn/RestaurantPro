import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FiXCircle } from 'react-icons/fi';

function PaymentCancel() {
    const navigate = useNavigate();

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={6}>
                    <Card className="text-center shadow">
                        <Card.Body className="p-5">
                            <FiXCircle size={64} className="text-danger mb-4" />
                            <h2 className="mb-4">Payment Cancelled</h2>
                            <p className="mb-4">
                                Your payment was cancelled or did not complete successfully.
                                Please try again or contact support if you continue to have issues.
                            </p>
                            <div className="d-grid gap-2">
                                <Button 
                                    onClick={() => window.history.back()}
                                    style={{ 
                                        backgroundColor: '#914F1E',
                                        borderColor: '#914F1E'
                                    }}
                                >
                                    Try Again
                                </Button>
                                <Button 
                                    variant="outline-primary"
                                    onClick={() => navigate('/customer/home')}
                                    style={{ 
                                        color: '#914F1E',
                                        borderColor: '#914F1E'
                                    }}
                                >
                                    Return to Home
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default PaymentCancel; 