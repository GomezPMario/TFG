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
                        <a href="">Perfil</a>
                    </li>
                    <li>
                        <a href="">Mostrar Partidos</a>
                    </li>
                    <li>
                        <a href="">Informes</a>
                    </li>
                    <li>
                        <a href="">Disponibilidad</a>
                    </li>
                    <li>
                        <a href="">Generar Designación</a>
                    </li>
                    <li>
                        <a href="">Árbitros</a>
                    </li>
                    <li>
                        <a href="">Campos</a>
                    </li>
                    <li>
                        <a href="">Categorías</a>
                    </li>
                    <li>
                        <a href="">Equipos</a>
                    </li>
                    <li>
                        <a href="">Tarifas</a>
                    </li>
                    <li>
                        <a href="">Listado de partidos</a>
                    </li>
                    <li>
                        <a href="">Miscelaneo</a>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
