import React, { useState } from 'react';
import axios from './axios-config';
import { useUserSession } from './UserSessionContext';
import { useHistory } from 'react-router-dom';

function Login() {
    const [formData, setFormData] = useState({
    username: '',
    password: '',
});

const { login,error } = useUserSession(); 
const [loginMessage, setLoginMessage] = useState('');
const history = useHistory();

const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
};

const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post('/login', formData);

        if (response.status === 200) {   
            console.log('Server response:', response.data)
            login({ user_id: response.data.user_id });
            setLoginMessage('Login successful');
            setTimeout(() => {
                history.push('/inventory');
            }, 2000);
        } else {
            console.log('Login failed');
            setLoginMessage('Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        setLoginMessage('Login error')
    }
};

return (
    <form onSubmit={handleSubmit}>
        {loginMessage && <p className="message">{loginMessage}</p>} 
        {error && <p className="error">{error}</p>} 
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
