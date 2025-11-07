import axios from "axios";
import {api} from "./auth.jsx";
import {UploadTeammatePhoto} from "./photos.jsx";
import {OTHER_URL} from "../features/env-loader.jsx";

const BASE_URL = OTHER_URL

export const GetAbout = async () => {
    try {
        const res = await axios.get(`${BASE_URL}/about/`)
        return res
    } catch (error) {
        console.log(error)
    }
}

export const EditAbout = async(id, data) => {
    try {
        const res = await api.put(`${BASE_URL}/about/${id}`, {
            title: data.title,
            descriptions: data.descriptions,
        })
        return res.data
    } catch (error) {
        console.log(error)
    }
}

export const GetAllContacts = async () => {
    try{
        const res = await api.get(`${BASE_URL}/contacts/`)
        return res.data
    }catch (error) {
        console.error(error)
    }
}

export const EditContact = async(data) => {
    try{
        await api.put(`${BASE_URL}/contacts/`, {
            id: data.id,
            title: data.title,
            contacts: data.contacts,
        })
    }catch (error) {
        console.error(error)
    }
}

export const CreateContact = async(data) => {
    try{
         await api.post(`${BASE_URL}/contacts/`, {
            title: data.title,
            contacts: data.contacts,
        })
    }catch (error) {
        console.error(error)
    }
}


export const DeleteContact = async(id) => {
    try{
        await api.delete(`${BASE_URL}/contacts/${id}`)
    }catch (error) {
        console.error(error)
    }
}

export const GetAllTeammates = async () => {
    try{
        const res = await axios.get(`${BASE_URL}/teammates/`)
        return res.data
    } catch (error) {
        console.log(error)
    }
}

export const EditTeammate = async(id, data) => {
    try{
        const photo_id = await UploadTeammatePhoto(data.image)
        await api.put(`${BASE_URL}/teammates/${id}`, {
            full_name: data.full_name,
            tag: data.tag,
            photo_id: photo_id,
        })
    } catch (error) {
        console.log(error)
    }
}

export const CreateTeammate = async(data, id) => {
    try{
        await api.post(`${BASE_URL}/teammates/`, {
            full_name: data.full_name,
            tag: data.tag,
            photo_id: id,
        })
    } catch (error) {
        console.log(error)
    }
}

export const DeleteTeammate = async(id) => {
    try{
        await api.delete(`${BASE_URL}/teammates/${id}`)
    } catch (error) {
        console.log(error)
    }
}

