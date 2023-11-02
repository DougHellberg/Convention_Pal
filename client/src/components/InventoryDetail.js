import React, { useState, useEffect } from 'react';
import axios from 'axios';

function InventoryDetail({ match,id }) {
    const [inventory, setInventory] = useState({});

    useEffect(() => {
    const inventoryId = match.params.id;
    axios.get("/inventory/" + id) 
        .then((response) => {
            setInventory(response.data);
        })
        .catch((error) => {
            console.error(error);
        });
    }, [match.params.id]);

    return (
    <div>
        <h1>Inventory Details</h1>
        <p>Name: {inventory.name}</p>
        <p>Price: ${inventory.price}</p>
        <p>Quantity: {inventory.quantity}</p>
    </div>
    );
}

export default InventoryDetail;