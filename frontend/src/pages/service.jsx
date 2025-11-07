import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import Loader from "../features/loader.jsx";
import {FindServicesByID} from "../api/services.jsx";
import {FindCategoriesByID} from "../api/catrgorys.jsx";
import {GetPhotos, PHOTO_URL} from "../api/photos.jsx";
import ReviewsForm from "../widgets/reviews/reviews-form.jsx";
import {GetCountServiceReviews, GetRatingService} from "../api/reviews.jsx";
import StatementModal from "../widgets/modals/statement.jsx";

export default function Service() {
    const [service, setService] = useState({});
    const [images, setImages] = useState([]);
    const [photoIndex, setPhotoIndex] = useState(0);
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState(null);
    const [count, setCount] = useState(null);
    const [rating, setRating] = useState(0);
    const {id} = useParams();
    const [reload, setReload] = useState(false);

    const GetAndSetCount = async () => {
        const res = await GetCountServiceReviews(id)
        setCount(res);
    }

    const GetAndSetRating = async () => {
        const res = await GetRatingService(id)
        setRating(res.rating)
    }

    const GetServiceAndSet = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await FindServicesByID(id);
            setService(res);
            return res;
        } catch (error) {
            console.log("Ошибка получения сервиса по id", error);
            setError("Не удалось загрузить информацию об услуге");
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const GetPhotosAndSet = async () => {
        try {
            const res = await GetPhotos(id);
            setImages(res);
            console.log(res);
        }catch (error) {
            console.log("Ошибка получения сервиса по id", error);
            setError("Не удалось загрузить информацию об услуге");
            throw error;
        }
    }

    const GetCategoryAndSet = async (categoryId) => {
        if (!categoryId) return;
        try {
            const res = await FindCategoriesByID(categoryId);
            setCategory(res);
        } catch (error) {
            console.log("Ошибка фотографий", error);
        }
    }

    const LoadService = async () => {
        try {
            const serviceData = await GetServiceAndSet();

            if (serviceData.category_id) {
                await GetCategoryAndSet(serviceData.category_id);
            }
            await GetPhotosAndSet()
            await GetAndSetCount()
            await GetAndSetRating()
        } catch (error) {

        }
    }

    useEffect(() => {
        LoadService();
    }, [id]);

    useEffect(() => {
        if(reload) {
            LoadService();
            setReload(false)
        }
    },[reload])

    if (loading) return <Loader/>;

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-xl mb-4">{error}</div>
                    <button
                        onClick={LoadService}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
                    >
                        Попробовать снова
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <nav className="mb-8">
                    <ol className="flex items-center space-x-2 text-sm text-gray-500">
                        <li
                            className="cursor-pointer transition hover:scale-101"
                            onClick={() => window.location.href = "/"}>
                            Главная
                        </li>
                        <li>/</li>
                        <li
                            className="cursor-pointer transition hover:scale-101"
                            onClick={() => window.location.href = "/services"}>
                            Услуги
                        </li>
                        <li>/</li>
                        <li className="cursor-pointer font-bold transition hover:scale-101">{service.title}</li>
                    </ol>
                </nav>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                        <div className="space-y-4">
                            {images && images.length > 0 && images[photoIndex] ? (
                                <div className='relative w-full items-center flex justify-center h-[600px]'>
                                    <img
                                        className="w-full h-[600px] absolute object-cover rounded-2xl shadow-md"
                                        src={`${PHOTO_URL}/${images[photoIndex].url}`}
                                        alt={service.title}
                                    />

                                    <div className="flex w-full p-3  justify-between">
                                        <button
                                            onClick={() => setPhotoIndex(prev => Math.max(0, prev - 1))}
                                            disabled={photoIndex === 0}
                                            className="bg-gray-200 z-50 hover:bg-gray-300 p-2 rounded-full disabled:opacity-50"
                                        >
                                            <svg width="20px" height="20px" viewBox="0 0 1024 1024" className="icon"
                                                 version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"
                                                 stroke="#000000">
                                                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                                <g id="SVGRepo_tracerCarrier" stroke-linecap="round"
                                                   stroke-linejoin="round" stroke="#CCCCCC" stroke-width="12.288"></g>
                                                <g id="SVGRepo_iconCarrier">
                                                    <path
                                                        d="M768 903.232l-50.432 56.768L256 512l461.568-448 50.432 56.768L364.928 512z"
                                                        fill="#000000"></path>
                                                </g>
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => setPhotoIndex(prev => Math.min(images.length - 1, prev + 1))}
                                            disabled={photoIndex === images.length - 1}
                                            className="cursor-pointer bg-gray-200 rotate-180 z-50 hover:bg-gray-300 p-2 rounded-full disabled:opacity-50"
                                        >
                                            <svg width="20px" cursor-pointer height="20px" viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000" stroke="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="12.288"></g><g id="SVGRepo_iconCarrier"><path d="M768 903.232l-50.432 56.768L256 512l461.568-448 50.432 56.768L364.928 512z" fill="#000000"></path></g></svg>
                                        </button>
                                    </div>
                                </div>
                            ) : images && images.length === 0 ? (
                                <div className="w-full  h-[600px] flex items-center justify-center bg-gray-100 rounded-2xl">
                                    <p className="text-gray-500">Нет изображений</p>
                                </div>
                            ) : (
                                <Loader/>
                            )
                            }
                        </div>

                        <div className="flex h-full flex-col space-y-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    {service.title}
                                </h1>
                                <div className="flex items-center space-x-4 mb-4">
                                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                        {category?.title || "Загрузка..."}
                                    </span>
                                    <div className="flex items-center text-yellow-400">
                                        <div>
                                            {rating.toFixed(1)}  { rating !== null && ('★'.repeat(Math.floor(rating) || 5))}
                                        </div>

                                        {
                                            count > 0 && (
                                                <span className="text-gray-500 ml-2">
                                                    ({count} отзывов)
                                                </span>
                                            )
                                        }

                                    </div>
                                </div>
                            </div>

                            <div className='flex grow flex-col flex-1'>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Описание услуги</h2>
                                <div className="prose max-w-none text-gray-700">
                                    <p className="text-lg break-words leading-relaxed">
                                        {service.description || "Подробное описание услуги будет здесь..."}
                                    </p>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-6 mt-auto">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <span className="text-2xl font-bold text-gray-900">
                                                от {service.price} ₽
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={()=>setOpen(!open)}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold text-lg transition duration-200">
                                        Заказать услугу
                                    </button>
                                    <p className="text-center text-gray-500 text-sm mt-2">
                                        Обычно отвечаем в течение 15 минут
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 p-8">
                        <div className="space-y-6">
                         <ReviewsForm setReload={setReload} id={id}/>
                        </div>
                    </div>
                </div>
            </div>

            {
                open && (
                    <StatementModal title={service.title} setOpen={setOpen}/>
                )
            }

        </div>
    );
}