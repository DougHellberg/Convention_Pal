import React, { useState, useEffect, Fragment } from 'react';

function InventoryList() {
    const [inventoryItems, setInventoryItems] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newItem, setNewItem] = useState({ name: '', price: 0, quantity: 0 });
    const [editItemKey, setEditItemKey] = useState(null);
    const [editedPrice, setEditedPrice] = useState(0);
    const [editedQuantity, setEditedQuantity] = useState(0);


    useEffect(() => {
        const apiUrl = '/inventory';
        fetch(apiUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setInventoryItems(data);
            })
            .catch((error) => {
                console.error('Error fetching inventory data:', error);
            });
    }, []);

    const handleAddClick = () => {
        setShowAddForm(!showAddForm);
        if (showAddForm) {
            setNewItem({ name: '', price: 0, quantity: 0 });
        }
        
    };

    const handleCancelClick = () => {
        setShowAddForm(false);
    };

    const handleInputChange = (e,item) => {
        const { name, value } = e.target;
        setNewItem({...newItem, [name]: value})
        
        console.log(newItem)
        
};
    

    const handleDeleteItem = (itemKey) => {
        fetch(`/inventory/${itemKey}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (response.ok) {
                    
                    fetch('/inventory')
                        .then((response) => {
                            if (response.ok) {
                                return response.json();
                            }
                            throw new Error(`Network response was not ok: ${response.status}`);
                        })
                        .then((data) => {
                            setInventoryItems(data);
                        })
                        .catch((error) => {
                            console.error('Error fetching inventory data:', error);
                        });
                } else {
                    console.error(`Error deleting item: ${response.status}`);
                }
            })
            .catch((error) => {
                console.error('Error deleting item:', error);
            });
    };

    const handleEditItem = (itemKey) => {
        setEditItemKey(itemKey);
        const itemToEdit = inventoryItems.find((item) => item.id === itemKey);
        setEditedPrice(itemToEdit.price);
        setEditedQuantity(itemToEdit.quantity);
    };


    const handleCancelEdit = () => {
        setEditItemKey(null);
        if (editItemKey !== null) {
            
            const itemToEdit = inventoryItems.find((item) => item.id === editItemKey);
            setEditedPrice(itemToEdit.price);
            setEditedQuantity(itemToEdit.quantity);
    };
    }
    const handleUpdateItem = (item) => {
        const apiUrl = `/inventory/${item.id}`;
        const updatedFields = {
        name: item.name,
        price: item.price,
        quantity: item.quantity,
    };

    fetch(apiUrl, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFields),
    })
        .then((response) => {
            if (response.ok) {
                setEditItemKey(null);
            } else {
                console.error(`Error updating item: ${response.status}`);
            }
        })
        .catch((error) => {
            console.error('Error updating item:', error);
        });
    };

    const handleAddItem = () => {
        fetch('/inventory', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newItem),
        })
            .then((response) => response.json())
            .then((data) => {
                setInventoryItems([...inventoryItems,data]);
                setNewItem({ name: '', price: 0, quantity: 0 });
                setShowAddForm(false);
            })
            .catch((error) => {
                console.error('Error adding item:', error);
            });
    
    };

    return (
        <div>
            <h1>Inventory List</h1>
            {inventoryItems.length > 0 && (
                <Fragment>
                    <ul style={{ listStyle: 'none' }}>
                        {inventoryItems.map((item) => (
                            <li key={item.key} style={{ marginBottom: '10px' }}>
                                {editItemKey === item.id ? (
                                    <div>
                                        <input
                                            type="text"
                                            name="name"
                                            value={newItem.name}
                                            placeholder="Name"
                                            onChange={(e) => handleInputChange(e, item)}
                                        />
                                        <input
                                            type="number"
                                            name="price"
                                            value={newItem.price}
                                            placeholder="Price"
                                            onChange={(e) => handleInputChange(e, item)}
                                        />
                                        <input
                                            type="number"
                                            name="quantity"
                                            value={newItem.quantity}
                                            placeholder="Stock left"
                                            onChange={(e) => handleInputChange(e, item)}
                                        />
                                        <button onClick={() => handleUpdateItem(item)}>Update</button>
                                        <button onClick={handleCancelEdit}>Cancel</button>
                                    </div>
                                ) : (
                                    <Fragment>
                                        Item name: {item.name}<br />
                                        Price: {item.price}<br />
                                        Stock left: {item.quantity}
                                        <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
                                        <button onClick={() => handleEditItem(item.id)}>Edit</button>
                                    </Fragment>
                                )}
                            </li>
                        ))}
                    </ul>
                </Fragment>
            )}

            <button onClick={handleAddClick}>Add Item</button>

            {showAddForm && (
                <div>
                    <h2>Add New Item</h2>
                    <input
                        type="text"
                        name="name"
                        value={newItem.name}
                        placeholder="Name"
                        onChange={handleInputChange}
                    />
                    <input
                        type="number"
                        name="price"
                        value={newItem.price}
                        placeholder="Price"
                        onChange={handleInputChange}
                    />
                    <input
                        type="number"
                        name="quantity"
                        value={newItem.quantity}
                        placeholder="Stock left"
                        onChange={handleInputChange}
                    />
                    <button onClick={handleAddItem}>Add</button>
                    <button onClick={handleCancelClick}>Cancel</button>
                </div>
            )}
        </div>
    );
}

export default InventoryList;