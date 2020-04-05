import React from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { FaFileAlt, FaNotesMedical, FaMobileAlt, FaSignOutAlt } from 'react-icons/fa'

import './styles.css';

import logo from '../../assets/logo_new.png';

export default function Layout({children}){

    const history = useHistory();
    const admin = JSON.parse(localStorage.getItem('admin'));
    
    if (!admin){
        history.push('/');
    }

    function handleExit(e){
        e.preventDefault();
        localStorage.removeItem('admin');
        history.push("/");
    }
    
    function renderLink(pathname, icon, descr){
        if (pathname === history.location.pathname){
            return (<span style={{
                backgroundColor: '#ffe700', 
                color: '#777'
            }}>{icon}{descr}</span>);
        }
        return (<Link to={pathname}>{icon}{descr}</Link>);
    }

    return (
       <div className="layout-container">
            <header className="layout-header">
                <div>
                    <img src={logo} alt="logotipo" />
                    <h1>Área administrativa</h1>
                </div>
                <div className="header-nav">
                    <p>Logado como: {admin ? admin.name : ''}</p>
                    <nav>
                        {renderLink('/posts', <FaFileAlt/>,'Publicações')}
                        {renderLink('/feels', <FaNotesMedical/>, 'Condições')}
                        {renderLink('/infos', <FaMobileAlt/>, 'Conteúdo')}
                        <button 
                            className="link-button"
                            onClick={handleExit}><FaSignOutAlt />Sair</button>
                    </nav>
                </div>
            </header>
            <div className="layout-body">
                {children}
            </div>
            <footer>
                &copy;Roger Couto - rogerecouto@gmail.com
            </footer>
        </div>
    );
    
}
