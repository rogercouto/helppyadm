import api from './api';
import * as STATUS from './ResponseStatus';

function getTotalPages(response){
    const total = response.headers['x-total-count'];
    const pageSize = response.headers['x-page-size'];
    if (total > 0 && pageSize > 0){
        const div = total / pageSize;
        let pages = parseInt(div, 10);
        if (pages < div)
            pages++;
        return pages;
    }
}

const PostService = {

    async getPage(pageNum){
        const response = await api.get('posts',{params: { page: pageNum }});
        const page = {
            posts : response.data,
            total: response.headers['x-total-count'],
            pageSize: response.headers['x-page-size'],
            totalPages: getTotalPages(response)
        }
        return page;
    },  

    async create(post){
        const admin = JSON.parse(localStorage.getItem('admin'));
        if (!admin)
            return STATUS.UNAUTHORIZED;
        const bearerToken = 'Bearer '+admin.token;
        try {
            const data = {
                title: post.title,
                text: post.text,
                text_align: post.text_align,
                text_bg: post.text_bg,
                media: post.media,
                media_type: post.media_type
            }
            const response = await api.post('posts', data, {
                headers:{
                    Authorization: bearerToken
                }
            }); 
            return response.status;
        } catch (error) {
            console.log(error);
            return error.response.status;
        }
    },

    async update(post){
        const admin = JSON.parse(localStorage.getItem('admin'));
        if (!admin)
            return STATUS.UNAUTHORIZED;
        const bearerToken = 'Bearer '+admin.token;
        try {
            const data = {
                title: post.title,
                text: post.text,
                text_align: post.text_align,
                text_bg: post.text_bg
            };
            if (!post.keepMedia){
                data.media = post.media;
                data.media_type = post.media_type;
            }
            const response = await api.put(`posts/${post.id}`, data, {
                headers:{
                    Authorization: bearerToken
                }
            }); 
            return response.status;
        } catch (error) {
            console.log(error);
            return error.response.status;
        }
    },

    async upload(post, mediaFile){
        const admin = JSON.parse(localStorage.getItem('admin'));
        if (!admin)
            return STATUS.UNAUTHORIZED;
        const bearerToken = 'Bearer '+admin.token;
        const data = new FormData();
        data.append('media',mediaFile);
        if (post.title && post.title !== '')
        data.append('title', post.title);
        if (post.text && post.text !== ''){
            data.append('text', post.text);
        }    
        try {
            const response = await api.post('upload', data, {
                headers:{
                    Authorization: bearerToken
                }
            });
            return response.status;
        } catch (error) {
            console.log(error);
            return error.response.status;
        }
    },

    async updateUpload(post, mediaFile){
        const admin = JSON.parse(localStorage.getItem('admin'));
        if (!admin)
            return STATUS.UNAUTHORIZED;
        const bearerToken = 'Bearer '+admin.token;
        const data = new FormData();
        data.append('media',mediaFile);
        if (post.title && post.title !== '')
        data.append('title', post.title);
        if (post.text && post.text !== ''){
            data.append('text', post.text);
        }    
        try {
            const response = await api.put(`upload/${post.id}`, data, {
                headers:{
                    Authorization: bearerToken
                }
            });
            return response.status;
        } catch (error) {
            console.log(error);
            return error.response.status;
        }
    },

    async delete(postId){
        const admin = JSON.parse(localStorage.getItem('admin'));
        if (!admin)
            return STATUS.UNAUTHORIZED;
        try {
            const bearerToken = 'Bearer '+admin.token;
            const response = await api.delete('posts/'+postId,{headers:{
                    Authorization: bearerToken
                }});
            return response.status;
        } catch (error) {
            return error.response.status;
        }
    }

}

export default PostService;