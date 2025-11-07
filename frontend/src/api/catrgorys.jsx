import axios from "axios";
import {api} from "./auth.jsx";
import {CATEGORIES_URL} from "../features/env-loader.jsx";

const BASE_URL = CATEGORIES_URL

export const FindAllCategories = async() => {
    try {
        const res = await axios.get(`${BASE_URL}/`)
        return res.data
    } catch (error) {
        console.log("Ошибка поиска сервисов", error)
    }
}

export const FindCategoriesByID = async(id) => {
    try {
        const res = await axios.get(`${BASE_URL}/${id}`)
        return res.data
    } catch (error) {
        console.log("Ошибка поиска сервисов", error)
    }
}

export const DeleteCategories = async(id) => {
    try {
        const res = await api.delete(`${BASE_URL}/${id}`)
        return res.data
    } catch (error) {
        console.log("Ошибка поиска сервисов", error)
    }
}

export const CreateCategory = async(data) => {
    try {
        const res = await api.post(`${BASE_URL}/`, {
            title: data
        })
        return res.data
    } catch (error) {
        console.log("Ошибка создания сервиса", error)
    }
}

export const UpdateCategories = async(id, title) => {
    try {
        const res = await api.patch(`${BASE_URL}/${id}`, {
            title: title
        })
        return res.data
    } catch (error) {
        console.log("Ошибка создания сервиса", error)
    }
}