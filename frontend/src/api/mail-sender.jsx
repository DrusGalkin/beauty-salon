import axios from "axios";
import {MAIL_SENDER_URL} from "../features/env-loader.jsx";

const BASE_URL = MAIL_SENDER_URL

export const SendToEmail = async(data) => {
    try {
        const res = await axios.post(`${BASE_URL}/send`, {
            email: data.email,
            username: data.name,
        })
       return res
    } catch (err) {
        console.error("Ошибка отправки сообщения на почту",err)
    }
}

export const ConfirmCode = async(data) => {
    try {
        const res = await axios.post(`${BASE_URL}/confirm`, {
            email: data.email,
            code: data.code,
        })
        return res
    } catch (err) {
        console.error("Ошибка отправки сообщения на почту",err)
    }
}

export const SendStatement = async(data) => {
    try {
        const res = await axios.post(`${BASE_URL}/statement`, {
            name: data.name,
            phone_number: data.phone_number,
            description: data.description,
        })
        return res
    } catch (err) {
        console.error("Ошибка отправки сообщения на почту",err)
    }
}