import axios from 'axios';

interface AxiosResponse {
    data: any;
    status: number;
    statusText: string;
    headers: any;
    config: any;
    request: any;
}

class HttpError extends Error {
    constructor(message: string, public response: AxiosResponse) {
        super(message);
    }
}

const API_BASE_URL = process.env.REACT_APP_API_URL;

export class ApiService {
    private apiClient = axios.create({
        baseURL: API_BASE_URL,
    });

    async logout(endpoint: string): Promise<any> {
        const token = window.sessionStorage.getItem('token')
        const headers:any = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token,
        };
        if (token){
            try {
                const response = await this.apiClient.get(endpoint, { headers });
                return response.data;
            } catch (error:any) {
                if (error instanceof HttpError) {
                    console.error('API error:', error.response.data);
                } else {
                    console.error('Unexpected error:', error);
                    if (error.response.status === 401){
                        window.sessionStorage.clear()
                        window.location.href = '/login';
                    }
                }
            }
        }

    }

    async login(endpoint: string, data: any): Promise<any> {
        try {
            const response = await this.apiClient.post(endpoint, data);
            return response.data;
        } catch (error:any) {
            if (error instanceof HttpError) {
                console.error('API error:', error.response.data);
            } else {
                console.error('Unexpected error:', error);
            }
        }
    }

    async post(endpoint: string, data: any): Promise<any> {
        const token = window.sessionStorage.getItem('token')
        const headers:any = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token,
        };
        if (token) {
            try {
                const response = await this.apiClient.post(endpoint, data, {headers});
                return response.data;
            } catch (error: any) {
                if (error instanceof HttpError) {
                    console.error('API error:', error.response.data);
                    return error.response.data
                } else {
                    console.error('Unexpected error:', error);
                    return error
                }
            }
        }
    }


    async get(endpoint: string): Promise<any> {

        const token = window.sessionStorage.getItem('token')
        const headers:any = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token,
        };
        if (token) {

            try {
                const response = await this.apiClient.get(endpoint, {headers});
                return response.data;
            } catch (error: any) {
                if (error instanceof HttpError) {
                    console.error('API error:', error.response.data);
                    return error
                } else {
                    console.error('Unexpected error:', error);
                    return error
                }
            }
        }
    }
}
