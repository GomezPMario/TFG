import React from 'react';
import Sidebar from './Sidebar';

const Consultas = ({ onLogout }) => {
    return (
        <div style={{ display: 'flex' }}>
            <Sidebar onLogout={onLogout} />
            <div>
                <h2>testing</h2>
            </div>
        </div>
    );
};

export default Consultas;
