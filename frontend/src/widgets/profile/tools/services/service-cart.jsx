import { DeleteService } from "../../../../api/services.jsx";
import { useEffect, useState } from "react";
import { GetPhotos, PHOTO_URL } from "../../../../api/photos.jsx";
import Loader from "../../../../features/loader.jsx";

export default function ServiceCart({ id, title, description, category_id, price, state, toSet, toEdit }) {
    const [images, setImages] = useState([]);

    const GetPhotosAndSet = async () => {
        try {
            const res = await GetPhotos(id);
            setImages(res);
        } catch (error) {
            console.log("Ошибка получения сервиса по id", error);
        }
    };

    const DeleteServiceAndSet = async (id) => {
        await DeleteService(id);
        toSet(true);
    };

    useEffect(() => {
        GetPhotosAndSet(id);
    }, [id]);

    return (
        <div className="w-full flex flex-col md:flex-row rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
            {images && images.length > 0 ? (
                <img
                    className="rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none w-full md:max-w-[300px] h-48 md:h-auto object-cover transition-transform duration-300 hover:scale-105"
                    src={`${PHOTO_URL}/${images[0].url}`}
                    alt="фото"
                />
            ) : (
                <div className="w-full md:max-w-[300px] h-48 flex items-center justify-center">
                    <Loader />
                </div>
            )}

            <div className="flex flex-col grow p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800 break-words">{title}</h1>
                    {state === "admin" && (
                        <button
                            onClick={() => DeleteServiceAndSet(id)}
                            className="self-start cursor-pointer text-gray-500 hover:text-red-500 hover:scale-125 transition-transform"
                            aria-label="Удалить"
                        >
                            ✕
                        </button>
                    )}
                </div>

                <hr className="border-none bg-gradient-to-r from-blue-500 to-purple-500 h-[2px] mb-4 md:mb-6" />

                <div className="grow mb-4 md:mb-6 p-3 md:p-4 rounded-xl break-words bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200">
                    <p className="text-gray-700 leading-relaxed line-clamp-3">
                        {description}
                    </p>
                </div>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between pt-4 border-t border-gray-200 gap-3">
                    <div className="flex items-center gap-1 md:gap-2">
                        <span className="text-sm md:text-base text-gray-600 font-medium">Цена:</span>
                        <span className="text-base md:text-lg font-bold text-blue-600">от {price} ₽</span>
                    </div>

                    {state === "admin" ? (
                        <button
                            onClick={() => toEdit({ id, title, description, price, category_id })}
                            className="cursor-pointer bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2 md:py-3 px-4 md:px-6 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg active:scale-95"
                        >
                            Редактировать
                        </button>
                    ) : (
                        <a
                            href={`/services/${id}`}
                            className="cursor-pointer bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 md:py-3 px-4 md:px-6 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg active:scale-95 text-center"
                        >
                            Подробнее
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}