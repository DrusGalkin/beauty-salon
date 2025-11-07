import { useEffect, useState, useRef } from "react";
import { Slide } from "react-awesome-reveal";
import { SendStatement } from "../../api/mail-sender.jsx";
import ReCAPTCHA from "react-google-recaptcha";
import {TOKEN_RECAPTCHA} from "../../features/env-loader.jsx";

export default function EntryForm() {
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
    const [data, setData] = useState({
        name: "",
        phone_number: "",
        description: "",
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showCaptcha, setShowCaptcha] = useState(false);
    const [captchaError, setCaptchaError] = useState("");
    const recaptchaRef = useRef(null);

    const RECAPTCHA_SITE_KEY = TOKEN_RECAPTCHA;

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const validateForm = () => {
        const newErrors = {};

        if (!data.name.trim()) {
            newErrors.name = "ФИО обязательно для заполнения";
        }

        if (!data.phone_number.trim()) {
            newErrors.phone_number = "Номер телефона обязателен";
        } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(data.phone_number)) {
            newErrors.phone_number = "Некорректный формат номера";
        }

        if (!data.description.trim()) {
            newErrors.description = "Сообщение обязательно для заполнения";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCaptchaChange = (token) => {
        setData({ ...data, recaptchaToken: token });
        setCaptchaError("");
    };

    const handleCaptchaError = () => {
        setCaptchaError("Ошибка проверки reCAPTCHA");
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            setShowCaptcha(true);
        }
    };

    const handleCaptchaVerified = async () => {
        if (data.recaptchaToken) {
            setIsSubmitting(true);
            try {
                await SendStatement(data);
                console.log("Отправка данных:", data);

                setData({
                    name: "",
                    phone_number: "",
                    description: "",
                    recaptchaToken: ""
                });

                setShowCaptcha(false);

                if (recaptchaRef.current) {
                    recaptchaRef.current.reset();
                }
            } catch (error) {
                console.error("Ошибка при отправке:", error);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleCancelCaptcha = () => {
        setShowCaptcha(false);
        setCaptchaError("");
        if (recaptchaRef.current) {
            recaptchaRef.current.reset();
        }
    };

    const isDesktop = windowWidth > 1024;

    return (
        <Slide>
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
                <div className={`flex ${isDesktop ? 'flex-row' : 'flex-col-reverse'} gap-8 lg:gap-12 xl:gap-20 items-center justify-between`}>

                    <div className={`w-full ${isDesktop ? 'max-w-md lg:max-w-lg' : 'max-w-2xl'}`}>
                        <form onSubmit={handleFormSubmit} className='flex flex-col gap-6 sm:gap-8 w-full'>
                            <div>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData({ ...data, name: e.target.value })}
                                    className="w-full px-4 py-3 sm:py-4 border-b-2 border-gray-300 outline-none transition-all duration-300 focus:border-[#2654DC] focus:text-[#2654DC] text-gray-700 placeholder-gray-400 text-base sm:text-lg"
                                    placeholder="ФИО"
                                />
                                {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}
                            </div>

                            <div>
                                <input
                                    type="tel"
                                    value={data.phone_number}
                                    onChange={(e) => setData({ ...data, phone_number: e.target.value })}
                                    className="w-full px-4 py-3 sm:py-4 border-b-2 border-gray-300 outline-none transition-all duration-300 focus:border-[#2654DC] focus:text-[#2654DC] text-gray-700 placeholder-gray-400 text-base sm:text-lg"
                                    placeholder="Номер телефона"
                                />
                                {errors.phone_number && <p className="text-red-500 text-sm mt-2">{errors.phone_number}</p>}
                            </div>

                            <div>
                                <input
                                    type="text"
                                    value={data.description}
                                    onChange={(e) => setData({ ...data, description: e.target.value })}
                                    className="w-full px-4 py-3 sm:py-4 border-b-2 border-gray-300 outline-none transition-all duration-300 focus:border-[#2654DC] focus:text-[#2654DC] text-gray-700 placeholder-gray-400 text-base sm:text-lg"
                                    placeholder="Сообщение"
                                />
                                {errors.description && <p className="text-red-500 text-sm mt-2">{errors.description}</p>}
                            </div>

                            {showCaptcha && (
                                <div className="flex flex-col items-center gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                    <p className="text-gray-700 text-center">Пожалуйста, подтвердите, что вы не робот</p>
                                    <ReCAPTCHA
                                        ref={recaptchaRef}
                                        sitekey={RECAPTCHA_SITE_KEY}
                                        onChange={handleCaptchaChange}
                                        onErrored={handleCaptchaError}
                                        size="normal"
                                        theme="light"
                                    />
                                    {captchaError && <p className="text-red-500 text-sm text-center">{captchaError}</p>}

                                    <div className="flex gap-3 mt-2">
                                        <button
                                            type="button"
                                            onClick={handleCancelCaptcha}
                                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            Отмена
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCaptchaVerified}
                                            disabled={!data.recaptchaToken || isSubmitting}
                                            className={`px-4 py-2 bg-[#2654DC] text-white rounded-lg hover:bg-blue-700 transition-colors ${
                                                !data.recaptchaToken || isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                                            }`}
                                        >
                                            {isSubmitting ? "Отправка..." : "Подтвердить и отправить"}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {!showCaptcha && (
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`
                                        w-full bg-gray-900 hover:bg-[#2654DC] text-white 
                                        font-semibold py-3 sm:py-4 px-6 
                                        rounded-xl sm:rounded-2xl 
                                        transition-all duration-300 
                                        transform hover:scale-105 active:scale-95
                                        text-lg sm:text-xl
                                        shadow-lg hover:shadow-xl
                                        ${isSubmitting ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}
                                    `}
                                >
                                    {isSubmitting ? "Отправка..." : "Отправить"}
                                </button>
                            )}
                        </form>
                    </div>

                    <div className={`flex flex-col justify-center items-center text-center ${isDesktop ? 'text-left items-start' : ''} gap-6 sm:gap-8 w-full ${isDesktop ? 'max-w-2xl xl:max-w-3xl' : 'max-w-2xl'}`}>
                        <h1 className='text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight'>
                            Запишитесь к нам!
                        </h1>

                        <div className="space-y-4 sm:space-y-6 w-full">
                            <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 leading-relaxed">
                                "Мы рады пригласить вас в наш салон красоты, где вы сможете насладиться <span className='text-[#2654DC] font-semibold'>качественными</span> услугами и профессиональным обслуживанием."
                            </p>

                            <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 leading-relaxed">
                                "Наша команда опытных мастеров готова сделать <span className='text-[#2654DC] font-semibold'>все</span>, чтобы вы почувствовали себя красивыми и уверенными!"
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Slide>
    );
}