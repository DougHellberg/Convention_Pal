import React, { useState, useEffect } from 'react';

function ConventionsList() {
    const [conventionItems, setConventionItems] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newConvention, setNewConvention] = useState({ name: '', num_of_days: 0, table_cost: 0 });

    useEffect(() => {
        const apiUrl = '/convention';

        fetch(apiUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setConventionItems(data);
            })
            .catch((error) => {
                console.error('Error fetching convention data:', error);
            });
    }, []);

    const handleAddClick = () => {
        setShowAddForm(!showAddForm);
    };

    const handleCancelClick = () => {
        setShowAddForm(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewConvention({ ...newConvention, [name]: value });
    };

    const handleAddConvention = () => {
        fetch('/convention', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newConvention),
        })
            .then((response) => response.json())
            .then((newConvention) => {
                setConventionItems([...conventionItems, newConvention]);
                setNewConvention({ name: '', num_of_days: 0, table_cost: 0 });
                setShowAddForm(false);
            })
            .catch((error) => {
                console.error('Error adding convention:', error);
            });
    };
    const handleDeleteConvention = (conventionId) => {
        fetch(`/convention/${conventionId}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (response.ok) {
                    setConventionItems(conventionItems.filter((item) => item.id !== conventionId));
                } else {
                    console.error(`Error deleting convention: ${response.status}`);
                }
            })
            .catch((error) => {
                console.error('Error deleting convention:', error);
            });
    };

    return (
        <div>
            <h1 className="inventory-heading">Convention List</h1>
            {conventionItems.length > 0 && (
                <ul className="inventory-list" style={{ listStyle: 'none' }}>
                    {conventionItems.map((item) => (
                        <li key={item.id} className='item' style={{ marginBottom: '10px' }}>
                            Convention name: {item.name}<br />
                            Days con is running: {item.num_of_days}<br />
                            Cost of table: {item.table_cost}<br/>
                            <div className = "delete-btn">
                            <button onClick={() => handleDeleteConvention(item.id)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            
            
            <button onClick={handleAddClick}>Add Convention</button>
            
            {showAddForm && (
                <div>
                    <h2 className="inventory-heading">Add New Convention</h2><br/>
                    <input
                        type="text"
                        name="name"
                        value={newConvention.name}
                        placeholder="Name"
                        onChange={handleInputChange}
                    />
                    <input
                        type="number"
                        name="num_of_days"
                        value={newConvention.num_of_days}
                        placeholder="Days con is running"
                        onChange={handleInputChange}
                    />
                    <input
                        type="number"
                        name="table_cost"
                        value={newConvention.table_cost}
                        placeholder="Cost of table"
                        onChange={handleInputChange}
                    />
                    <button onClick={handleAddConvention}>Add Convention</button>
                    <button onClick={handleCancelClick}>Cancel</button>
                </div>
            )}
        </div>
    );
}

export default ConventionsList;
