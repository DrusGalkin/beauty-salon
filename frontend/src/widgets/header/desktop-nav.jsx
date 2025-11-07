import {nav} from "../../features/nav.jsx";
import {useEffect, useState} from "react";
import AuthModal from "../modals/auth.jsx";
import {findUser} from "../../api/auth.jsx";
import {Bounce} from "react-awesome-reveal";

export default function DesktopNav() {
    let navStyles = "transition-all hover:scale-110"
    let profStyle = "transition-all hover:scale-110 flex cursor-pointer justify-center items-center gap-2"
    const [authModal, setAuthModal] = useState(false)
    const [userData, setUserData] = useState(null)

    useEffect(() => {
        const fetchUserData = async () => {
            await findUser(setUserData)
        }
        fetchUserData()
    }, [])

    return (

        <div className="flex items-center relative text-[15x] sm:text-[18px] justify-between gap-5">
            {
                nav.map((item, i) => {
                        let isProfile = item.name === "Личный кабинет"

                        return (
                            <a className={!isProfile ? navStyles : profStyle}
                               href={isProfile ? (userData !== null) ? item.path : null : item.path}
                               onClick={isProfile ? (userData === null) ? () => setAuthModal(!authModal) : null : null}
                               key={i}
                            >
                                {
                                    item.name === "Личный кабинет" ? (userData !== null) ? userData.name : item.name : item.name
                                }
                                {
                                    isProfile
                                        ?
                                        <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round"
                                               stroke-linejoin="round"></g>
                                            <g id="SVGRepo_iconCarrier">
                                                <path opacity="0.4"
                                                      d="M12.1605 10.87C12.0605 10.86 11.9405 10.86 11.8305 10.87C9.45055 10.79 7.56055 8.84 7.56055 6.44C7.56055 3.99 9.54055 2 12.0005 2C14.4505 2 16.4405 3.99 16.4405 6.44C16.4305 8.84 14.5405 10.79 12.1605 10.87Z"
                                                      stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"
                                                      stroke-linejoin="round"></path>
                                                <path
                                                    d="M7.1607 14.56C4.7407 16.18 4.7407 18.82 7.1607 20.43C9.9107 22.27 14.4207 22.27 17.1707 20.43C19.5907 18.81 19.5907 16.17 17.1707 14.56C14.4307 12.73 9.9207 12.73 7.1607 14.56Z"
                                                    stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"
                                                    stroke-linejoin="round"></path>
                                            </g>
                                        </svg>
                                        : null
                                }
                            </a>
                        )
                    }
                )
            }
            {
                authModal
                    ?
                    <AuthModal setState={setAuthModal}/>
                    : null
            }
        </div>
    )
}