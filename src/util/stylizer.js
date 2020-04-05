import convert from './convert';

function getTextFontColor(post){
    let sum = 0;
    if (!post.text_bg)
        return '#000';
    post.text_bg.forEach(n=>{
        sum += n;
    });
    return sum < 300 ? '#ffffff' : '#000000'
}

function getHexFontColor(hexColor){
    const rgb = convert.hexToRgb(hexColor);
    let sum = 0;
    rgb.forEach(n=>{
        sum += n;
    });
    return sum < 300 ? '#ffffff' : '#000000'
}

function fixText(post){
    post.text = '\t'+post.text.replace('\n','\n\t');
}

function getFontSize(post){
    if (haveScreenMedia(post) || post.text_bg === null){
        return '14px';
    }
    if (post.text){
        if (post.text.length > 15 && post.text.length < 30)
            return '24px';
        else if (post.text.length > 30){
            fixText(post);
            return '14px';
        }
    }
    return '36px';
}

function getTextFontSize(text, withScreenMedia, withBg){
    if (withScreenMedia || withBg || !text || text === null){
        return '14px';
    }
    if (text.length > 15 && text.length < 30)
        return '24px';
    else if (text.length > 30){
        return '14px';
    }
    return '36px';
}

function haveScreenMedia(post){
    if (post.media && 
        (post.media_type === 'image' 
        || post.media_type === 'video' 
        || post.media_type === 'youtube')){
        return true;
    }
    return false;
}

function getBorder(post){
    if (post.text !== null && !haveScreenMedia(post))
        return '1px solid #eeeeee';
    return '0';
}

function getBackgroundColor(post){
    if (!post.text_bg || haveScreenMedia(post)){
        return '#ffffff';
    }
    return convert.rgbToHex(post.text_bg);
}

function getDivAlign(post){
    if (!haveScreenMedia(post) && post.text_bg){
        return 'center';
    }
    return 'baseline';
}

const stylizer = {
    
    setStyle(post){
        post.textStyle = {
            color: getTextFontColor(post),
            fontSize: getFontSize(post),
            width: '100%',
            padding: haveScreenMedia(post) && !post.text ? '0px' : '5px',
            margin: haveScreenMedia(post) && !post.text ? '0' : '5px',
            whiteSpace: 'pre-wrap',
            textAlign: post.text_align? post.text_align : 'left',
            cursor: 'auto',
            backgroundColor: getBackgroundColor(post),
        };
        post.divStyle = {
            display: 'flex',
            flexDirection: haveScreenMedia (post) ? 'column' : 'row',
            border: getBorder(post),
            minHeight: '200px',
            backgroundColor: getBackgroundColor(post),
            alignItems: getDivAlign(post),
            height: "80%", 
        };
    },

    getDivStyle(withScreenMedia, withoutBg, bgColor){
        return {
            display: 'flex',
            flexDirection: withScreenMedia ? 'column' : 'row',
            border: withScreenMedia ? '0' : '1px solid #eeeeee',
            minHeight: '200px',
            backgroundColor: !withoutBg ? bgColor : '#ffffff',
            alignItems: withScreenMedia || withoutBg ? 'baseline' : 'center',//baseline or center
            height: "80%", 
        }
    },

    getTextStyle(text, textAlign, withScreenMedia, withoutBg, bgColor){
        return {
            color: !withoutBg ? getHexFontColor(bgColor) : '#000000',
            fontSize: !withoutBg ? getTextFontSize(text) : '14px',
            width: '100%',
            padding: withScreenMedia && text !== '' ? '0px' : '5px',
            margin: withScreenMedia && text !== '' ? '0' : '5px',
            whiteSpace: 'pre-wrap',
            textAlign: textAlign !== '-' ? textAlign : 'left',
            backgroundColor: !withoutBg ? bgColor : '#ffffff',
            cursor: 'auto',
        }
    },

    getFixedText(text){
        return '\t'+text.replace('\n','\n\t');
    }

}

export default stylizer;