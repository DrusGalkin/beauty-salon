import {useState} from "react";
import {Login, Register, getUserByEmail} from "../../api/auth.jsx";
import {ConfirmCode, SendToEmail} from "../../api/mail-sender.jsx";
import {Bounce} from "react-awesome-reveal";

export default function AuthForm({setState, isRoute}) {
    const [authState, setAuthState] = useState(false)
    const [emailSender, setEmailSender] = useState(false)

    const [message, setMessage] = useState("")
    const [error, setError] = useState("")
    const [code, setCode] = useState("")
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const checkEmailExists = async (email) => {
        try {
            const user = await getUserByEmail({ email });
            return !!user;
        } catch (error) {
            console.log("Ошибка при проверке email:", error);
            return false;
        }
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        setError("")
        setMessage("")
        setLoading(true)

        if (!authState && formData.password !== formData.confirmPassword) {
            setError("Пароли не совпадают")
            setLoading(false)
            return
        }

        if (!authState && formData.password.length < 6) {
            setError("Пароль должен содержать минимум 6 символов")
            setLoading(false)
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
            setError("Введите корректный email адрес")
            setLoading(false)
            return
        }

        if(!authState) {
            try {
                const emailExists = await checkEmailExists(formData.email)

                if (emailExists) {
                    setError("Пользователь с таким email уже существует")
                    setLoading(false)
                    return
                }

                console.log(formData)
                let res = await SendToEmail(formData)
                console.log("На почту", res)

                if (res.status === 200) {
                    setEmailSender(true)
                    setMessage("Код отправлен на вашу почту")
                } else {
                    setError("Ошибка при отправке кода")
                }
            } catch (err) {
                console.error("SendToEmail error:", err)
                setError("Ошибка сети")
            } finally {
                setLoading(false)
            }
        } else {
            await handleLogin(e)
        }
    }

    const confirmCode = async(e) => {
        e.preventDefault()
        setError("")
        setMessage("")
        setLoading(true)

        try {
            const res = await ConfirmCode({
                email: formData.email,
                code: code,
            })

            if (res.status === 200) {
                setMessage("Успешно! Аккаунт подтвержден")
                await Register(formData)
                setAuthState(true)
                setEmailSender(false)
            } else if (res.status === 408) {
                setError("Код истек")
            } else if (res.status === 400) {
                setError("Неверный код")
            } else {
                setError("Произошла ошибка")
            }
        } catch (err) {
            console.error("ConfirmCode error:", err)
            setError("Невалидный код")
        } finally {
            setLoading(false)
        }
    }

    const repeatCode = async() => {
        setError("")
        setMessage("")
        setLoading(true)

        try {
            const res = await SendToEmail(formData)

            if (res.status === 200) {
                setMessage("Код отправлен повторно")
            } else {
                setError("Ошибка при отправке кода")
            }
        } catch (err) {
            console.error("Repeat code error:", err)
            setError("Невалидный код")
        } finally {
            setLoading(false)
        }
    }

    const handleLogin = async(e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await Login(formData)
        } catch (err) {
            console.error("Login error:", err)
            setError(err.response?.data?.error || "Ошибка входа")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-[600px] text-black p-6 w-full absolute left-1/2 top-[100px] -translate-x-1/2 bg-white rounded-2xl z-50 border-2 border-gray-200">

            <div className="flex w-full justify-between items-center ">
                <div className='flex items-end gap-2'>
                    <h1 className="text-3xl">
                        {!emailSender ? authState ? "Вход" : "Регистрация" : "Код отправлен на почту"}
                    </h1>
                </div>
                {
                    !isRoute && (
                        <svg
                            onClick={()=> setState(true)}
                            className="cursor-pointer transition-all hover:text-red-500 mb-5 hover:scale-110"
                            width="30px"
                            height="30px"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M19 5L5 19M5.00001 5L19 19"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></path>
                        </svg>
                    )
                }

            </div>

            <hr className='bg-gray-400 border-none h-[2px]'/>

            {
                !emailSender
                    ?
                    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                        <div className="space-y-4 mb-[40px]">
                            {
                                !authState
                                    ?
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                            Ваше имя
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            placeholder="Введите полное имя"
                                            required
                                        />
                                    </div>
                                    : null
                            }

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Введите ваш email"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Пароль
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Введите пароль"
                                    required
                                />
                            </div>

                            {!authState && (
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                        Подтвердите пароль
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        placeholder="Повторите пароль"
                                        required
                                    />
                                </div>
                            )}
                        </div>

                        <Bounce>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 px-4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all font-medium ${
                                    loading
                                        ? 'bg-blue-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700'
                                } text-white`}
                            >
                                {loading
                                    ? (authState ? "Вход..." : "Проверка...")
                                    : (authState ? "Войти" : "Зарегистрироваться")
                                }
                            </button>
                        </Bounce>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => {
                                    setAuthState(!authState)
                                    setError("")
                                    setMessage("")
                                }}
                                className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
                            >
                                {authState ? "Нет аккаунта? Зарегистрируйтесь" : "Уже есть аккаунт? Войдите"}
                            </button>
                        </div>
                    </form>
                    :
                    <form onSubmit={confirmCode} className="mt-6 space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                                    Код подтверждения
                                </label>
                                <input
                                    type="text"
                                    id="code"
                                    name="code"
                                    value={code}
                                    maxLength={4}
                                    onChange={(e)=> setCode(e.target.value.replace(/\D/g, ''))}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-center text-xl tracking-widest"
                                    placeholder="0000"
                                    required
                                />
                                <p className="text-sm text-gray-500 mt-1 text-center">
                                    Введите 4-значный код из письма
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 px-4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all font-medium ${
                                    loading
                                        ? 'bg-blue-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700'
                                } text-white`}
                            >
                                {loading ? "Подтверждение..." : "Подтвердить"}
                            </button>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={repeatCode}
                                    disabled={loading}
                                    className="text-blue-600 hover:text-blue-800 transition-colors font-medium disabled:text-gray-400"
                                >
                                    Отправить код еще раз
                                </button>
                            </div>
                        </div>

                        {(error || message) && (
                            <div className={`p-3 rounded-lg text-center ${
                                error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                            }`}>
                                {error || message}
                            </div>
                        )}
                    </form>
            }
        </div>
    )
}