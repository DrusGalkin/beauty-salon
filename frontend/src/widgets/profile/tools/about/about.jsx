import {useEffect, useState} from "react";
import {EditAbout, GetAbout} from "../../../../api/other.jsx";
import Loader from "../../../../features/loader.jsx";

export default function About(){
    const [totalAbout, setTotalAbout] = useState(null)
    const [editData, setEditData] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setAbout()
    }, [])

    const setAbout = async () => {
        try {
            setLoading(true)
            const res = await GetAbout()
            console.log(res)
            setTotalAbout(res.data)
            setEditData(res.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const editAbout = async(e) => {
        e.preventDefault()
        await EditAbout(totalAbout.id, editData)
        await setAbout()
    }

    if (loading) return <Loader/>
    else return (
        <div className=" bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className=" mx-auto">
                <div className='flex mb-3 items-center w-full justify-between'>
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Раздел "О нас"</h1>
                        <p className="mt-2 text-gray-600">Управление контентом страницы "О нас"</p>
                    </div>

                    <div className="bg-white w-[200px] rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="bg-green-100 p-3 rounded-lg">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Символов</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {
                                        totalAbout.descriptions !== null || totalAbout.descriptions !== undefined
                                        ?
                                            totalAbout.descriptions?.length || 0
                                        : "Описание не установленно"
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                </div>


                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">Текущий контент</h2>
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                Активная версия
                            </span>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Заголовок
                                </label>
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        {totalAbout.title || "Заголовок не установлен"}
                                    </h3>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Описание
                                </label>
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 min-h-[120px]">
                                    <p className="text-gray-700 break-words whitespace-pre-wrap">
                                        {totalAbout.descriptions || "Описание не добавлено"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">Редактировать</h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Внесите изменения в раздел "О нас"
                            </p>
                        </div>

                        <form onSubmit={editAbout} className="space-y-6">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                    Заголовок
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    defaultValue={totalAbout.title}
                                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="Введите заголовок"
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                    Описание
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={6}
                                    defaultValue={totalAbout.descriptions}
                                    onChange={(e) => setEditData({ ...editData, descriptions: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
                                    placeholder="Введите описание компании"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                                >
                                    Сохранить изменения
                                </button>
                                <a
                                    href='/about'
                                    className="flex-1 text-center cursor-pointer  bg-white text-gray-700 py-2.5 px-4 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                                >
                                    Предпросмотр
                                </a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}