import React, { useState, useEffect, Fragment, useRef, useContext } from 'react';
import { UserContext } from './UserContext';
import { useUserSession } from './UserSessionContext';  

function TotalSales() {
    const { userSession } = useUserSession(); 
    const userId = userSession.id;  
    console.log(userSession.user_id)

    const [totalSales, setTotalSales] = useState(0);
    const userRef = useRef(userSession);

    useEffect(() => {
        if (userSession && userSession.user_id) {
            const userId = userSession.user_id;
    
            fetch(`/total-sales/${userId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    setTotalSales(data.total_sales);
                })
                .catch(error => {
                    console.error('There has been a problem with your fetch operation:', error);
                });
        }
    }, [userSession, userSession?.id]);

    const formattedTotalSales = totalSales.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    return (
        <div>
            Total Sales: {formattedTotalSales}
        </div>
    );
}

export default TotalSales;