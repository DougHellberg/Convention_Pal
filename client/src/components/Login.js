import React, { useState } from 'react';
import axios from 'axios';

function Login() {
    const [formData, setFormData] = useState({
    username: '',
    password: '',
    });

const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
};

const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post('/login', formData);

    
    if (response.status === 200) {
        console.log('Login successful');
        
    } else {
        // Handle login failure
        console.log('Login failed');
    }
    } catch (error) {
    
    console.error('Login error:', error);
    }
};

return (
    <form onSubmit={handleSubmit}>
    <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Username"
    />
    <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
    />
    <button type="submit">Login</button>
    </form>
);
}

export default Login;