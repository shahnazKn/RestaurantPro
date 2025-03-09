import { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import PropTypes from 'prop-types';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function ProfileTab({ setError, restaurant }) {
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        cuisine: '',
        description: ''
    });

    useEffect(() => {
        if (restaurant) {
            setProfile({
                name: restaurant.name || '',
                email: restaurant.email || '',
                phone: restaurant.phone || '',
                address: restaurant.address || '',
                cuisine: restaurant.cuisine || '',
                description: restaurant.description || ''
            });
        }
    }, [restaurant]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${backendUrl}/api/restaurant/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(profile)
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            setError('');
            alert('Profile updated successfully');
        } catch (err) {
            setError(err.message || 'Failed to update profile');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
                <Form.Label>Restaurant Name</Form.Label>
                <Form.Control
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                    as="textarea"
                    name="address"
                    value={profile.address}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Cuisine Type</Form.Label>
                <Form.Control
                    type="text"
                    name="cuisine"
                    value={profile.cuisine}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                    as="textarea"
                    name="description"
                    value={profile.description}
                    onChange={handleChange}
                    rows={3}
                />
            </Form.Group>

            <Button variant="primary" type="submit">
                Update Profile
            </Button>
        </Form>
    );
}

ProfileTab.propTypes = {
    setError: PropTypes.func.isRequired,
    restaurant: PropTypes.object
};

export default ProfileTab; 