import React,{useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import convert from '../../util/convert';
import stylizer from '../../util/stylizer';
import './styles.css';

import Layout from '../../pages/Layout';

import service from '../../services/PostService';
import * as STATUS from '../../services/ResponseStatus';

//funções auxiliares
function getMediaIndex(post){
    if (!post || !post.media_type)
        return 0;
    if (post.media_type === 'image' || post.media_type === 'video')
        return 1;
    return 2;         
}

function getHexBgColor(post){
    if (post && post.text_bg){
        return convert.rgbToHex(post.text_bg);
    }
    return '#ffffff';
}

function getMediaType(mediaFile){
    if (mediaFile.type.includes('image'))
        return 'image';
    else if (mediaFile.type.includes('video'))    
        return 'video';
    return 'upload';
}

function checkLinkType(link){
    if (link.endsWith('.jpg')
    ||link.endsWith('.jpeg')
    ||link.endsWith('.png')){
        return 'image';
    }
    //add youtube later
    return 'link';
}

function checkLink(post) {
    if (!post || !post.media)
        return;
    if (post.media.includes('https://youtu.be/')) {
        let tmp = post.media.replace('https://youtu.be/','').split('?');
        if (tmp.length > 0){
            post.media = tmp[0];
            post.media_type = 'youtube';
        }
    }else if (post.media.includes('https://www.youtube.com/watch?v=')){
        let tmp = post.media.replace('https://www.youtube.com/watch?v=','').split('?');
        if (tmp.length > 0){
            post.media = tmp[0];
            post.media_type = 'youtube';
        }
    }else if (post.media.endsWith('.jpg')
    ||post.media.endsWith('.jpeg')
    ||post.media.endsWith('.png')){
        post.media_type = 'image';
    }
}

function isYt(link){
    return (link.includes('https://youtu.be/') 
    || link.includes('https://www.youtube.com'));
}

function getImage(post){
    if (post && post.media && post.media_type === 'image'){
        return post.media;
    }else if (post && post.media && post.media_type === 'link'){
        if (checkLinkType(post.media) === 'image')
            return post.media;
    }
}

export default function PostForm(props){
    
    let post = props.location.state ? props.location.state : {};

    const history = useHistory();

    //variáveis do formulario
    const [title, setTitle] = useState(
        post && post.title ? post.title : ''
    );

    const [text, setText] = useState( 
        post && post.text ? post.text : ''
    );
    const [textAlign, setTextAlign] = useState( 
        post && post.text_align ? post.text_align : '-'
    );
    const [withoutBg, setWithoutBg] = useState(
        post && post.text_bg ? false : true
    );
    const [bgColor, setBgColor] = useState(
        getHexBgColor(post)
    );
    const [mediaIndex, setMediaIndex] = useState(0);

    const [mediaFile, setMediaFile] = useState(undefined);

    const [mediaLink, setMediaLink] = useState(
        getMediaIndex(post) === 2 ? post.media : ''
    );

    const [image, setImage] = useState(getImage(post));

    const [video, setVideo] = useState(
        post && post.media && post.media_type === 'video' ? post.media : undefined
    );

    const [atachment, setAtachment] = useState(
        post && post.media && post.media_type === 'link' ? post.media : undefined
    );

    useEffect(() => {
        if (mediaFile){
            if (getMediaType(mediaFile) === 'image'){
                setImage(URL.createObjectURL(mediaFile));
                setVideo(undefined);
                setAtachment(undefined);
            }else if (getMediaType(mediaFile) === 'video'){
                setImage(undefined);
                setVideo(URL.createObjectURL(mediaFile));
                setAtachment(undefined);
            }
        }else if (mediaLink){
            if (checkLinkType(mediaLink) === 'image'){
                setImage(mediaLink);
                setVideo(undefined);
                setAtachment(undefined);
            }else{
                setImage(undefined);
                setVideo(undefined);
                setAtachment(mediaLink);
            }
        }
        post.title = title;
        post.text = text !== '' ? text : null;
        post.text_align = textAlign !== '-' ? textAlign : null;
        post.text_bg = !withoutBg ? convert.hexToRgbString(bgColor) : null;
        switch(parseInt(mediaIndex,10)){
            case 0:
                post.keepMedia = true;
                break;
            case 1:
                post.keepMedia = false;
                if (mediaFile){
                    post.media = URL.createObjectURL(mediaFile);
                    post.media_type = getMediaType(mediaFile);
                }
                break;
            case 2:
                post.keepMedia = false;
                post.media = mediaLink;
                post.media_type = 'link';
                break;
            case 3: 
                post.keepMedia = false;
                post.media = null;
                post.media_type = null;
                break;   
            default:
                break;
            
        }
    }, [post, title, text, textAlign, withoutBg, bgColor, mediaIndex, mediaFile, mediaLink]);
        

    async function handleSubmit(e){
        e.preventDefault();
        if (post.title === ''){
            post.title = null;
        }
        if (post.text === ''){
            post.text = null;
        }
        if (post.media === ''){
            post.media = null;
        }
        checkLink(post);
        if (!post.text && !post.media){
            alert('Publicação sem conteúdo!');
            return;
        }
        if (!post.text && post.media){
            if (!post.title && post.media_type === 'link'){
                alert('Publicação com links devem ter um título ou texto!');
                return;
            }
        }
        console.log(post.media_type);
        let status;
        if (!post.id){
            if (!mediaFile){
                status = await service.create(post);
            }else{
                status = await service.upload(post, mediaFile);
            }
        }else{
            if (!mediaFile){
                status = await service.update(post);
            }else{
                status = await service.updateUpload(post, mediaFile);
            }
        }
        if (STATUS.ok(status)){
            history.push('/posts');
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
                allowFullScreen>
                </iframe>
        );
    }

    function renderPreview(){
        const withScreenMedia = image || video || isYt(mediaLink);
        return(
            <li key='li1' style={{height: "100%"}}>
                <p>(pré-visualização)</p>
                <h3>{title}</h3>
                <div style={stylizer.getDivStyle(withScreenMedia, withoutBg, bgColor)}>
                    <span style={stylizer.getTextStyle(text, textAlign, withScreenMedia, withoutBg, bgColor)}>
                        {text}
                    </span>
                    {image &&
                        <img alt="" src={image} />
                    }
                    {video &&
                        <video controls>
                            <source src={video} type="video/mp4"></source>
                        </video>
                    }
                    {isYt(mediaLink) && renderYtFrame(mediaLink)}
                </div>
                <div className={atachment ? "post-footer-wa" : "post-footer"}>
                    {atachment &&
                        <a target="_blank" rel="noopener noreferrer" href={atachment}>Anexo</a>
                    }
                    Publicado em: {new Date().toLocaleString()}
                </div>
            </li>
        );
    }

    return (
        <Layout>
            <div className="form-container">
                <form encType="multipart/form-data" onSubmit={handleSubmit}>
                    <h1>{post && post.id ? 'Editar':'Nova'} postagem</h1>
                    <input type="text" placeholder="Título"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                    <textarea placeholder="Texto"
                        value={text}
                        onChange={e => setText(e.target.value)}
                    ></textarea>
                    <div>
                        <div className="align-container">
                            Alinhamento: 
                            <select
                                value={textAlign}
                                disabled={mediaFile}
                                onChange={e => setTextAlign(e.target.value)}
                            >
                                <option>-</option>
                                <option value="left">Esquerda</option>
                                <option value="right">Direita</option>
                                <option value="center">Centralizado</option>
                                <option value="justify">Justificado</option>
                            </select>
                        </div>
                        <div className="bg-container">
                            Cor de fundo:
                            <input type="color"
                                value={!withoutBg ? bgColor : '#ffffff'}
                                onChange={e => setBgColor(e.target.value)}
                                disabled={withoutBg}
                            ></input>
                            <input type="checkbox" 
                                disabled={mediaFile}
                                checked={withoutBg}
                                onChange={e => setWithoutBg(e.target.checked)}
                                />Sem cor de fundo
                        </div>
                        <div className="midia-container">
                            <p>
                                Mídia: 
                                <select 
                                    value={mediaIndex}
                                    onChange={e => setMediaIndex(e.target.value)}
                                >
                                    <option value="0">{post && post.id > 0 ? 'Manter' : 'Nenhuma'}</option>
                                    <option value="1">Upload</option>
                                    <option value="2">Link</option>
                                    <option value="3">Remove</option>
                                </select>
                            </p>
                            <input type="file"
                                style={{display: mediaIndex ==='1'? 'block' : 'none'}}
                                onChange={e => {
                                    setWithoutBg(true);
                                    setTextAlign('-');
                                    setMediaFile(e.target.files[0]);
                                }}
                            />
                            <input type="text" placeholder="htp://www.website.com"
                                style={{display: mediaIndex === '2'? 'block' : 'none'}}
                                value={mediaLink}
                                onChange={e => setMediaLink(e.target.value)}
                            />
                        </div>
                    </div>
                    <div id="submit-div" >
                        <button className="cbutton" type="submit">Publicar</button>
                    </div>
                </form>
                <div className="preview-container">
                    <ul>
                        {renderPreview()}
                    </ul>             
                </div>
            </div>
        </Layout>
    );
}
