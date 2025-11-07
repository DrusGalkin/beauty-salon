import {useEffect, useState} from "react";
import {Slide} from "react-awesome-reveal";
import Loader from "../../features/loader.jsx";
import {GetTwoGalleryPhotos, PHOTO_URL} from "../../api/photos.jsx";

export default function GalleryBlock() {
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const GetAndSetPhotos = async () => {
            try {
                setLoading(true);
                const res = await GetTwoGalleryPhotos();
                setPhotos(res || []);
            } catch (err) {
                console.log(err);
                setPhotos([]);
            } finally {
                setLoading(false);
            }
        }
        GetAndSetPhotos();
    }, []);

    if (loading) return <Loader />;

    return (
        <div  className="w-full">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">

                <div className=" mb-8">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        Наша галерея
                    </h1>
                    <p className="text-gray-600 text-lg sm:text-xl max-w-2xl ">
                        Лучшие моменты нашей работы
                    </p>
                </div>

                {photos.length > 0 && (
                    <div className={`
                        flex justify-center mb-8 sm:mb-12 lg:mb-16
                        ${windowWidth < 1024 ? 'flex-col items-center gap-6' : 'flex-row gap-6 lg:gap-8'}
                    `}>

                        <div className={`
                            ${windowWidth < 1024 ? 'w-full max-w-2xl' : 'w-2/3'}
                        `}>
                            <img
                                className="w-full h-64 sm:h-80 lg:h-96 xl:h-[500px] object-cover rounded-2xl shadow-lg"
                                src={`${PHOTO_URL}/${photos[0]?.url}`}
                                alt="Галерея изображение 1"
                                loading="lazy"
                            />
                        </div>

                        {photos[1] && (
                            <div className={`
                                ${windowWidth < 1024 ? 'w-full max-w-2xl' : 'w-1/3'}
                            `}>
                                <img
                                    className="w-full h-64 sm:h-80 lg:h-96 xl:h-[500px] object-cover rounded-2xl shadow-lg"
                                    src={`${PHOTO_URL}/${photos[1]?.url}`}
                                    alt="Галерея изображение 2"
                                    loading="lazy"
                                />
                            </div>
                        )}
                    </div>
                )}

                <div className="">
                    <button
                        className="
                            inline-flex items-center justify-center
                            bg-gray-900 hover:bg-[#2654DC]
                            text-white
                            font-semibold
                            py-4 px-8 sm:px-12
                            rounded-xl
                            text-lg sm:text-xl
                            transition-all
                            duration-300
                            transform
                            hover:scale-105
                            active:scale-95
                            shadow-lg
                            hover:shadow-xl
                            min-w-[250px]
                            w-full sm:w-auto
                            max-w-sm
                        "
                        onClick={() => window.location.href = "/gallery"}
                    >
                        Показать все фото
                    </button>
                </div>
            </div>
        </div>
    );
}