// src/components/Menu.js
import React from 'react';

function Menu() {
    return (
        <nav>
            <ul className="menu">
                <li><a href="/dashboard">ASN</a></li>
                <li><a href="/dailyorders">Daily Orders</a></li>
                <li><a href="/certificates">Certificates of Compliance</a></li>
                <li><a href="/inventory">Inventory</a></li>
            </ul>
        </nav>
    );
}

export default Menu;
