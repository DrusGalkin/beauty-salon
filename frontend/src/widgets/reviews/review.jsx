import { useEffect, useState, useRef } from "react";
import {getUserByID, IsAdmin} from "../../api/auth.jsx";
import {DeleteReviews} from "../../api/reviews.jsx";

export default function Reviews({ id, rating, content, userID, setReloadReviews}) {
    const [userName, setUserName] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);
    const [showToggleButton, setShowToggleButton] = useState(false);
    const textRef = useRef(null);
    const [isAdmin, setIsAdmin] = useState(false);

    const displayName = userID ? userName || "Загрузка..." : "Аноним";

    useEffect(() => {
        async function fetchUserName() {
            if (userID) {
                try {
                    const res = await getUserByID(userID);
                    setUserName(res.name || "Пользователь");
                } catch (err) {
                    setUserName("Аноним");
                }
            }
        }
        fetchUserName();
    }, [userID]);


    const GetAndSetIsAdmin = async() => {
        const res = await IsAdmin()
        setIsAdmin(res.admin)
    }

    useEffect(() => {
        if (textRef.current) {
            const el = textRef.current;
            const isOverflowing = el.scrollHeight > el.clientHeight;
            setShowToggleButton(isOverflowing);
        }
        GetAndSetIsAdmin()
    }, [content, userName]);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex w-full justify-between flex-wrap">
                <span className="font-semibold text-gray-800">{displayName}</span>
                <div className="flex mb-3">
                    {[...Array(5)].map((_, i) => (
                        <span
                            key={i}
                            className={`text-xl ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
                        >
                            ★
                        </span>
                    ))}

                    {
                        isAdmin && (
                            <svg
                                onClick={async () => {
                                   await DeleteReviews(id)
                                    setReloadReviews(true)
                                }}
                                className="w-7 ml-5 h-7 text-gray-500 hover:text-red-500 transition-colors"
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
                        )
                    }

                </div>
            </div>

            <p
                ref={textRef}
                className={`text-gray-700 break-words leading-relaxed whitespace-pre-line transition-all duration-200 ${
                    !isExpanded ? "line-clamp-2" : ""
                }`}
                style={{ display: "-webkit-box", WebkitBoxOrient: "vertical" }}
            >
                {content}
            </p>

            {showToggleButton && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                    {isExpanded ? "Скрыть" : "Показать ещё"}
                </button>
            )}
        </div>
    );
}