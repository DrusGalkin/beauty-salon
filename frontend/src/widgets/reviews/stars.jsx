import {useState} from "react";

export default function Stars({rating, setRating}) {
    const totalStars = 5
    const [hover, setHover] = useState(0);

    return (
        <div className="flex">
            {[...Array(totalStars)].map((_, index) => {
                const currentRating = index + 1;
                return (
                    <button
                        key={index}
                        type="button"
                        className="text-3xl focus:outline-none"
                        onClick={() => setRating(currentRating)}
                        onMouseEnter={() => setHover(currentRating)}
                        onMouseLeave={() => setHover(0)}
                        aria-label={`Rate ${currentRating} stars`}
                    >
                        {currentRating <= (hover || rating) ? (
                            <span className="text-yellow-400">★</span>
                        ) : (
                            <span className="text-gray-300">☆</span>
                        )}
                    </button>
                );
            })}
        </div>
    );

}