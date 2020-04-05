import api from './api';

const SessionService = {

    async logon(email, password){
        try {
            const response = await api.post('session', {email, password});
            const admin = JSON.stringify(response.data);
            localStorage.setItem('admin', admin);
            return response.status;
        } catch (error) {
            return error.response.status;
        }
    }    

}

export default SessionService;