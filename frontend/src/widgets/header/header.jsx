import {useEffect, useState} from "react";
import MobileNav from "./mobile-nav.jsx";
import DesktopNav from "./desktop-nav.jsx";
import {Fade, Zoom} from 'react-awesome-reveal';

export default function Header() {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        }

        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            setIsScrolled(scrollTop > 50);
        }

        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);
        }
    }, []);

    return (
        <div className={`
            w-full text-white top-0 z-50 relative  flex justify-center items-center
            transition-all duration-300 ease-in-out
            ${isScrolled ? 'py-2 bg-[#2654DC]/95 backdrop-blur-sm shadow-lg' : 'py-6 bg-[#2654DC]'}
        `}>
            <div className={`
                w-full max-w-[1440px] flex justify-between items-center
                transition-all duration-300 ease-in-out
                ${isScrolled ? 'px-6' : 'px-6'}
            `}>
                <div className="flex flex-col transition-all duration-300">
                    <h1
                        onClick={() => {
                            if(window.location.pathname !== "/") window.location.href = "/"
                        }}
                        className={`
                            cursor-pointer animate__fadeIn
                            transition-all duration-300
                            ${isScrolled ? 'text-3xl sm:text-5xl' : 'text-5xl sm:text-7xl'}
                        `}>
                        Эстетика
                    </h1>

                    <a
                        target="_blank"
                        href='https://yandex.ru/profile/4102753181?lang=ru&no-distribution=1&view-state=mini&source=wizbiz_new_map_single'
                        className={`
                            cursor-pointer transition-all duration-300
                            hover:scale-110
                            ${isScrolled ? 'text-sm opacity-90' : 'text-base'}
                        `}>
                        ул. Льва Кассиля, 27А
                    </a>
                </div>

                <div className='relative'>
                    {
                        windowWidth > 922
                            ? <DesktopNav isScrolled={isScrolled} />
                            : <MobileNav isScrolled={isScrolled} />
                    }
                </div>

            </div>
        </div>
    )
}