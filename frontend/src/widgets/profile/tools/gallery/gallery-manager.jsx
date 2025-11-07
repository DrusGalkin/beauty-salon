import React, { useState, useEffect } from 'react';
import {DeletePhotoFromGallery, GetGalleryPhotos, PHOTO_URL, UploadInGallery} from "../../../../api/photos.jsx";


export default function GalleryManager() {
    const [photos, setPhotos] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    useEffect(() => {
        loadPhotos();
    }, []);

    const loadPhotos = async () => {
        try {
            const data = await GetGalleryPhotos();
            setPhotos(data || []);
        } catch (error) {
            console.error('Ошибка загрузки фотографий:', error);
        }
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setUploadMessage('Пожалуйста, выберите файл изображения');
                setMessageType('error');
                return;
            }
            setSelectedFile(file);
            setUploadMessage('');
            setMessageType('');
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setUploadMessage('Пожалуйста, выберите файл');
            setMessageType('error');
            return;
        }

        setIsLoading(true);
        setUploadMessage('');

        try {
            const photoId = await UploadInGallery(selectedFile);
            if (photoId) {
                setUploadMessage('Фотография успешно загружена!');
                setMessageType('success');
                setSelectedFile(null);
                document.getElementById('file-input').value = '';
                await loadPhotos();
            }
        } catch (error) {
            setUploadMessage('Ошибка при загрузке фотографии');
            setMessageType('error');
            console.error('Upload error:', error);
        } finally {
            setIsLoading(false);
        }
        setSelectedFile(null)
        await loadPhotos()
    };

    const handleDelete = async (id) => {
        try {
            await DeletePhotoFromGallery(id);
            setUploadMessage('Фотография успешно удалена!');
            setMessageType('success');
            await loadPhotos()
        } catch (error) {
            console.error('Delete error:', error);
            setUploadMessage('Ошибка при удалении фотографии');
            setMessageType('error');
        }

    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className=" mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Управление галереей</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Добавляйте и удаляйте фотографии из галереи
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                Добавить фотографию
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label
                                        htmlFor="file-input"
                                        className="block w-full px-4 py-3 bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors duration-200 text-center"
                                    >
                                        <div className="flex flex-col items-center justify-center">
                                            <svg className="w-8 h-8 text-blue-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                            <span className="text-blue-600 font-medium">
                                                {selectedFile ? 'Файл выбран' : 'Выберите файл'}
                                            </span>
                                            <span className="text-sm text-gray-500 mt-1">
                                                PNG, JPG, JPEG до 10MB
                                            </span>
                                        </div>
                                    </label>
                                    <input
                                        id="file-input"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                </div>

                                {selectedFile && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                        <p className="text-sm text-green-800 font-medium">
                                            Выбран файл:
                                        </p>
                                        <p className="text-sm text-green-700 truncate">
                                            {selectedFile.name}
                                        </p>
                                        <p className="text-xs text-green-600">
                                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                )}

                                <button
                                    onClick={handleUpload}
                                    disabled={isLoading || !selectedFile}
                                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Загрузка...
                                        </div>
                                    ) : (
                                        'Загрузить фотографию'
                                    )}
                                </button>

                                {uploadMessage && (
                                    <div className={`p-3 rounded-lg ${
                                        messageType === 'success'
                                            ? 'bg-green-50 border border-green-200 text-green-800'
                                            : 'bg-red-50 border border-red-200 text-red-800'
                                    }`}>
                                        {uploadMessage}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Все фотографии
                                </h2>
                                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                                    {photos.length} фото
                                </span>
                            </div>

                            {photos.length === 0 ? (
                                <div className="text-center py-12">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">Нет фотографий</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Начните с загрузки первой фотографии.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {photos.map(photo => (
                                        <div className='relative flex justify-end'>
                                            <div
                                                onClick={() => handleDelete(photo.id)}
                                                className=" w-5 cursor-pointer hover:scale-125 transition-all h-5 absolute rounded-full z-50 text-center flex items-center justify-center ml-2 mt-2 text-white font-bold text-xl shadow-lg">
                                                ×
                                            </div>
                                            <img
                                                src={`${PHOTO_URL}/${photo.url}`}
                                                alt={`Gallery ${photo.id}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}