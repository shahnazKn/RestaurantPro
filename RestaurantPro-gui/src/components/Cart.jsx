import { useState, useEffect } from 'react';
import { Offcanvas, Button, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

function Cart({ show, handleClose, cartItems, updateQuantity, removeFromCart }) {
    const navigate = useNavigate();
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const newTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setTotal(newTotal);
    }, [cartItems]);

    const handleCheckout = () => {
        console.log('Cart items being passed to checkout:', cartItems);
        navigate('/checkout', {
            state: {
                cartItems,
                totalAmount: total
            }
        });
        handleClose();
    };

    return (
        <Offcanvas show={show} onHide={handleClose} placement="end">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Your Cart</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                {cartItems.length === 0 ? (
                    <p className="text-center text-muted">Your cart is empty</p>
                ) : (
                    <>
                        <ListGroup variant="flush">
                            {cartItems.map((item) => (
                                <ListGroup.Item key={item._id} className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 className="mb-0">{item.name}</h6>
                                        <small className="text-muted">₹{item.price}</small>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline-secondary"
                                            onClick={() => updateQuantity(item._id, Math.max(0, item.quantity - 1))}
                                        >
                                            -
                                        </Button>
                                        <span>{item.quantity}</span>
                                        <Button
                                            size="sm"
                                            variant="outline-secondary"
                                            onClick={() => updateQuantity(item._id, Math.min(item.stock, item.quantity + 1))}
                                            disabled={item.quantity >= item.stock}
                                        >
                                            +
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline-danger"
                                            onClick={() => removeFromCart(item._id)}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                        <div className="mt-4">
                            <div className="d-flex justify-content-between mb-3">
                                <strong>Total Amount:</strong>
                                <strong>₹{total}</strong>
                            </div>
                            <div className="d-grid">
                                <Button 
                                    onClick={handleCheckout}
                                    style={{ 
                                        backgroundColor: '#914F1E',
                                        borderColor: '#914F1E'
                                    }}
                                >
                                    Proceed to Checkout
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </Offcanvas.Body>
        </Offcanvas>
    );
}

Cart.propTypes = {
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    cartItems: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            price: PropTypes.number.isRequired,
            quantity: PropTypes.number.isRequired,
            stock: PropTypes.number.isRequired
        })
    ).isRequired,
    updateQuantity: PropTypes.func.isRequired,
    removeFromCart: PropTypes.func.isRequired
};

export default Cart; 