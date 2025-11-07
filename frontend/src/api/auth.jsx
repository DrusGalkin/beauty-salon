import axios from 'axios';
import Cookies from 'js-cookie';
import {AUTH_URL} from "../features/env-loader.jsx";

const BASE_URL = AUTH_URL;

export const Register = async (data) => {
    try {
        await axios.post(`${BASE_URL}/register`, {
            name: data.name,
            email: data.email,
            password: data.password,
        });
    } catch (err) {
        console.log("Ошибка регистрации", err);
    }
}

export const Login = async (data) => {
    try {
        const res = await axios.post(`${BASE_URL}/login`, {
            email: data.email,
            password: data.password,
        });

        setTokens(res.data.access, res.data.refresh, res.data.expired_in);
        window.location.reload();
    } catch (err) {
        console.log("Ошибка входа", err);
    }
}

export const ValidToken = async () => {
    const res = await api.post(`${BASE_URL}/valid`, {
        token: getToken(),
    })
    return res.data;
}

export const UpdatePassword = async (data) => {
    try {
        const response = await api.patch(`${BASE_URL}/password`, {
            password: data.password,
        })
        return response.data
    } catch (error) {
        console.log("Ошибка изменения пароля", error)
        throw error
    }
}

export const UpdateEmail = async (data) => {
    console.log(data)
    try {
        const response = await api.patch(`${BASE_URL}/email`, {
            email: data.email,
            password: data.password,
        })
        return response.data
    } catch (error) {
        console.log("Ошибка изменения email", error)
        throw error
    }
}

export const Logout = async () => {
    try {
        await api.post(`${BASE_URL}/out`)
        clearTokens()
        window.location.href = "/"
    } catch (error) {
        console.log("Ошибка выхода из аккаунты", error);
    }
}

export const IsAdmin = async () => {
    try{
        let userInfo = await ValidToken()
        const res = await api.post(`${BASE_URL}/check/${userInfo.id}`,)
        return res.data;
    } catch (error) {
        console.error("Ошибка при проверке на админа", error);
    }
}

export const findUser = async(setUserData) => {
    let res = {}
    try {
        res = await ValidToken()
    } catch (error) {
        console.log("Ошибка авторизации пользователя", error)
    }

    try {
        let user = await api.get(`${BASE_URL}/${res.id}`)
        setUserData(user.data)
    } catch (error) {
        console.log("Ошибка поиска пользователя", error);
    }
}

export const getUserByID = async(id) => {
    try {
        let user = await api.get(`${BASE_URL}/${id}`)
        return user.data
    } catch (error) {
        console.log("Ошибка поиска пользователя", error);
    }
}

export const getUserByEmail = async(data) => {
    try {
        let user = await axios.post(`${BASE_URL}/email`, {
            email: data.email,
        })
        return user.data
    } catch (error) {
        console.log("Ошибка поиска пользователя", error);
    }
}


const api = axios.create({
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

const getToken = () => {
    return localStorage.getItem('access');
};

const getRefreshToken = () => {
    return Cookies.get('refresh');
};

const setTokens = (access, refresh, expires) => {
    localStorage.setItem('access', access);

    Cookies.set('refresh', refresh, {
        expires: expires,
        secure: 'production',
        sameSite: 'strict',
        path: '/'
    });
};

const clearTokens = () => {
    localStorage.removeItem('access');
    Cookies.remove('refresh', {path: '/'});
};

api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = getRefreshToken();
                if (refreshToken) {
                    const response = await api.post(`${BASE_URL}/refresh`, {
                        token: refreshToken
                    });

                    const {access, refresh, expired_in} = response.data;
                    setTokens(access, refresh, expired_in);

                    originalRequest.headers.Authorization = `Bearer ${access}`;
                    return api(originalRequest);
                }
            } catch (error) {
                await Logout()
                console.error(error);
            }
        }

        return Promise.reject(error);
    }
);

export {api, getToken, clearTokens, setTokens, getRefreshToken};