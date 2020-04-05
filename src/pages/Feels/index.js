import React,{useState, useEffect} from 'react';
import { FaPlusCircle, FaEdit, FaTrash, FaSave, FaWindowClose, FaStepBackward } from 'react-icons/fa'

import service from '../../services/FeelService';
import * as STATUS from '../../services/ResponseStatus';
import Layout from '../../pages/Layout';

import './styles.css';

const STATE_UNLOADED = -1;
const STATE_READY = 0;
const STATE_CREATING = 1;
const STATE_UPDATING = 2;

export default function Feels(){

    const [editState, setEditState] = useState(STATE_UNLOADED); 
    const [feels, setFeels] = useState([]);
    const [id, setId] = useState(0);
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [descr, setDescr] = useState('');

    useEffect(() => {
        if (editState === STATE_UNLOADED){
            async function loadFeels(){
                const list = await service.getAll();
                setFeels(list);
            }
            loadFeels();
            setEditState(STATE_READY);//loaded
        }
    }, [editState]);

    function handleNewContent(e){
        e.preventDefault();
        if (editState === STATE_READY){
            setEditState(STATE_CREATING);
            setTitle('');
            setSubtitle('');
            setDescr('');
        }else if (editState === STATE_CREATING){
            setEditState(STATE_READY);
        }
    }

    async function handleSave(e){
        e.preventDefault();
        if (editState === STATE_CREATING){
            const feel = {title, subtitle, descr};
            const status = await service.create(feel);
            if (STATUS.ok(status)){
               setEditState(STATE_UNLOADED);
            }
        }else if (editState === STATE_UPDATING){
            const feel = {id, title, subtitle, descr};
            const status = await service.update(feel);
            if (STATUS.ok(status)){
                setEditState(STATE_UNLOADED);
            }
        }
    }

    function handleEdit(e, feel){
        e.preventDefault();
        setEditState(STATE_UPDATING);
        setId(feel.id);
        setTitle(feel.title);
        setSubtitle(feel.subtitle);
        setDescr(feel.descr);
        window.scrollTo({top: 0, behavior: 'smooth'});
    }

    async function handleDelete(e, feel){
        e.preventDefault();
        if (!window.confirm("Confirma exclusão?"))
            return;
        const status = await service.delete(feel.id);
        if (STATUS.ok(status)){
            setEditState(STATE_UNLOADED);
        }
    }

    function handleCancel(e){
        e.preventDefault();
        setEditState(STATE_READY);
        setId(0);
        setTitle('');
        setSubtitle('');
        setDescr('');
    }

    function renderFeel(feel){
        return(
            <tr key={feel.id}>
                <td>
                    <strong>{feel.title}</strong>
                </td>
                <td>
                    <strong>{feel.subtitle}</strong>
                </td>
                <td>
                    <span>{feel.descr}</span>
                </td>
                <td className="small-td">
                    <button onClick={(e)=>handleEdit(e,feel)}><FaEdit/>Editar</button>
                    <button onClick={(e)=>handleDelete(e,feel)}><FaTrash/>Excluir</button>
                </td>
            </tr>
        );
    }

    return (
        <Layout>
            <div className="feel-container">
                <div className="newfeel-container">
                    <h2>Condições</h2>
                    <button 
                        id={editState === STATE_CREATING?'newfeel-btn-pressed':'newfeel-btn'}
                        onClick={handleNewContent}
                        >
                        <FaPlusCircle/>Criar condição
                    </button>
                </div>
                <div className="feel-form-container">
                    <form id={editState >= STATE_CREATING?'feel-form':'feel-form-hide'}
                        onSubmit={handleSave}
                    >  
                        <input placeholder="Título" 
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                        <input placeholder="Sub-Título" 
                            value={subtitle}
                            onChange={e => setSubtitle(e.target.value)}
                        />
                        <textarea placeholder="Descrição" 
                            value={descr}
                            onChange={e => setDescr(e.target.value)}
                        />
                        <div>
                            <button><FaSave/>Salvar</button>
                            <button onClick={handleCancel}><FaWindowClose/>Cancelar</button>
                        </div>
                    </form>
                </div>                  
                <table>
                    <tbody>
                        {feels.map(renderFeel)}
                    </tbody>
                </table>
            </div>    
        </Layout>
    );
}
