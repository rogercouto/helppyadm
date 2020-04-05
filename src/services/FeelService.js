import api from './api';
import * as STATUS from './ResponseStatus';

const FeelService = {

    async getAll(){
        const response = await api.get('feels');
        return response.data;
    },

    async create(feel){
        const admin = JSON.parse(localStorage.getItem('admin'));
        if (!admin)
            return STATUS.UNAUTHORIZED;
        const bearerToken = 'Bearer '+admin.token;
        try {
            const response = await api.post('feels', feel, {
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

    async update(feel){
        const admin = JSON.parse(localStorage.getItem('admin'));
        if (!admin)
            return STATUS.UNAUTHORIZED;
        const bearerToken = 'Bearer '+admin.token;
        const data = {
            title: feel.title,
            subtitle: feel.subtitle,
            descr: feel.descr
        };
        try {
            const response = await api.put(`feels/${feel.id}`, data, {
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

    async delete(feelId){
        const admin = JSON.parse(localStorage.getItem('admin'));
        if (!admin)
            return STATUS.UNAUTHORIZED;
        const bearerToken = 'Bearer '+admin.token;
        try {
            const response = await api.delete(`feels/${feelId}`, {
                headers:{
                    Authorization: bearerToken
                }
            }); 
            return response.status;
        } catch (error) {
            console.log(error);
            return error.response.status;
        }
    }

}

export default FeelService;