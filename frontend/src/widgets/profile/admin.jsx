import {getUserByEmail, Logout, UpdateEmail, UpdatePassword, ValidToken} from "../../api/auth.jsx";
import {Exit} from "./tools/tools.jsx";
import {useState} from "react";
import {adminNav} from "./tools/nav.jsx";
import Services from "./tools/services/services.jsx";
import About from "./tools/about/about.jsx";
import Contacts from "./tools/contacts/contacts.jsx";
import {TeamManager} from "./tools/team/team-manager.jsx";
import GalleryManager from "./tools/gallery/gallery-manager.jsx";
import {ConfirmCode, SendToEmail} from "../../api/mail-sender.jsx";

export default function AdminGUI() {
    const [state, setState] = useState("Услуги")
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    const [emailData, setEmailData] = useState({
        newEmail: '',
        password: ''
    })

    const [code, setCode] = useState("")
    const [emailSender, setEmailSender] = useState(false)
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        })
    }

    const handleEmailChange = (e) => {
        setEmailData({
            ...emailData,
            [e.target.name]: e.target.value
        })
    }

    const handlePasswordSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setMessage("")
        setLoading(true)

        if (!passwordData.currentPassword) {
            setError("Введите текущий пароль")
            setLoading(false)
            return
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError("Новые пароли не совпадают")
            setLoading(false)
            return
        }

        if (passwordData.newPassword.length < 6) {
            setError("Пароль должен содержать минимум 6 символов")
            setLoading(false)
            return
        }

        try {
            await UpdatePassword({
                password: passwordData.newPassword
            })

            setMessage("Пароль успешно изменен")
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            })
        } catch (err) {
            console.error("Ошибка при изменении пароля:", err)
            setError(err.response?.data?.error || "Ошибка при изменении пароля")
        } finally {
            setLoading(false)
        }
    }

    const handleEmailSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setMessage("")
        setLoading(true)

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(emailData.newEmail)) {
            setError("Введите корректный email адрес")
            setLoading(false)
            return
        }

        if (!emailData.password) {
            setError("Введите пароль для подтверждения")
            setLoading(false)
            return
        }

        try {
            const tokenInfo = await ValidToken()
            const emailInfo = await getUserByEmail({
                email: tokenInfo.email,
            })

            await SendToEmail({
                email: emailInfo.email,
                name: emailInfo.name,
            })

            setEmailSender(true)
        } catch (err) {
            console.error("Ошибка при изменении email:", err)
            setError(err.response?.data?.error || "Ошибка при изменении email попробуйте использовать другие данные")
        } finally {
            setLoading(false)
        }
    }

    const handleConfirmCode = async (e) => {
        e.preventDefault()
        setError("")
        setMessage("")
        setLoading(true)

        if (code.length !== 4) {
            setError("Введите 4-значный код")
            setLoading(false)
            return
        }

        try {
            const tokenInfo = await ValidToken()
            const currentEmailInfo = await getUserByEmail({
                email: tokenInfo.email,
            })

            console.log("currentEmailInfo:", currentEmailInfo.email)
            console.log("ccde", code)
            await ConfirmCode({
                email: currentEmailInfo.email,
                code: code,
            })

            await UpdateEmail({
                email: emailData.newEmail,
                password: emailData.password
            })

            setMessage("Email успешно изменен")
            setEmailData({
                newEmail: '',
                password: ''
            })
            setCode("")
            setEmailSender(false)
        } catch (err) {
            console.error("Ошибка при подтверждении кода:", err)
            if (err.response?.status === 408) {
                setError("Код истек")
            } else if (err.response?.status === 400) {
                setError("Неверный код")
            } else {
                setError(err.response?.data?.error || "Ошибка при подтверждении кода")
            }
        } finally {
            setLoading(false)
        }
    }

    const repeatCode = async () => {
        setError("")
        setMessage("")
        setLoading(true)

        try {
            const tokenInfo = await ValidToken()
            const emailInfo = await getUserByEmail({
                email: tokenInfo.email,
            })

            await SendToEmail({
                email: emailInfo.email,
                name: emailInfo.name,
            })

            setMessage("Код отправлен повторно")
        } catch (err) {
            console.error("Ошибка при повторной отправке кода:", err)
            setError("Ошибка при отправке кода")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className=' flex justify-center  mt-5 p-2'>
            <div className=" min-w-[350px] w-full rounded-2xl shadow-md p-5 ">
                <div className='flex justify-between'>
                    <div>
                        <h1 className='text-2xl text-gray-500'>Админ-панель</h1>
                    </div>

                    <div className=' flex justify-between gap-5 items-center text-gray-500'>
                        {
                            adminNav.map((item, index) => (
                                <p
                                    className={
                                        (state === item)
                                            ?
                                            'text-blue-500 transition duration-150 cursor-pointer scale-110 '
                                            :
                                            'hover:text-blue-500 transition duration-150 cursor-pointer hover:scale-105'
                                    }
                                    onClick={() => setState(item)}
                                    key={index}>
                                    {item}
                                </p>
                            ))
                        }

                        <Exit/>
                    </div>


                </div>
                <hr className="border-none mt-2 bg-gray-400 h-[2px]"/>

                <div className="w-full">
                    {
                        state === "Услуги"
                            ?
                            <Services/>
                            : null
                    }
                    {
                        state === "Галерея"
                            ?
                            <GalleryManager/>
                            : null
                    }
                    {
                        state === "Команда"
                            ?
                            <TeamManager/>
                            : null
                    }
                    {
                        state === "О нас"
                            ?
                            <About/>
                            : null
                    }
                    {
                        state === "Контакты"
                            ?
                            <Contacts/>
                            : null
                    }
                    {state === "Изменить пароль" && (
                        <form onSubmit={handlePasswordSubmit} className="mt-8 space-y-3 sm:space-y-4 lg:space-y-5">
                            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-700 mb-3 sm:mb-4">
                                Изменение пароля
                            </h2>

                            <div>
                                <label htmlFor="currentPassword" className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                                    Текущий пароль
                                </label>
                                <input
                                    type="password"
                                    id="currentPassword"
                                    name="currentPassword"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Введите текущий пароль"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="newPassword" className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                                    Новый пароль
                                </label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Введите новый пароль"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                                    Подтвердите новый пароль
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Повторите новый пароль"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-2 sm:py-3 px-4 text-sm sm:text-base rounded-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all font-medium ${
                                    loading
                                        ? 'bg-blue-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700'
                                } text-white`}
                            >
                                {loading ? "Изменение..." : "Изменить пароль"}
                            </button>
                        </form>
                    )}

                    {state === "Изменить почту" && !emailSender && (
                        <form onSubmit={handleEmailSubmit} className="mt-8 space-y-3 sm:space-y-4 lg:space-y-5">
                            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-700 mb-3 sm:mb-4">
                                Изменение email адреса
                            </h2>

                            <div>
                                <label htmlFor="newEmail" className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                                    Новый email
                                </label>
                                <input
                                    type="email"
                                    id="newEmail"
                                    name="newEmail"
                                    value={emailData.newEmail}
                                    onChange={handleEmailChange}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Введите новый email"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                                    Текущий пароль
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={emailData.password}
                                    onChange={handleEmailChange}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Введите ваш пароль для подтверждения"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-2 sm:py-3 px-4 text-sm sm:text-base rounded-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all font-medium ${
                                    loading
                                        ? 'bg-blue-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700'
                                } text-white`}
                            >
                                {loading ? "Отправка кода..." : "Отправить код подтверждения"}
                            </button>
                        </form>
                    )}

                    {state === "Изменить почту" && emailSender && (
                        <form onSubmit={handleConfirmCode} className="mt-8 space-y-3 sm:space-y-4 lg:space-y-5">
                            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-700 mb-3 sm:mb-4">
                                Подтверждение смены email
                            </h2>

                            <div className="bg-blue-50 p-3 sm:p-4 rounded-lg mb-3 sm:mb-4">
                                <p className="text-blue-700 text-xs sm:text-sm leading-relaxed">
                                    На вашу текущую почту отправлен код подтверждения.
                                    Введите его ниже для завершения смены email на <strong className="break-all">{emailData.newEmail}</strong>
                                </p>
                            </div>

                            <div>
                                <label htmlFor="code" className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                                    Код подтверждения
                                </label>
                                <input
                                    type="text"
                                    id="code"
                                    name="code"
                                    value={code}
                                    maxLength={4}
                                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-lg sm:text-xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-center tracking-widest"
                                    placeholder="0000"
                                    required
                                />
                                <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2 text-center">
                                    Введите 4-значный код из письма
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-2 sm:py-3 px-4 text-sm sm:text-base rounded-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all font-medium ${
                                    loading
                                        ? 'bg-blue-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700'
                                } text-white`}
                            >
                                {loading ? "Подтверждение..." : "Подтвердить смену email"}
                            </button>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={repeatCode}
                                    disabled={loading}
                                    className="text-blue-600 hover:text-blue-800 transition-colors font-medium text-sm sm:text-base disabled:text-gray-400"
                                >
                                    Отправить код еще раз
                                </button>
                            </div>
                        </form>
                    )}

                    {(error || message) && (
                        <div className={`mt-3 sm:mt-4 p-2 sm:p-3 rounded-lg text-center text-sm sm:text-base ${
                            error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                            {error || message}
                        </div>
                    )}
                </div>

            </div>

        </div>
    )
}