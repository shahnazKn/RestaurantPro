import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PropTypes from 'prop-types';
import HomePage from "./pages/HomePage";
import CustomerSignup from "./pages/CustomerSignup";
import RestaurantSignup from "./pages/RestaurantSignup";
import SignIn from "./pages/SignIn";
import CustomerHome from "./pages/CustomerHome";
import RestaurantDetail from "./pages/RestaurantDetail";
import AdminDashboard from "./pages/AdminDashboard";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import RestaurantMenu from "./pages/RestaurantMenu";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import OrderHistory from "./pages/OrderHistory";
import OrderTracking from "./pages/OrderTracking";
import Header from "./components/Header";
import Footer from "./components/Footer";

function ProtectedRoute({ children, allowedRole }) {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    console.log('Protected Route Check:', { allowedRole, userRole, hasToken: !!token }); // Debug log

    if (!token) {
        return <Navigate to="/signin" replace />;
    }

    if (allowedRole && userRole !== allowedRole) {
        console.log('Role mismatch:', { allowedRole, userRole }); // Debug log
        return <Navigate to="/" replace />;
    }

    return children;
}

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    allowedRole: PropTypes.string.isRequired
};

function App() {
    return (
        <Router>
            <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                minHeight: '100vh'
            }}>
                <Header />
                <main style={{ flex: 1, marginTop: '76px' }}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/signup/customer" element={<CustomerSignup />} />
                        <Route path="/signup/restaurant" element={<RestaurantSignup />} />
                        <Route path="/signin" element={<SignIn />} />
                        
                        {/* Protected Customer Routes */}
                        <Route 
                            path="/customer/home" 
                            element={
                                <ProtectedRoute allowedRole="Customer">
                                    <CustomerHome />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/customer/orders" 
                            element={
                                <ProtectedRoute allowedRole="Customer">
                                    <OrderHistory />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/order-tracking/:orderId" 
                            element={
                                <ProtectedRoute allowedRole="Customer">
                                    <OrderTracking />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/checkout" 
                            element={
                                <ProtectedRoute allowedRole="Customer">
                                    <Checkout />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/payment-success" 
                            element={
                                <ProtectedRoute allowedRole="Customer">
                                    <PaymentSuccess />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/payment-cancel" 
                            element={
                                <ProtectedRoute allowedRole="Customer">
                                    <PaymentCancel />
                                </ProtectedRoute>
                            } 
                        />

                        {/* Protected Restaurant Routes */}
                        <Route 
                            path="/restaurant/:id" 
                            element={
                                <ProtectedRoute allowedRole="RestaurantOwner">
                                    <RestaurantDetail />
                                </ProtectedRoute>
                            } 
                        />

                        {/* Restaurant Menu Route - Accessible to Customers */}
                        <Route 
                            path="/restaurant/:restaurantId/menu" 
                            element={
                                <RestaurantMenu />
                            } 
                        />

                        {/* Protected Admin Routes */}
                        <Route 
                            path="/admin/dashboard" 
                            element={
                                <ProtectedRoute allowedRole="Admin">
                                    <AdminDashboard />
                                </ProtectedRoute>
                            } 
                        />

                        {/* Protected Restaurant Owner Routes */}
                        <Route 
                            path="/restaurant/dashboard" 
                            element={
                                <ProtectedRoute allowedRole="RestaurantOwner">
                                    <RestaurantDashboard />
                                </ProtectedRoute>
                            } 
                        />

                        {/* Catch all route */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
