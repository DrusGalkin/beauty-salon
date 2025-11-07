import { useEffect, useState } from "react";
import ServiceCart from "./service-cart.jsx";
import { CreateService, FindAllServices, UpdateService } from "../../../../api/services.jsx";
import { GetPhotos, PHOTO_URL, UploadPhoto } from "../../../../api/photos.jsx";
import CategoryForm from "./category/category-form.jsx";
import Loader from "../../../../features/loader.jsx";

export default function Services() {
    const [toSet, setToSet] = useState(false);
    const [existingImagePreviews, setExistingImagePreviews] = useState([]); // Существующие изображения
    const [newImagePreviews, setNewImagePreviews] = useState([]); // Новые изображения
    const [services, setServices] = useState(null);
    const [editService, setEditService] = useState(null);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        category_id: "",
        images: [],
    });

    useEffect(() => {
        loadServices();
    }, []);

    const loadServices = async () => {
        try {
            const res = await FindAllServices();
            setServices(res);
        } catch (err) {
            console.error("Ошибка загрузки услуг:", err);
            setServices([]);
        }
    };

    const handleEditService = async (service) => {
        setEditService(service);

        const photos = await GetServicePhotos(service.id);


        setExistingImagePreviews(photos.map(photo => ({
            url: `${PHOTO_URL}/${photo.url}`,
            id: photo.id
        })));

        setNewImagePreviews([]);

        setFormData({
            title: service.title || "",
            description: service.description || "",
            price: service.price || "",
            category_id: service.category_id || "",
            images: [],
        });
    };

    const GetServicePhotos = async (id) => {
        try {
            return await GetPhotos(id);
        } catch (error) {
            console.log("Ошибка получения фотографий сервиса", error);
            return [];
        }
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const currentCount = existingImagePreviews.length + newImagePreviews.length;
        const remaining = 5 - currentCount;

        if (files.length > remaining) {
            alert(`Можно загрузить максимум 5 изображений. Осталось мест: ${remaining}`);
            return;
        }

        const newImages = [...formData.images, ...files.slice(0, remaining)];
        setFormData({ ...formData, images: newImages });

        const newPreviews = [];
        files.slice(0, remaining).forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                newPreviews.push({
                    url: reader.result,
                    file: file // сохраняем файл для связи с formData.images
                });
                if (newPreviews.length === files.slice(0, remaining).length) {
                    setNewImagePreviews((prev) => [...prev, ...newPreviews]);
                }
            };
            reader.readAsDataURL(file);
        });

        e.target.value = "";
    };

    const removeImage = (index) => {
        if (index < existingImagePreviews.length) {
            const newExistingPreviews = [...existingImagePreviews];
            newExistingPreviews.splice(index, 1);
            setExistingImagePreviews(newExistingPreviews);
        } else {
            const newImageIndex = index - existingImagePreviews.length;
            const newImages = [...formData.images];
            const newPreviews = [...newImagePreviews];

            newImages.splice(newImageIndex, 1);
            newPreviews.splice(newImageIndex, 1);

            setFormData({ ...formData, images: newImages });
            setNewImagePreviews(newPreviews);
        }

        if (errors.images) {
            setErrors((prev) => ({ ...prev, images: "" }));
        }
    };

    const handleAddMoreClick = () => {
        document.getElementById("imageInput").click();
    };

    const clearError = (field) => {
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = "Название обязательно";
        } else if (formData.title.trim().length < 3) {
            newErrors.title = "Название должно содержать минимум 3 символа";
        }

        if (!formData.description.trim()) {
            newErrors.description = "Описание обязательно";
        } else if (formData.description.trim().length < 10) {
            newErrors.description = "Описание должно быть не короче 10 символов";
        }

        if (!formData.category_id) {
            newErrors.category_id = "Выберите категорию";
        }

        if (!formData.price) {
            newErrors.price = "Укажите цену";
        } else {
            const priceNum = Number(formData.price);
            if (isNaN(priceNum) || priceNum <= 0) {
                newErrors.price = "Цена должна быть положительным числом";
            }
        }

        const totalImages = existingImagePreviews.length + formData.images.length;
        if (totalImages === 0) {
            newErrors.images = "Загрузите хотя бы одно изображение";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});

        try {
            if (editService) {
                await UpdateService(editService.id, formData);

                for (let i = 0; i < formData.images.length; i++) {
                    await UploadPhoto(editService.id, i, formData.images[i]);
                }

                setEditService(null);
            } else {
                const res = await CreateService(formData);
                for (let i = 0; i < formData.images.length; i++) {
                    await UploadPhoto(res.id, i, formData.images[i]);
                }
            }

            setFormData({
                title: "",
                description: "",
                price: "",
                category_id: "",
                images: [],
            });
            setExistingImagePreviews([]);
            setNewImagePreviews([]);
            await loadServices();
        } catch (err) {
            console.error("Ошибка при сохранении:", err);
            setErrors({ submit: "Не удалось сохранить услугу. Попробуйте позже." });
        }
    };

    const cancelEdit = () => {
        setEditService(null);
        setFormData({
            title: "",
            description: "",
            price: "",
            category_id: "",
            images: [],
        });
        setExistingImagePreviews([]);
        setNewImagePreviews([]);
    };

    useEffect(() => {
        if (toSet) {
            setServices(null);
            loadServices();
            setToSet(false);
        }
    }, [toSet]);

    const allImagePreviews = [...existingImagePreviews, ...newImagePreviews];

    return (
        <div className="flex w-full mt-6 justify-between gap-4">
            <div className="flex flex-col w-full p-3 gap-2 max-w-[800px]">
                {services === null ? (
                    <Loader />
                ) : services.length === 0 ? (
                    <p className="text-gray-500 text-center py-6">Нет услуг</p>
                ) : (
                    services.map((item) => (
                        <ServiceCart
                            key={item.id}
                            id={item.id}
                            title={item.title}
                            category_id={item.category_id}
                            description={item.description}
                            price={item.price}
                            state="admin"
                            toSet={setToSet}
                            toEdit={handleEditService}
                        />
                    ))
                )}
            </div>

            <div className="relative">
                <form
                    className="flex flex-col space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg relative"
                    onSubmit={handleSubmit}
                >
                    {editService && (
                        <div className='flex flex-row-reverse -top-2 w-full -left-2 absolute justify-between'>
                            <svg
                                onClick={cancelEdit}
                                className="w-7 right-2 mt-2 bg-gray-400 cursor-pointer rounded-full h-7 p-[4px] text-white hover:scale-110 transition"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M19 5L5 19M5 5L19 19"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                    )}

                    <div className="text-center mb-2">
                        <h2 className="text-2xl font-bold mb-3 text-gray-800">
                            {editService ? "Изменить услугу" : "Создание услуги"}
                        </h2>
                        {!editService && (
                            <p className="text-gray-600 mt-2">Заполните информацию о новой услуге</p>
                        )}
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium text-gray-700">Название услуги *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => {
                                clearError("title");
                                setFormData({ ...formData, title: e.target.value });
                            }}
                            className={`px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                                errors.title ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="Введите название услуги"
                            required
                        />
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium text-gray-700">Описание *</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => {
                                clearError("description");
                                setFormData({ ...formData, description: e.target.value });
                            }}
                            className={`px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all ${
                                errors.description ? "border-red-500" : "border-gray-300"
                            }`}
                            rows="5"
                            placeholder="Опишите подробности услуги..."
                            required
                        />
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                    </div>

                    <div>
                        <CategoryForm
                            serviceData={formData}
                            setServiceData={setFormData}
                            Edit={null}
                            setEdit={null}
                        />
                        {errors.category_id && (
                            <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>
                        )}
                    </div>

                    <div className="flex flex-col space-y-4">
                        <label className="text-sm font-medium text-gray-700">
                            Изображения услуги {allImagePreviews.length > 0 && `(${allImagePreviews.length}/5)`}
                        </label>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {allImagePreviews.map((preview, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={preview.url}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-24 object-cover rounded-lg border border-gray-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                    >
                                        ×
                                    </button>
                                    {index >= existingImagePreviews.length && (
                                        <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                                            новое
                                        </div>
                                    )}
                                </div>
                            ))}

                            {allImagePreviews.length < 5 && (
                                <div
                                    className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors h-24"
                                    onClick={handleAddMoreClick}
                                >
                                    <svg
                                        className="w-8 h-8 text-gray-400 mb-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                        />
                                    </svg>
                                    <span className="text-xs text-gray-500 text-center">
                                        Добавить ({5 - allImagePreviews.length} осталось)
                                    </span>
                                </div>
                            )}
                        </div>

                        <input
                            type="file"
                            id="imageInput"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleImageUpload}
                        />

                        <div className="text-xs text-gray-500">
                            <p>• Можно загрузить до 5 изображений</p>
                            <p>• Поддерживаются форматы: JPG, PNG</p>
                            {editService && (
                                <p>• Синяя метка "новое" показывает только что загруженные изображения</p>
                            )}
                        </div>

                        {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium text-gray-700">Цена *</label>
                        <input
                            type="text"
                            value={formData.price}
                            onChange={(e) => {
                                clearError("price");
                                setFormData({ ...formData, price: e.target.value });
                            }}
                            className={`px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                                errors.price ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="Цена услуги"
                            required
                        />
                        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                    </div>

                    {errors.submit && (
                        <div className="text-red-500 text-center text-sm bg-red-50 p-2 rounded-lg">
                            {errors.submit}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        {editService ? "Сохранить изменения" : "Создать услугу"}
                    </button>
                </form>
            </div>
        </div>
    );
}