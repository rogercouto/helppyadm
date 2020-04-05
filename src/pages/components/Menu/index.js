import React from 'react';
import { Link } from 'react-router-dom';

import './styles.css';

export default function Header(){
    return (
        <nav className="old-nav">
            <Link to="/dashboard">Postagens</Link>
            <Link to="/dashboard">Condições</Link>
            <Link to="/dashboard">Conteúdo</Link>        
        </nav>
    );
}