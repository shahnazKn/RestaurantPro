import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CustomerSignup from "./pages/CustomerSignup";
import RestaurantSignup from "./pages/RestaurantSignup";
import SignIn from "./pages/SignIn";
import CustomerHome from "./pages/CustomerHome";
import RestaurantDetail from "./pages/RestaurantDetail";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/signup/customer" element={<CustomerSignup />} />
                <Route path="/signup/restaurant" element={<RestaurantSignup />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/restaurant" element={<CustomerHome />} />
                <Route path="/restaurant/:id" element={<RestaurantDetail />} />
            </Routes>
        </Router>
    );
}

export default App;
