import React,{useState, useEffect} from 'react';
import { FaPlusCircle, FaEdit, FaTrash, FaSave, FaWindowClose } from 'react-icons/fa'

import service from '../../services/InfoService';
import * as STATUS from '../../services/ResponseStatus';
import Layout from '../../pages/Layout';

import './styles.css';

const STATE_UNLOADED = -1;
const STATE_READY = 0;
const STATE_CREATING = 1;
const STATE_UPDATING = 2;

export default function Infos(){

    const [editState, setEditState] = useState(STATE_UNLOADED); 
    const [infos, setInfos] = useState([]);
    const [key, setKey] = useState('');
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');

    useEffect(() => {
        if (editState === STATE_UNLOADED){
            async function loadInfos(){
                const list = await service.getAll();
                setInfos(list);
            }
            loadInfos();
            setEditState(STATE_READY);//loaded
        }
    }, [editState]);

    function handleNewContent(e){
        e.preventDefault();
        if (editState === STATE_READY){
            setEditState(STATE_CREATING);
            setKey('');
            setTitle('');
            setText('');
        }else if (editState === STATE_CREATING){
            setEditState(STATE_READY);
        }
    }

    async function handleSave(e){
        e.preventDefault();
        if (editState === STATE_CREATING){
            const info = {key, title, text};
            const status = await service.create(info);
            if (STATUS.ok(status)){
               setEditState(STATE_UNLOADED);
            }
        }else if (editState === STATE_UPDATING){
            const info = {key, title, text};
            const status = await service.update(info);
            if (STATUS.ok(status)){
                setEditState(STATE_UNLOADED);
            }
        }
    }

    function handleEdit(e, info){
        e.preventDefault();
        setEditState(STATE_UPDATING);
        setKey(info.key);
        setTitle(info.title);
        setText(info.text);
    }

    async function handleDelete(e, info){
        e.preventDefault();
        if (!window.confirm("Confirma exclusão?"))
            return;
        const status = await service.delete(info.key);
        if (STATUS.ok(status)){
            setEditState(STATE_UNLOADED);
        }
    }

    function handleCancel(e){
        e.preventDefault();
        setEditState(STATE_READY);
        setKey('');
        setTitle('');
        setText('');
    }

    function renderInfo(info){
        return(
            <tr key={info.key}>
                <td>
                    <span>{info.key}</span>
                </td>
                <td>
                    <span>{info.title}</span>
                </td>
                <td>
                    <span>{info.text}</span>
                </td>
                <td className="small-td">
                    <button onClick={(e)=>handleEdit(e,info)}><FaEdit/>Editar</button>
                    <button onClick={(e)=>handleDelete(e,info)}><FaTrash/>Excluir</button>
                </td>
            </tr>
        );
    }

    return (
        <Layout>
            <div className="info-container">
                <div className="newinfo-container">
                    <h2>Conteúdo</h2>
                    <button 
                        id={editState === STATE_CREATING?'newinfo-btn-pressed':'newinfo-btn'}
                        onClick={handleNewContent}
                        >
                        <FaPlusCircle/>Criar conteúdo
                    </button>
                </div>
                <div className="info-form-container">
                    <form id={editState >= STATE_CREATING?'info-form':'info-form-hide'}
                        onSubmit={handleSave}
                    >  
                        <input placeholder="Chave (única)" 
                            value={key}
                            onChange={e => setKey(e.target.value)}
                            disabled={editState === STATE_UPDATING} 
                            required
                        />
                        <input placeholder="Título" 
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                        />
                        <textarea placeholder="Texto" 
                            value={text}
                            onChange={e => setText(e.target.value)}
                            required
                        />
                        <div>
                            <button><FaSave/>Salvar</button>
                            <button onClick={handleCancel}><FaWindowClose/>Cancelar</button>
                        </div>
                    </form>
                </div>                  
                <table>
                    <tbody>
                        {infos.map(renderInfo)}
                    </tbody>
                </table>
            </div>    
        </Layout>
    );
}
