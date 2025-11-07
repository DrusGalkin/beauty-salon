import {api} from "./auth.jsx";
import axios from "axios";
import {PHOTOS_URL} from "../features/env-loader.jsx";

export const PHOTO_URL = PHOTOS_URL

export const UploadPhoto = async (serID, index, data) => {
    try {
        const formData = new FormData();
        formData.append('file', data);

        await api.post(`${PHOTO_URL}/uploads/${serID}/${index}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    } catch (error){
        console.error("Ошибка загрузки изображения", error)
    }
}

export const GetPhotos = async (serID) => {
    try {
        const res = await axios.get(`${PHOTO_URL}/photos/${serID}`)
        return res.data;
    } catch (error){
        console.error("Ошибка получения изображений", error)
    }
}

export const UploadTeammatePhoto = async (img) => {
    try {
        const formData = new FormData();
        formData.append('file', img);

        const res = await api.post(`${PHOTO_URL}/teammates/uploads`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return res.data.id;
    } catch (error){
        console.error("Ошибка загрузки изображения", error)
    }
}

export const GetGalleryPhotos = async () => {
    try {
        const res = await axios.get(`${PHOTO_URL}/gallery`)
        return res.data;
    } catch (error){
        console.error("Ошибка получения изображений", error)
    }
}

export const GetTwoGalleryPhotos = async () => {
    try {
        const res = await axios.get(`${PHOTO_URL}/gallery/two`)
        return res.data;
    } catch (error){
        console.error("Ошибка получения изображений", error)
    }
}

export const UploadInGallery = async (img) => {
    try {
        const formData = new FormData();
        formData.append('file', img);

        const res = await api.post(`${PHOTO_URL}/gallery`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return res.data.id;
    } catch (error){
        console.error("Ошибка загрузки изображения", error)
    }
}


export const DeletePhotoFromGallery = async (id) => {
    try {
        const res = await api.delete(`${PHOTO_URL}/gallery/${id}`)
        return res.data;
    } catch (error){
        console.error("Ошибка получения изображений", error)
    }
}