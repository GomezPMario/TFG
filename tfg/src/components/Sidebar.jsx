import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Sidebar.css';
import LogoCAAB from './images/LogoCAAB.png'; // Importa la imagen

// Iconos
import { FaUserGear } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import { GiPriceTag } from "react-icons/gi";
import { IoDocumentsOutline } from "react-icons/io5";
import { IoMdAlarm } from "react-icons/io";
import { IoCloudUploadOutline } from "react-icons/io5";
import { GiWhistle } from "react-icons/gi";
import { PiCourtBasketballDuotone } from "react-icons/pi";
import { GiStairsGoal } from "react-icons/gi";
import { RiTeamLine } from "react-icons/ri";
import { GiMoneyStack } from "react-icons/gi";
import { PiRankingDuotone } from "react-icons/pi";
import { BsMotherboard } from "react-icons/bs";

const Sidebar = ({ onLogout }) => {

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        onLogout(); // Llama a la función onLogout para actualizar el estado
        navigate('/'); // Redirige a la página de login
    };

    return (
        <div className="wrapper">
            <nav id="sidebar">
                <div className="sidebar-header">
                    {/* Imagen del logo */}
                    <img src={LogoCAAB} alt="Logo CAAB" className="sidebar-logo" />
                </div>

                <ul className="list-unstyled components">
                    <li>
                        <a href="/consultas"><FaUserGear />Perfil</a>
                    </li>
                    <li className="active">
                        <a href="/consultas"><FaEye />Mostrar Partidos</a>
                    </li>
                    <li>
                        <a href="/consultas"><GiPriceTag />Mostrar Nóminas</a>
                    </li>
                    <li>
                        <a href="/consultas"><IoDocumentsOutline />Informes</a>
                    </li>
                    <li>
                        <a href="/consultas"><IoMdAlarm />Disponibilidad</a>
                    </li>
                    <li>
                        <a href="/consultas"><IoCloudUploadOutline />Generar Designación</a>
                    </li>
                    <li>
                        <a href="/consultas"><GiWhistle />Árbitros</a>
                    </li>
                    <li>
                        <a href="/consultas"><PiCourtBasketballDuotone />Campos</a>
                    </li>
                    <li>
                        <a href="/consultas"><GiStairsGoal />Categorías</a>
                    </li>
                    <li>
                        <a href="/consultas"><RiTeamLine />Equipos</a>
                    </li>
                    <li>
                        <a href="/consultas"><GiMoneyStack />Tarifas</a>
                    </li>
                    <li>
                        <a href="/consultas"><PiRankingDuotone />Listado de partidos</a>
                    </li>
                    <li>
                        <a href="/consultas"><BsMotherboard />Misceláneo</a>
                    </li>
                </ul>
                <div className="logout-button">
                    <button onClick={handleLogout}>Cerrar Sesión</button>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
