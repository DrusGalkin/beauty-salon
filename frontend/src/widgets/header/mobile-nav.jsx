import {nav} from "../../features/nav.jsx";
import {useEffect, useState} from "react";
import AuthModal from "../modals/auth.jsx";
import {findUser} from "../../api/auth.jsx";

export default function MobileNav({isScrolled}) {
    const [isOpen, setIsOpen] = useState(false);
    const [authModal, setAuthModal] = useState(false);
    const [userData, setUserData] = useState(null);

    let iconStyle = `
        transition-all hover:scale-110 cursor-pointer
        ${isScrolled ? 'w-[40px] h-[40px]' : 'w-[50px] h-[50px]'}
    `;
    let scale = 'scale-120 hover:scale-130';

    useEffect(() => {
        const fetchUserData = async () => {
            await findUser(setUserData);
        }
        fetchUserData();
    }, []);

    const handleNavClick = (item, event) => {
        if (item.name === "Личный кабинет" && userData === null) {
            event.preventDefault();
            setAuthModal(true);
            setIsOpen(false);
        }
        setIsOpen(false);
    };

    return (
        <div className="relative">
            {/* Кнопка бургер-меню */}
            {!isOpen ? (
                <svg
                    className={iconStyle}
                    onClick={() => setIsOpen(true)}
                    viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                        <path d="M4 6H20M4 12H20M4 18H20" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"
                              strokeLinejoin="round"></path>
                    </g>
                </svg>
            ) : (
                <svg
                    className={`${iconStyle} ${scale}`}
                    onClick={() => setIsOpen(false)}
                    viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                        <path d="M6 18L18 6M6 6l12 12" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"
                              strokeLinejoin="round"></path>
                    </g>
                </svg>
            )}

            {isOpen && (
                <div className="fixed inset-0 bg-[#1f75fe] z-50 flex flex-col items-center justify-center">
                    <div className="flex flex-col items-center gap-6 text-2xl w-full max-w-md px-6">
                        {nav.map((item, i) => {
                            const isProfile = item.name === "Личный кабинет";
                            const href = isProfile
                                ? (userData !== null ? item.path : "#")
                                : item.path;

                            return (
                                <a
                                    className="w-full text-center py-3 transition-all hover:bg-white/10 rounded-lg border-b-2 border-white/20 last:border-b-0 flex items-center justify-center gap-3"
                                    href={href}
                                    onClick={(e) => handleNavClick(item, e)}
                                    key={i}
                                >
                                    {isProfile && userData !== null ? userData.name : item.name}

                                    {isProfile && (
                                        <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round"
                                               strokeLinejoin="round"></g>
                                            <g id="SVGRepo_iconCarrier">
                                                <path opacity="0.4"
                                                      d="M12.1605 10.87C12.0605 10.86 11.9405 10.86 11.8305 10.87C9.45055 10.79 7.56055 8.84 7.56055 6.44C7.56055 3.99 9.54055 2 12.0005 2C14.4505 2 16.4405 3.99 16.4405 6.44C16.4305 8.84 14.5405 10.79 12.1605 10.87Z"
                                                      stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"
                                                      strokeLinejoin="round"></path>
                                                <path
                                                    d="M7.1607 14.56C4.7407 16.18 4.7407 18.82 7.1607 20.43C9.9107 22.27 14.4207 22.27 17.1707 20.43C19.5907 18.81 19.5907 16.17 17.1707 14.56C14.4307 12.73 9.9207 12.73 7.1607 14.56Z"
                                                    stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"
                                                    strokeLinejoin="round"></path>
                                            </g>
                                        </svg>
                                    )}
                                </a>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute bottom-8 text-white text-lg py-2 px-6 border-2 border-white rounded-lg hover:bg-white/10 transition-all"
                    >
                        Закрыть
                    </button>
                </div>
            )}

            {authModal && (
                <AuthModal setState={setAuthModal} />
            )}
        </div>
    );
}