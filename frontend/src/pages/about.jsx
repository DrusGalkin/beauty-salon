import {useEffect, useState} from "react";
import {GetAbout} from "../api/other.jsx";
import Loader from "../features/loader.jsx";

export default function About() {
    const [totalAbout, setTotalAbout] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setAbout()
    }, [])

    const setAbout = async () => {
        try {
            setLoading(true)
            const res = await GetAbout()
            setTotalAbout(res.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <Loader/>
    }


    return (
        <div className='min-h-screen py-8'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <nav className="mb-8">
                    <ol className="flex items-center space-x-2 text-sm text-gray-500">
                        <li
                            className="cursor-pointer transition hover:scale-101"
                            onClick={() => window.location.href = "/"}>
                            Главная
                        </li>
                        <li>/</li>
                        <li
                            className="cursor-pointer font-bold transition hover:scale-101"
                            onClick={() => window.location.href = "/about"}>
                            О нас
                        </li>
                    </ol>
                </nav>
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                            {totalAbout && (
                                <div className="space-y-6">

                                    <div className="relative">
                                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                                            {totalAbout.title}
                                        </h1>
                                        <div className="absolute w-full -bottom-2 left-0h-1 bg-blue-600 rounded-full"></div>
                                    </div>

                                    <div className="border-t border-gray-200 pt-6">
                                        <div className="w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6"></div>
                                    </div>

                                    <div className="prose prose-lg max-w-none">
                                        <p className="text-gray-700 break-words leading-relaxed text-lg">
                                            {totalAbout.descriptions}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-4 pt-4">
                                        <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
                                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                            <span className="text-blue-700 font-medium">Профессионализм</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full">
                                            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                            <span className="text-green-700 font-medium">Качество</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-full">
                                            <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                                            <span className="text-purple-700 font-medium">Опыт</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">Время работы</h2>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { day: "Понедельник - Воскресенье", time: "8:30 - 20:00", current: true },
                                    ].map((schedule, index) => (
                                        <div
                                            key={index}
                                            className={`flex justify-between items-center p-4 rounded-xl border-2 transition-all ${
                                                schedule.current
                                                    ? 'border-orange-200 bg-orange-50'
                                                    : 'border-gray-100 hover:border-orange-200 hover:bg-orange-50'
                                            }`}
                                        >
                                        <span className={`font-medium ${
                                            schedule.current ? 'text-orange-700' : 'text-gray-700'
                                        }`}>
                                            {schedule.day}
                                        </span>
                                            <span className={`font-semibold ${
                                                schedule.current ? 'text-orange-600' : 'text-gray-900'
                                            }`}>
                                            {schedule.time}
                                        </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl shadow-lg p-8 text-white">
                                <h3 className="text-xl font-bold mb-4">Нужна помощь?</h3>
                                <p className="text-blue-100 mb-4">
                                    Свяжитесь с нами в рабочее время, и мы с радостью ответим на все ваши вопросы.
                                </p>
                                <button className="w-full bg-white text-blue-600 font-semibold py-3 px-6 rounded-xl hover:bg-blue-50 transition-colors duration-200">
                                    Связаться с нами
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

