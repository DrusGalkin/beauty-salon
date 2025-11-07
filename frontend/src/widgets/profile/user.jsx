import {Exit} from "./tools/tools.jsx";
import {useState} from "react";
import {getUserByEmail, UpdateEmail, UpdatePassword, ValidToken} from "../../api/auth.jsx";
import {ConfirmCode, SendToEmail} from "../../api/mail-sender.jsx";

export default function UserGUI() {
    const [state, setState] = useState("Изменить пароль")
    const userMethods = ["Изменить пароль", "Изменить почту"]

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

    const resetEmailForm = () => {
        setEmailSender(false)
        setCode("")
        setError("")
        setMessage("")
    }

    return (
        <div className='flex justify-center mt-3 sm:mt-5 p-2 sm:p-4'>
            <div className="w-full max-w-[650px] bg-gray-50 rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0'>
                    <div>
                        <h1 className='text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-600 sm:text-gray-500'>
                            Профиль
                        </h1>
                    </div>

                    <div className='flex justify-between items-center gap-3 sm:gap-4 lg:gap-5 w-full sm:w-auto'>
                        <div className='flex gap-2 sm:gap-3 lg:gap-4'>
                            {userMethods.map((item, index) => (
                                <p
                                    key={index}
                                    onClick={() => {
                                        setState(item)
                                        setError("")
                                        setMessage("")
                                        if (item === "Изменить почту") {
                                            resetEmailForm()
                                        }
                                    }}
                                    className={`
                                        text-sm sm:text-base transition duration-150 cursor-pointer font-medium
                                        ${state === item
                                        ? 'text-blue-600 scale-105'
                                        : 'text-gray-500 hover:text-blue-500 hover:scale-105'
                                    }
                                    `}
                                >
                                    {item}
                                </p>
                            ))}
                        </div>
                        <div className="flex-shrink-0">
                            <Exit/>
                        </div>
                    </div>
                </div>

                <hr className="border-none mt-3 sm:mt-4 bg-gray-300 h-[1px] sm:h-[2px]"/>

                <div className="w-full mt-4 sm:mt-6 lg:mt-8">
                    {state === "Изменить пароль" && (
                        <form onSubmit={handlePasswordSubmit} className="space-y-3 sm:space-y-4 lg:space-y-5">
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
                        <form onSubmit={handleEmailSubmit} className="space-y-3 sm:space-y-4 lg:space-y-5">
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
                        <form onSubmit={handleConfirmCode} className="space-y-3 sm:space-y-4 lg:space-y-5">
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