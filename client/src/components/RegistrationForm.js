import React, { useState } from 'react';

function RegistrationForm() {
const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
});

const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
};

function handleSubmit(e) {
    e.preventDefault();
    fetch('/user', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
    },
        body: JSON.stringify(formData),
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data); // Handle the response from the server
    })
    .catch((error) => {
        console.error(error);
    });
}

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
    <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
    />
    <button type="submit">Register</button>
    </form>
);
}

export default RegistrationForm;