import React,{ useState } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../../services/api'

import logo from '../../assets/logo_full.png';

import './styles.css';

export default function Logon(){
    
    const [email, setEmail] = useState('rogerecouto@gmail.com');
    const [password, setPassword] = useState('admin');

    const history = useHistory();

    const admin = JSON.parse(localStorage.getItem('admin'));

    if (admin){
        history.push('/dashboard');
    }

    async function handleSubmit(e){
        e.preventDefault();
        try {
            const admin = await api.post('session', {email, password});
            const ongstr = JSON.stringify(admin);
            localStorage.setItem('admin', ongstr);
            history.push('/dashboard');
        } catch (error) {
            alert('E-mail e(ou) senha inválido(s)')
        }
    }
    
    return (
        <div className="logon-container">
            <img src={logo} alt="logotipo"></img>
            <section className="logon-form">
                <h1>Enforme suas credenciais de acesso</h1>
                <form onSubmit={handleSubmit}>
                    <input placeholder="E-mail" type="email" required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <input placeholder="Senha" type="password" required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <button type="submit" className="button">Entrar</button>
                </form>
            </section>
        </div>
    );
}