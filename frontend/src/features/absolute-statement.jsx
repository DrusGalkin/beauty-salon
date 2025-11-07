import {useState} from "react";
import StatementModal from "../widgets/modals/statement.jsx";

export default function AbsoluteStatement() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [view, setView] = useState(true);

    if (!view) return <div></div>;
    return (
        <div className="relative">
            {!isModalOpen && (
                <div className='fixed z-50 right-4 top-11/12 transform -translate-y-1/2'>
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors duration-200 z-10"
                        aria-label="Закрыть"
                    >
                        <svg
                            onClick={() => setView(false)}
                            className="w-4 h-4 text-gray-600"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M19 5L5 19M5 5L19 19"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 font-medium"
                    >
                        Оставить заявку
                    </button>
                </div>
            )}

            {isModalOpen && (
                <StatementModal setOpen={setIsModalOpen} />
            )}
        </div>
    )
}