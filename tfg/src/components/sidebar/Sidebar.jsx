import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import './Sidebar.css';
import LogoCAAB from '../../assets/images/LogoCAAB.png'

// Iconos
import { FaUserGear } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import { FaRegClock } from "react-icons/fa6";
import { GiPriceTag } from "react-icons/gi";
import { IoDocumentsOutline } from "react-icons/io5";
import { GiWhistle } from "react-icons/gi";
import { PiCourtBasketballDuotone } from "react-icons/pi";
import { GiStairsGoal } from "react-icons/gi";
import { RiTeamLine } from "react-icons/ri";
import { GiMoneyStack } from "react-icons/gi";
import { PiRankingDuotone } from "react-icons/pi";
import { BsMotherboard } from "react-icons/bs";

const Sidebar = ({ onLogout }) => {
    const [permiso, setPermiso] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const userPermiso = localStorage.getItem('permiso');
        setPermiso(userPermiso);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('permiso');
        onLogout();
        navigate('/');
    };

    return (
        <div className="wrapper">
            <nav id="sidebar">
                <div className="sidebar-header">
                    <img src={LogoCAAB} alt="Logo CAAB" className="sidebar-logo" />
                </div>

                <ul className="list-unstyled components">
                    <li className={location.pathname === '/perfil' ? 'active' : ''}>
                        <Link to="/perfil"><FaUserGear />Perfil</Link>
                    </li>
                    <li className={location.pathname === '/consultas' ? 'active' : ''}>
                        <Link to="/consultas"><FaEye />Mostrar Partidos</Link>
                    </li>
                    <li className={location.pathname === '/nominas' ? 'active' : ''}>
                        <Link to="/nominas"><GiPriceTag />Mostrar Nóminas</Link>
                    </li>
                    <li className={location.pathname === '/disponibilidad' ? 'active' : ''}>
                        <Link to="/disponibilidad"><FaRegClock />NO Disponibilidad</Link>
                    </li>
                    <li className={location.pathname === '/informes' ? 'active' : ''}>
                        <Link to="/informes"><IoDocumentsOutline />Informes</Link>
                    </li>

                    {permiso !== '1' && (
                        <li className={location.pathname === '/tarifas' ? 'active' : ''}>
                            <Link to="/tarifas"><GiMoneyStack />Tarifas</Link>
                        </li>
                    )}

                    {permiso === '1' && (
                        <>
                            <li className={location.pathname === '/arbitros' ? 'active' : ''}>
                                <Link to="/arbitros"><GiWhistle />Árbitros</Link>
                            </li>
                            <li className={location.pathname === '/campos' ? 'active' : ''}>
                                <Link to="/campos"><PiCourtBasketballDuotone />Campos</Link>
                            </li>
                            <li className={location.pathname === '/categorias' ? 'active' : ''}>
                                <Link to="/categorias"><GiStairsGoal />Categorías</Link>
                            </li>
                            <li className={location.pathname === '/equipos' ? 'active' : ''}>
                                <Link to="/equipos"><RiTeamLine />Equipos</Link>
                            </li>
                            <li className={location.pathname === '/tarifas' ? 'active' : ''}>
                                <Link to="/tarifas"><GiMoneyStack />Tarifas</Link>
                            </li>
                            <li className={location.pathname === '/partidos' ? 'active' : ''}>
                                <Link to="/partidos"><PiRankingDuotone />Listado de partidos</Link>
                            </li>
                            <li className={location.pathname === '/miscelaneo' ? 'active' : ''}>
                                <Link to="/miscelaneo"><BsMotherboard />Misceláneo</Link>
                            </li>
                        </>
                    )}

                    {(permiso === '2') && (
                        <li className={location.pathname === '/partidos' ? 'active' : ''}>
                            <Link to="/partidos"><PiRankingDuotone />Listado de partidos</Link>
                        </li>
                    )}
                </ul>

                <div className="logout-button">
                    <button onClick={handleLogout}>Cerrar Sesión</button>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
