import React from 'react';
import './styles/Partidos.css';

import { IoCreateOutline } from "react-icons/io5";
import { CgImport } from "react-icons/cg";
import { TbEyeCheck } from "react-icons/tb";

const Partidos = () => {
    return (
        <div className="partidos-container">
            <h1 className="partidos-title">Listado de Partidos</h1>

            <button className="button">
                <IoCreateOutline style={{ marginRight: '8px' }} />
                Crear Partido
            </button>
            <button className="button">
                <CgImport style={{ marginRight: '8px' }} />
                Importar Partido
            </button>
            <button className="button">
                <TbEyeCheck style={{ marginRight: '8px' }} />
                Crear Informe
            </button>
        </div>
    );
};

export default Partidos;