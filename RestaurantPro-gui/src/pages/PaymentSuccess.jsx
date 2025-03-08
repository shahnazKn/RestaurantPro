import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';

function PaymentSuccess() {
    const navigate = useNavigate();

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={6}>
                    <Card className="text-center shadow">
                        <Card.Body className="p-5">
                            <FiCheckCircle size={64} className="text-success mb-4" />
                            <h2 className="mb-4">Payment Successful!</h2>
                            <p className="mb-4">
                                Thank you for your order. Your payment has been processed successfully.
                                You will receive an email confirmation shortly.
                            </p>
                            <Button 
                                onClick={() => navigate('/customer/home')}
                                style={{ 
                                    backgroundColor: '#914F1E',
                                    borderColor: '#914F1E'
                                }}
                            >
                                Return to Home
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default PaymentSuccess; 