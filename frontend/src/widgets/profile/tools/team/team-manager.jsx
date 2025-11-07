import {useEffect, useState} from "react";
import {GetAllTeammates, CreateTeammate, EditTeammate, DeleteTeammate} from "../../../../api/other.jsx";
import {PHOTO_URL, UploadPhoto, UploadTeammatePhoto} from "../../../../api/photos.jsx";
import Loader from "../../../../features/loader.jsx";
import SpecialistCardSlim from "../../../specialists/specialist-cart-slim.jsx";
import {IsAdmin} from "../../../../api/auth.jsx";

export function TeamManager() {
    const [imagePreview, setImagePreview] = useState(null)
    const [team, setTeam] = useState([])
    const [editTeammate, setEditTeammate] = useState(null)
    const [isAdmin, setIsAdmin] = useState(false);

    const [teammateData, setTeammateData] = useState({
        full_name: "",
        tag: "",
        image: null,
        photo_id: 0,
    })

    useEffect(() => {
        loadTeam()
    }, [])

    const loadTeam = async () => {
        try {
            const res = await GetAllTeammates()
            setTeam(res || [])
        } catch (error) {
            console.error('Error loading team:', error)
            setTeam([])
        }
    }

    const handleEditTeammate = (teammate) => {
        setEditTeammate(teammate)
        setTeammateData({
            full_name: teammate.full_name,
            tag: teammate.tag,
            image: null,
            photo_id: teammate.photo_id,
        })
        setImagePreview(teammate.url ? `${PHOTO_URL}/${teammate.url}` : null)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (editTeammate) {
            await UpdateTeammateAndSet(e)
        } else {
            let id = 0
            if (teammateData.image) {
                id = await UploadTeammatePhoto(teammateData.image)
            }

            await CreateTeammate(teammateData, id)

            setTeammateData({
                full_name: "",
                tag: "",
                image: null,
                photo_id: 0,
            })
            setImagePreview(null)
        }

        await loadTeam()
    }

    const handleImageUpload = (e) => {
        const file = e.target.files[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (e) => {
            setImagePreview(e.target.result)
        }
        reader.readAsDataURL(file)

        if (editTeammate) {
            setEditTeammate({...editTeammate, image: file})
        } else {
            setTeammateData({...teammateData, image: file})
        }

        e.target.value = ''
    }

    const removeImage = () => {
        if (editTeammate) {
            setEditTeammate({
                ...editTeammate,
                image: null,
                url: null,
                photo_id: 0
            })
        } else {
            setTeammateData({
                ...teammateData,
                image: null,
                photo_id: 0
            })
        }
        setImagePreview(null)
    }

    const UpdateTeammateAndSet = async (e) => {
        e.preventDefault()
        try {
            let photoId = editTeammate.photo_id

            if (editTeammate.image) {
                photoId = await UploadTeammatePhoto(editTeammate.image)
            }

            console.log(editTeammate)
            await EditTeammate(editTeammate.id, {
                ...editTeammate,
                photo_id: photoId
            })

            setEditTeammate(null)
            setImagePreview(null)
            setTeammateData({
                full_name: "",
                tag: "",
                image: null,
                photo_id: 0,
            })
        } catch (error) {
            console.error('Error updating teammate:', error)
        }
    }

    const handleAddImageClick = () => {
        document.getElementById('imageInput').click()
    }

    const cancelEdit = () => {
        setEditTeammate(null)
        setImagePreview(null)
        setTeammateData({
            full_name: "",
            tag: "",
            image: null,
            photo_id: 0,
        })
    }

    const getImageSource = () => {
        if (imagePreview) {
            return imagePreview;
        }
        if (editTeammate && editTeammate.url) {
            return `${PHOTO_URL}/${editTeammate.url}`;
        }
        return null;
    }

    const GetAndSetIsAdmin = async () => {
        const res = await IsAdmin()
        setIsAdmin(res.admin)
    }

    useEffect(() => {
        GetAndSetIsAdmin()
    })

    const imageSource = getImageSource();

    return (
        <div className='flex flex-col lg:flex-row w-full mt-4 sm:mt-6 p-2 sm:p-4 gap-4 sm:gap-6 lg:gap-8'>
            {/* Левый блок с сотрудниками - АДАПТИВНЫЙ */}
            <div className='w-full lg:max-w-[800px]'>
                <div className='grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 p-2 sm:p-3'>
                    {
                        team.length === 0 ? (
                            <div className="col-span-full flex justify-center py-8 sm:py-12">
                                <Loader/>
                            </div>
                        ) : (
                            team.map((teammate, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleEditTeammate(teammate)}
                                    className="cursor-pointer transition-transform duration-200 hover:scale-[1.02] active:scale-95"
                                >
                                    <SpecialistCardSlim
                                        image={`${PHOTO_URL}/${teammate.url}`}
                                        full_name={teammate.full_name}
                                        tag={teammate.tag}
                                    />
                                </div>
                            ))
                        )
                    }
                </div>

                {/* Сообщение если нет сотрудников */}
                {team.length === 0 && !team.length && (
                    <div className="col-span-full text-center py-8 sm:py-12">
                        <p className="text-gray-500 text-lg">Нет сотрудников</p>
                        <p className="text-gray-400 text-sm mt-2">Добавьте первого сотрудника используя форму справа</p>
                    </div>
                )}
            </div>

            {/* Правый блок с формой */}
            <div className="w-full lg:flex-1">
                <div className="sticky top-4">
                    <form className="flex flex-col space-y-4 sm:space-y-6 w-full mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-lg border border-gray-100"
                          onSubmit={handleSubmit}>

                        {editTeammate && (
                            <div className='flex flex-row-reverse -top-3 sm:-top-2 w-full -left-2 absolute justify-between'>
                                <svg
                                    onClick={cancelEdit}
                                    className="w-6 h-6 sm:w-7 sm:h-7 right-2 mt-2 bg-gray-400 cursor-pointer rounded-full p-1 text-white hover:scale-110 transition"
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
                            <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-gray-800">
                                {editTeammate ? "Редактирование сотрудника" : "Добавление сотрудника"}
                            </h2>

                            {!editTeammate && (
                                <p className="text-gray-600 text-sm sm:text-base mt-1 sm:mt-2">
                                    Заполните информацию о новом сотруднике
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col space-y-2">
                            <label className="text-sm font-medium text-gray-700">ФИО сотрудника *</label>
                            <input
                                type="text"
                                value={editTeammate ? editTeammate.full_name : teammateData.full_name}
                                onChange={e => {
                                    if (editTeammate) {
                                        setEditTeammate({...editTeammate, full_name: e.target.value})
                                    } else {
                                        setTeammateData({...teammateData, full_name: e.target.value})
                                    }
                                }}
                                className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none text-sm sm:text-base"
                                placeholder="Введите ФИО сотрудника"
                                required
                            />
                        </div>

                        <div className="flex flex-col space-y-2">
                            <label className="text-sm font-medium text-gray-700">Должность *</label>
                            <textarea
                                value={editTeammate ? editTeammate.tag : teammateData.tag}
                                onChange={e => {
                                    if (editTeammate) {
                                        setEditTeammate({...editTeammate, tag: e.target.value})
                                    } else {
                                        setTeammateData({...teammateData, tag: e.target.value})
                                    }
                                }}
                                className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none resize-none text-sm sm:text-base"
                                rows="3"
                                placeholder="Опишите должность и обязанности..."
                                required
                            />
                        </div>

                        {editTeammate && (
                            <button
                                type="button"
                                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 sm:py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-sm sm:text-base"
                                onClick={async () => {
                                    if (confirm('Вы уверены, что хотите удалить этого сотрудника?')) {
                                        await DeleteTeammate(editTeammate.id)
                                        await loadTeam()
                                    }
                                }}
                            >
                                Удалить сотрудника
                            </button>
                        )}

                        <div className="flex flex-col space-y-3 sm:space-y-4">
                            <label className="text-sm font-medium text-gray-700">
                                Фотография сотрудника {(teammateData.image || editTeammate?.image) && "(загружено)"}
                            </label>

                            <div className="grid grid-cols-1 gap-3 sm:gap-4">
                                {imageSource ? (
                                    <div className="relative group flex justify-center">
                                        <img
                                            src={imageSource}
                                            alt="Preview"
                                            className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg border border-gray-300"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs sm:text-sm"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors h-24 sm:h-32"
                                        onClick={handleAddImageClick}
                                    >
                                        <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mb-1" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                                        </svg>
                                        <span className="text-xs text-gray-500 text-center px-2">
                                            Добавить фотографию
                                        </span>
                                    </div>
                                )}
                            </div>

                            <input
                                type="file"
                                id="imageInput"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                            />

                            <div className="text-xs text-gray-500 space-y-1">
                                <p>• Можно загрузить 1 фотографию</p>
                                <p>• Поддерживаются форматы: JPG, PNG</p>
                                <p>• Рекомендуемый размер: 1:1</p>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 sm:py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm sm:text-base"
                        >
                            <span className="flex items-center justify-center">
                                {editTeammate ? (
                                    "Сохранить изменения"
                                ) : (
                                    <>
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                                        </svg>
                                        Добавить сотрудника
                                    </>
                                )}
                            </span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}