import React,{useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';


import logo from '../../assets/logo_new.png';
import './styles.css';

import service from '../../services/SessionService';
import * as STATUS from '../../services/ResponseStatus';


export default function Welcome(){
    
    const history = useHistory();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    
    useEffect(() => {
        function goToPosts(){
            history.push('/posts');
        }
        const admin = JSON.parse(localStorage.getItem('admin'));
        if (admin){
            goToPosts();
        }
    }, [history, email]);

    async function handleSubmit(e){
        e.preventDefault();
        const status = await service.logon(email,password);
        if(STATUS.ok(status) === true){
            history.push('/posts');
        }else if (status === STATUS.NOT_FOUND){
            alert('E-mail não cadastrado!');
        }else if (status === STATUS.UNAUTHORIZED){
            alert('Senha incorreta!');
        }else{
            alert('Erro ao fazer login, contate o administrador do sistema!');
        }
    }

    return (
        <div className="welcome-container">
            <img src={logo} alt="logotipo" />
            <h1>Área administrativa</h1>
            <p>Para acessar o sistema entre com suas credenciais</p>
            <form className="welcome-form" onSubmit={handleSubmit}>
                <input required type="e-mail" placeholder="E-mail de acesso"
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                />
                <input required type="password" placeholder="Senha" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <button type="submit">Entrar</button>
            </form>
        </div>
    );
}
