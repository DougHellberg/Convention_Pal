import React, { useState, useEffect, Fragment, useRef } from 'react'
import { useUserSession } from './UserSessionContext'
import { Link } from 'react-router-dom'
import axios from './axios-config'
function InventoryList() {
    const { userSession } = useUserSession()
    const userRef = useRef(userSession)
    const [inventoryItems, setInventoryItems] = useState([])
    const [showAddForm, setShowAddForm] = useState(false)
    const [newItem, setNewItem] = useState({ name: '', price: 0, quantity: 0 })
    const [editItem, setEditItem] = useState(null)
    const [isEdit, setisEdit]=useState(false)
    const [message,setMessage] = useState(" ")

    useEffect(() => {
        userRef.current = userSession
    }, [userSession])

    console.log(userSession)

    useEffect(() => {
        if (userSession) {
            const apiUrl = `/inventory/user/${userSession.user_id}`
    
            fetch(apiUrl, {
                credentials: 'include'  
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status}`)
                }
                return response.json()
            })
            .then((data) => {
                setInventoryItems(data)
            })
            .catch((error) => {
                console.error('Error fetching inventory data:', error)
            });
        }
    }, [userSession]);
    useEffect(() => {
        if (userSession) {
            setNewItem({ ...newItem, user_id: userSession.user_id })
        }
    }, [userSession]);

    const handleAddClick = () => {
        setShowAddForm(!showAddForm)
        setEditItem(null)
        setisEdit(null)
        if (userRef.current) { 
            setNewItem({ ...newItem, user_id: userRef.current.user_id })
        }
    };

    const handleCancelClick = () => {
        setShowAddForm(false)
        setEditItem(null);
        setNewItem({ name: '', price: 0, quantity: 0 })
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewItem({ ...newItem, [name]: value })
    };

    const handleDeleteItem = (itemKey) => {
        fetch(`/inventory/${itemKey}`, {
            credentials: 'include',
            method: 'DELETE',
        })
            .then((response) => {
                if (response.ok) {
                    setInventoryItems(inventoryItems.filter((item) => item.id !== itemKey))
                } else {
                    console.error(`Error deleting item: ${response.status}`)
                }
            })
            .catch((error) => {
                console.error('Error deleting item:', error)
            });
    };

    const handleEditItem = (item) => {
        setisEdit(true)
        setEditItem(item)
        setNewItem({ ...item })
        setShowAddForm(true)
    };
    const handleSellItem = (item) => {
        const updatedQuantity = item.quantity-1
    
        fetch(`/inventory/${item.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                quantity: updatedQuantity,
            }),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`)
            }
            return response.json()
        })
        .then((updatedItem) => {
            
            setInventoryItems(inventoryItems.map((item) =>
                item.id === updatedItem.id ? updatedItem : item
            ));
    
            
            fetch('/sales', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    item_id: item.id,
                    user_id: userSession.user_id,
                    price: item.price,
                    
                }),
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`)
                }
                return response.json();
            })
            .catch((error) => {
                console.error('Error creating sale:', error)
            });
        })
        .catch((error) => {
            console.error('Error selling item:', error)
        });
    };

    const handleUpdateItem = () => {
        setisEdit(false)
        const apiUrl = `/inventory/${editItem.id}`;
        const updatedFields = {
            name: newItem.name,
            price: newItem.price,
            quantity: newItem.quantity,
            user_id: editItem.user_id,
        };

        fetch(apiUrl, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(updatedFields),
        })
            .then((response) => {
                if (response.ok) {
                    setMessage('Update item successful')
                    setEditItem(null);
                    setShowAddForm(false);
                    setInventoryItems(
                        inventoryItems.map((item) =>
                            item.id === editItem.id ? { ...item, ...updatedFields } : item
                        )
                    );
                } else {
                    console.error(`Error updating item: ${response.status}`)
                    setMessage('Update item failed')
                }
            })
            .catch((error) => {
                console.error('Error updating item:', error)
                setMessage('Update item failed')
            });
    };

    const handleAddItem = () => {
        const payload = {
            ...newItem,
            user_id: parseInt(userSession.id, 10) 
        };
    
        fetch('/inventory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(payload),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`)
            }
            setMessage('Create item successful')
            return response.json()
        })
        .then((data) => {
            setInventoryItems([...inventoryItems, data])
            setNewItem({ name: '', price: 0, quantity: 0 })
            setShowAddForm(false)
        })
        .catch((error) => {
            console.error('Error adding item:', error)
            setMessage('Create item failed')
        });
    };
    

    return (
        <div>
            {userSession && (
                <div>
                    <p>Welcome!</p>
                </div>
            )}
            <h1>Inventory List</h1>
            {inventoryItems.length > 0 && (
                <Fragment>
                    <ul style={{ listStyle: 'none' }}>
                        {inventoryItems.map((item) => (
                            <li key={item.id} className='item' style={{ marginBottom: '10px' }}>
                                {isEdit && editItem && editItem.id === item.id ? (
                                    <div>
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
                                        <button onClick={handleUpdateItem}>Update</button>
                                        <button onClick={handleCancelClick}>Cancel</button>
                                    </div>
                                ) : (
                                    <Fragment>
                                        <div className = "item-details">
                                        Item name: {item.name}<br />
                                        Price: {item.price}<br />
                                        Stock left: {item.quantity}<br />
                                        </div>
                                        <div className = "item-actions">
                                        <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
                                        <button onClick={() => handleEditItem(item)}>Edit</button>
                                        <button onClick={() => handleSellItem(item)}>Sell</button>
                                        </div>
                                    </Fragment>
                                )}
                            </li>
                        ))}
                    </ul>
                </Fragment>
            )}
        <button onClick={handleAddClick}>Add Item</button>
        <Link to="/total-sales">View Total Sales</Link>
        
    {showAddForm && !editItem && userSession && (
                <div>
                    <h2>{editItem ? 'Edit Item' : 'Add New Item'}</h2>
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
                    <button onClick={editItem ? handleUpdateItem : handleAddItem}>
                        {editItem ? 'Update' : 'Add'}
                    </button>
                    <button onClick={handleCancelClick}>Cancel</button>
                    {message && <p>{message}</p>}
                </div>
            )}
        </div>
    );
}

export default InventoryList;
