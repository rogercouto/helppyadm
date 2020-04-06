import api from './api';
import * as STATUS from './ResponseStatus';

const InfoService = {

    async getAll(){
        const response = await api.get('infos');
        return response.data;
    },

    async create(info){
        const admin = JSON.parse(localStorage.getItem('admin'));
        if (!admin)
            return STATUS.UNAUTHORIZED;
        const bearerToken = 'Bearer '+admin.token;
        try {
            const response = await api.post('infos', info, {
                headers:{
                    Authorization: bearerToken
                }
            }); 
            return response.status;
        } catch (error) {
            if (error.response.data.message === 'Info with this key already exists.')
                error.response.data.message = 'Já existe um conteúdo com essa chave!';
            alert(error.response.data.message);
            return error.response.status;
        }
    },

    async update(info){
        const admin = JSON.parse(localStorage.getItem('admin'));
        if (!admin)
            return STATUS.UNAUTHORIZED;
        const bearerToken = 'Bearer '+admin.token;
        try {
            const data = {title: info.title, text : info.text};
            const response = await api.put(`infos/${info.key}`, data, {
                headers:{
                    Authorization: bearerToken
                }
            }); 
            return response.status;
        } catch (error) {
            alert(error.response.data.message);
            return error.response.status;
        }
    },

    async delete(infoKey){
        const admin = JSON.parse(localStorage.getItem('admin'));
        if (!admin)
            return STATUS.UNAUTHORIZED;
        const bearerToken = 'Bearer '+admin.token;
        try {
            const response = await api.delete(`infos/${infoKey}`, {
                headers:{
                    Authorization: bearerToken
                }
            }); 
            return response.status;
        } catch (error) {
            alert(error.response.data.message);
            return error.response.status;
        }
    }

}

export default InfoService;