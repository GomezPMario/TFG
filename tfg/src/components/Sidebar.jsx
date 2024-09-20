import React from 'react';
import './styles/Sidebar.css';
import LogoCAAB from './images/LogoCAAB.png'; // Importa la imagen

const Sidebar = () => {
    return (
        <div className="wrapper">
            <nav id="sidebar">
                <div className="sidebar-header">
                    {/* Imagen del logo */}
                    <img src={LogoCAAB} alt="Logo CAAB" className="sidebar-logo" />
                </div>

                <ul className="list-unstyled components">
                    <li className="active">
                        <a href="/consultas">Perfil</a>
                    </li>
                    <li>
                        <a href="/consultas">Mostrar Partidos</a>
                    </li>
                    <li>
                        <a href="/consultas">Informes</a>
                    </li>
                    <li>
                        <a href="/consultas">Disponibilidad</a>
                    </li>
                    <li>
                        <a href="/consultas">Generar Designación</a>
                    </li>
                    <li>
                        <a href="/consultas">Árbitros</a>
                    </li>
                    <li>
                        <a href="/consultas">Campos</a>
                    </li>
                    <li>
                        <a href="/consultas">Categorías</a>
                    </li>
                    <li>
                        <a href="/consultas">Equipos</a>
                    </li>
                    <li>
                        <a href="/consultas">Tarifas</a>
                    </li>
                    <li>
                        <a href="/consultas">Listado de partidos</a>
                    </li>
                    <li>
                        <a href="/consultas">Miscelaneo</a>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
