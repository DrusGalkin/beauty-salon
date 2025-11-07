import axios from "axios";
import {api} from "./auth.jsx";
import {SERVICES_URL} from "../features/env-loader.jsx";

const BASE_URL = SERVICES_URL

export const FindAllServices = async () => {
    try {
        const res = await axios.get(`${BASE_URL}/`)
        return res.data
    } catch (error) {
        console.log("Ошибка поиска сервисов", error)
    }
}

export const FindServicesByID = async (id) => {
    try {
        const res = await axios.get(`${BASE_URL}/${id}`)
        return res.data
    } catch (error) {
        console.log("Ошибка поиска сервисов", error)
    }
}


export const CreateService = async (data) => {
    try {
        const res = await api.post(`${BASE_URL}/`, {
            title: data.title,
            description: data.description,
            price: +data.price,
            category_id: data.category_id,
        })
        return res.data
    } catch (error) {
        console.log("Ошибка создания сервиса", error)
    }
}

export const DeleteService = async (id) => {
    try {
        const res = await api.delete(`${BASE_URL}/${id}`)
        return res.data
    } catch (error) {
        console.log("Ошибка удаления сервиса", error)
    }
}

export const UpdateService = async (id, data) => {
    try {
        const res = await api.patch(`${BASE_URL}/${id}`, {
            title: data.title,
            description: data.description,
            price: +data.price,
            category_id: data.category_id,
        })
        return res.data
    } catch (error) {
        console.log("Ошибка создания сервиса", error)
    }
}