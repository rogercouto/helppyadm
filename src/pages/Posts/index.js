import React,{useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import { FaPlusCircle, FaEdit, FaTrash } from 'react-icons/fa';
import * as STATUS from '../../services/ResponseStatus';

import './styles.css';
import Layout from '../../pages/Layout';

import stylizer from '../../util/stylizer';
import service from '../../services/PostService';

export default function Posts(){

    const [pageNum, setPageNum] = useState(1);
    const [page, setPage] = useState(undefined);
    
    const history = useHistory();

    
    useEffect(() => {
        async function loadPosts(){
            const page = await service.getPage(pageNum);
            page.posts.forEach(stylizer.setStyle);
            setPage(page);
        }
        if (pageNum === 0){
            setPageNum(1);
        }else{
            loadPosts();
            window.scrollTo({top: 0, behavior: 'smooth'});
        }
    },[pageNum]);
    
    function handleNewPost(e){
        e.preventDefault();
        history.push('/posts/form');
    }

    function handleEdit(e, post){
        e.preventDefault();
        history.push({
            pathname: '/posts/form',
            state: post
        });
    }

    async function handleDelete(postId){
        if (!window.confirm("Confirma exclusão?"))
            return;
        const status = await service.delete(postId);
        if (STATUS.ok(status)){
            setPageNum(0);
        }
    }

    function renderYtFrame(link){
        return (
            <iframe 
                title="yt-frame" 
                width="350" 
                height="200" 
                src={link} 
                frameBorder="0" 
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen></iframe>
        );
    }

    function renderPost(post){
        const haveAtachment = post.media !== null
                        && post.media_type !== 'image' 
                        && post.media_type !== 'video' 
                        && post.media_type !== 'youtube';
        return(
            <li key={post.id} style={{height: "100%"}}>
                <h3>{post.title}&nbsp;</h3>
                <div style={post.divStyle}>
                    <span style={post.textStyle}>{post.text}</span>
                    {post.media_type === 'image' &&
                        <img alt="" src={post.media} />
                    }
                    {post.media_type === 'video' &&
                        <video controls>
                            <source src={post.media} type="video/mp4"></source>
                        </video>
                    }
                    {post.media_type === 'youtube' && renderYtFrame(post.media)}
                </div>
                <div className={haveAtachment ? "post-footer-wa" : "post-footer"}>
                    {haveAtachment &&
                        <a target="_blank" rel="noopener noreferrer" href={post.media}>Anexo</a>
                    }
                    Publicado em: {new Date(post.created_at).toLocaleString()}
                </div>
                <div>
                    <button onClick={(e)=>handleEdit(e,post)}><FaEdit/>Editar</button>
                    <button onClick={()=>handleDelete(post.id)}><FaTrash/>Excluir</button>
                </div>
            </li>
        );
    }

    function renderNav(total){
        const items = []
        for (let i = 1; i <= total; i++){
            items.push(
                <button key={i} onClick={()=>{
                    setPageNum(i);
                }}>{i}</button>
            );
        }
        return items;
    }

    return (
        <Layout>
            <div className="newpost-container">
                <h2>Publicações</h2>
                <button onClick={handleNewPost}><FaPlusCircle/> Criar publicação</button>
            </div>    
            <div className="posts-container">
                <ul>
                    {page && page.posts.map(renderPost)}
                </ul>
            </div>
            <div className="posts-pages">
                {page && renderNav(page.totalPages)}
            </div>        
        </Layout>
    );

}
