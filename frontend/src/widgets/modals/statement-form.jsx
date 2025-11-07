import {useState, useRef} from "react";
import {SendStatement} from "../../api/mail-sender.jsx";
import ReCAPTCHA from "react-google-recaptcha";
import {TOKEN_RECAPTCHA} from "../../features/env-loader.jsx";

export default function StatementForm({title, open, setOpen}){
    const [data, setData] = useState({
        name: "",
        phone_number: "",
        description: "Здравствуйте! Хочу оставить заявку на " + (title !== undefined ? title : ""),
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [captchaError, setCaptchaError] = useState("");
    const recaptchaRef = useRef(null);

    const RECAPTCHA_SITE_KEY = TOKEN_RECAPTCHA;

    const inputStyle = "border-b-2 outline-0 transition-all focus:text-[#2654DC] w-[98%] text-gray-400 p-5 border-b-gray-300";
    const errorStyle = "text-red-500 text-sm mt-1";

    const validate = () => {
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

        if (!data.recaptchaToken) {
            setCaptchaError("Пожалуйста, подтвердите, что вы не робот");
        } else {
            setCaptchaError("");
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0 && data.recaptchaToken;
    };

    const handleCaptchaChange = (token) => {
        setData({ ...data, recaptchaToken: token });
        setCaptchaError("");
    };

    const handleCaptchaError = () => {
        setCaptchaError("Ошибка проверки reCAPTCHA");
    };

    const handleSubmit = async(e) => {
        e.preventDefault();

        setCaptchaError("");

        if (validate()) {
            setIsSubmitting(true);
            try {
                await SendStatement(data);
                console.log("Отправка данных:", data);

                setData({
                    name: "",
                    phone_number: "",
                    description: "Здравствуйте! Хочу оставить заявку на",
                    recaptchaToken: ""
                });

                if (recaptchaRef.current) {
                    recaptchaRef.current.reset();
                }

                setOpen(!open);
            } catch (error) {
                console.error("Ошибка при отправке:", error);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className='w-full flex justify-center mt-10 '>
            <form onSubmit={handleSubmit} className=' bg-white z-50 rounded-2xl flex flex-col justify-center gap-[30px] w-full max-w-[500px] p-5'>
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-xl font-semibold text-gray-800">Оставьте заявку</h2>

                    <button
                        type="button"
                        onClick={() => setOpen(!open)}
                        aria-label="Закрыть форму"
                        className="cursor-pointer transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full p-1"
                    >
                        <svg
                            className="w-7 h-7 text-gray-500 hover:text-red-500 transition-colors"
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
                    </button>
                </div>

                <div>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData({ ...data, name: e.target.value })}
                        className={inputStyle}
                        placeholder="ФИО"
                    />
                    {errors.name && <p className={errorStyle}>{errors.name}</p>}
                </div>

                <div>
                    <input
                        type="tel"
                        value={data.phone_number}
                        onChange={(e) => setData({ ...data, phone_number: e.target.value })}
                        className={inputStyle}
                        placeholder="Номер телефона"
                    />
                    {errors.phone_number && <p className={errorStyle}>{errors.phone_number}</p>}
                </div>

                <div>
                    <input
                        type="text"
                        value={data.description}
                        onChange={(e) => setData({ ...data, description: e.target.value })}
                        className={inputStyle}
                        placeholder="Сообщение"
                    />
                    {errors.description && <p className={errorStyle}>{errors.description}</p>}
                </div>

                <div className="flex justify-center">
                    <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={RECAPTCHA_SITE_KEY}
                        onChange={handleCaptchaChange}
                        onErrored={handleCaptchaError}
                        size="normal"
                        theme="light"
                    />
                </div>

                {captchaError && <p className={`${errorStyle} text-center`}>{captchaError}</p>}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`bg-black text-white p-3 rounded-2xl transition-all cursor-pointer hover:scale-105 hover:bg-[#2654DC] ${
                        isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                >
                    {isSubmitting ? "Отправка..." : "Отправить"}
                </button>
            </form>
        </div>
    )
}