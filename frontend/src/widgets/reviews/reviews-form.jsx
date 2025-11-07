import { useEffect, useState } from "react";
import Stars from "./stars.jsx";
import AuthModal from "../modals/auth.jsx";
import { getRefreshToken } from "../../api/auth.jsx";
import {CreatReviews, GetAllServiceReviews} from "../../api/reviews.jsx";
import Reviews from "./review.jsx";
import Loader from "../../features/loader.jsx";

export default function ReviewsForm({ id, setReload }) {
    const [rating, setRating] = useState(0);
    const [text, setText] = useState("");
    const [authModal, setAuthModal] = useState(false);
    const [errors, setErrors] = useState({ rating: "", text: "", submit: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(false);
    const [reloadReviews, setReloadReviews] = useState(false);

    const validate = () => {
        const newErrors = { rating: "", text: "", submit: "" };

        if (rating <= 0) {
            newErrors.rating = "Пожалуйста, поставьте оценку.";
        }

        if(text.length < 4){
            newErrors.text = "Опишите подробней";
        }

        if (!text.trim()) {
            newErrors.text = "Отзыв не может быть пустым.";
        }

        setErrors(newErrors);
        return !newErrors.rating && !newErrors.text;
    };

    const GetAndSetReviews = async () => {
        try{
            setLoading(true);
            const res = await GetAllServiceReviews(id)
            setReviews(res)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }

    }

    const createReview = async (e) => {
        e.preventDefault();

        setErrors((prev) => ({ ...prev, submit: "" }));

        if (!validate()) return;

        const token = getRefreshToken();
        if (!token) {
            setAuthModal(true);
            return;
        }

        setIsSubmitting(true);
        try {
            await CreatReviews(id, rating, text);
            setText("");
            setRating(0);
            await GetAndSetReviews()
        } catch (err) {
            console.error("Ошибка при создании отзыва:", err);
            setErrors((prev) => ({
                ...prev,
                submit: "Не удалось отправить отзыв. Попробуйте позже.",
            }));
        } finally {
            setIsSubmitting(false);
            setReload(true)
        }
    }

    useEffect(() => {
        GetAndSetReviews()
    },[])

    useEffect(() => {
        if(reloadReviews) {
            GetAndSetReviews()
            setReloadReviews(!reloadReviews)
        }
    },[reloadReviews])

    return (
        <div className="flex flex-col">
            <div className="w-full mx-auto p-6 rounded-xl">
                <div className="mb-6 flex flex-wrap justify-between items-start">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Оставьте свой отзыв!</h2>
                    <div className="mb-4">
                        <Stars rating={rating} setRating={setRating} />
                        {errors.rating && <p className="mt-1 text-sm text-red-600">{errors.rating}</p>}
                    </div>
                </div>

                <form onSubmit={createReview} className="space-y-4">
                    <div>
                        <label htmlFor="review-text" className="block text-sm font-medium text-gray-700 mb-1">
                            Ваш отзыв
                        </label>
                        <textarea
                            id="review-text"
                            name="review"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            rows={5}
                            className={`w-full px-4 py-3 text-gray-700 bg-gray-50 border ${
                                errors.text ? "border-red-500" : "border-gray-300"
                            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                            placeholder="Расскажите, что вам понравилось или что можно улучшить..."
                        ></textarea>
                        {errors.text && <p className="mt-1 text-sm text-red-600">{errors.text}</p>}
                    </div>

                    {errors.submit && <p className="text-sm text-red-600">{errors.submit}</p>}

                    <div className="">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-6 py-3 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition shadow-sm ${
                                isSubmitting
                                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                                    : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
                            }`}
                        >
                            {isSubmitting ? "Отправка..." : "Отправить"}
                        </button>
                    </div>
                </form>

                {authModal && <AuthModal setState={setAuthModal} />}
            </div>

            <div className='flex flex-col gap-5'>
                {
                    loading
                    ?
                        <Loader />
                    :
                        reviews !== null && reviews.length > 0
                        ?
                        reviews.map((review, index) => (
                            <Reviews
                                key={index}
                                rating={review.rating}
                                serID={review.service_id}
                                content={review.content}
                                userID={review.user_id}
                                id={review.id}
                                setReloadReviews={setReloadReviews}
                            />
                        ))
                        : <div className='flex justify-center'>
                            <h3>Тут пока нет комментариев. Станьте первым!</h3>
                          </div>

                }

            </div>
        </div>

    );
}