import React from 'react';

import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { FaFileAlt, FaNotesMedical, FaMobileAlt, FaSignOutAlt } from 'react-icons/fa'

import './styles.css';

import logo from '../../../assets/logo_new.png';

export default function Header(){

    const history = useHistory();
    const item = JSON.parse(localStorage.getItem('admin'));
    if (!item){
        history.push('/');
    }
    const admin = item.data;
    
    function handleExit(e){
        e.preventDefault();
        localStorage.clear();
        history.push("/");
    }
    
    return (
        <header id="main-header" className="component-header">
            <div>
                <img src={logo} alt="logotipo" />
                <h1>Área administrativa</h1>
            </div>
            <div className="header-nav">
                <p>Logado como: {admin.name}</p>
                <nav>
                    <Link to="/posts"><FaFileAlt/>Publicações</Link>
                    <Link to="/welcome"><FaNotesMedical/>Condições</Link>
                    <Link to="/welcome"><FaMobileAlt/>Conteúdo</Link>
                    <a href="/"><FaSignOutAlt onClick={handleExit}/>Sair</a>
                </nav>
            </div>
        </header>
    );

}