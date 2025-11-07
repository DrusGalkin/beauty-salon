import {api} from "./auth.jsx";
import axios from "axios";
import {REVIEWS_URL} from "../features/env-loader.jsx";

const BASE_URL = REVIEWS_URL

export const GetAllServiceReviews = async (id) => {
    try{
        const res = await axios.get(BASE_URL+id);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export const GetCountServiceReviews = async (id) => {
    try{
        const res = await axios.get(BASE_URL+"count/"+id);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export const GetRatingService = async (id) => {
    try{
        const res = await axios.get(BASE_URL+"rating/"+id);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export const CreatReviews = async (serID, rating, content) => {
    try{
        await api.post(BASE_URL, {
            service_id: +serID,
            content: content,
            rating: rating,
        })
    }catch(err){
        console.log(err);
    }
}

export const DeleteReviews = async (id) => {
    try{
        const res = await api.delete(BASE_URL+id);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}