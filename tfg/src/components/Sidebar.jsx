import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Importa Link
import './styles/Sidebar.css';
import LogoCAAB from './images/LogoCAAB.png';

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
    const [permiso, setPermiso] = useState(null);
    const navigate = useNavigate();

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
                    <li>
                        <Link to="/perfil"><FaUserGear />Perfil</Link> {/* Cambié href a Link */}
                    </li>
                    <li className="active">
                        <Link to="/consultas"><FaEye />Mostrar Partidos</Link> {/* Cambié href a Link */}
                    </li>
                    <li>
                        <Link to="/nominas"><GiPriceTag />Mostrar Nóminas</Link> {/* Cambié href a Link */}
                    </li>
                    <li>
                        <Link to="/informes"><IoDocumentsOutline />Informes</Link> {/* Cambié href a Link */}
                    </li>
                    <li>
                        <Link to="/disponibilidad"><IoMdAlarm />Disponibilidad</Link> {/* Cambié href a Link */}
                    </li>

                    {permiso === '1' && (
                        <>
                            <li>
                                <Link to="/designacion"><IoCloudUploadOutline />Generar Designación</Link>
                            </li>
                            <li>
                                <Link to="/arbitros"><GiWhistle />Árbitros</Link>
                            </li>
                            <li>
                                <Link to="/campos"><PiCourtBasketballDuotone />Campos</Link>
                            </li>
                            <li>
                                <Link to="/categorias"><GiStairsGoal />Categorías</Link>
                            </li>
                            <li>
                                <Link to="/equipos"><RiTeamLine />Equipos</Link>
                            </li>
                            <li>
                                <Link to="/tarifas"><GiMoneyStack />Tarifas</Link>
                            </li>
                            <li>
                                <Link to="/partidos"><PiRankingDuotone />Listado de partidos</Link>
                            </li>
                            <li>
                                <Link to="/miscelaneo"><BsMotherboard />Misceláneo</Link>
                            </li>
                        </>
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
