import { useEffect, useState, useCallback } from "react";
import { GetGalleryPhotos, PHOTO_URL } from "../api/photos.jsx";
import Loader from "../features/loader.jsx";
import AuthForm from "../widgets/modals/auth-form.jsx";

export default function Gallery() {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(null); // URL выбранного фото

    useEffect(() => {
        loadPhotos();
    }, []);

    const loadPhotos = async () => {
        try {
            setLoading(true);
            const data = await GetGalleryPhotos();
            setPhotos(data || []);
        } catch (error) {
            console.error('Ошибка загрузки фотографий:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = useCallback((e) => {
        if (e.key === "Escape") {
            setSelectedPhoto(null);
        }
    }, []);

    useEffect(() => {
        if (selectedPhoto) {
            window.addEventListener("keydown", handleKeyDown);
            return () => window.removeEventListener("keydown", handleKeyDown);
        }
    }, [selectedPhoto, handleKeyDown]);

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="mb-8">
                    <ol className="flex items-center space-x-2 text-sm text-gray-500">
                        <li
                            className="cursor-pointer transition hover:scale-101"
                            onClick={() => (window.location.href = "/")}
                        >
                            Главная
                        </li>
                        <li>/</li>
                        <li className="font-bold">Галерея</li>
                    </ol>
                </nav>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {photos.length > 0 &&
                        photos.map((photo, index) => (
                            <div
                                key={index}
                                className="cursor-pointer overflow-hidden rounded-2xl aspect-square"
                                onClick={() => setSelectedPhoto(`${PHOTO_URL}/${photo.url}`)}
                            >
                                <img
                                    className="w-full h-full object-cover transition-transform hover:scale-105"
                                    src={`${PHOTO_URL}/${photo.url}`}
                                    alt=""
                                    loading="lazy"
                                />
                            </div>
                        ))}
                </div>
            </div>

            {selectedPhoto && (

                <div className="fixed flex p-[20px] justify-center  inset-0 z-9999">
                    <div onClick={() =>  setSelectedPhoto(null)} className="absolute  inset-0 bg-black/50"></div>

                    <div className="relative  max-w-[100%] max-h-[100%]">
                        <img
                            src={selectedPhoto}
                            alt="Просмотр"
                            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                            onClick={() =>  setSelectedPhoto(null)}
                        />
                    </div>
                </div>

            )}
        </div>
    );
}