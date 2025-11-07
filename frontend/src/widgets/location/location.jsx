import {Fade, Slide} from "react-awesome-reveal";
import {useEffect, useState} from "react";

const Locations = () => {
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isDesktop = windowWidth > 1024;

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
            <div className="text-center lg:text-left mb-8 sm:mb-10 lg:mb-12">
                <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4'>
                    Где мы находимся
                </h1>
                <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto lg:mx-0">
                    Приходите к нам в гости в удобное для вас время
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-10 items-stretch">
                <div className="w-full lg:w-1/2">
                    <div>
                        <div className="relative w-full h-full">
                            <img
                                className='w-full h-64 sm:h-80 lg:h-96 xl:h-[500px] object-cover rounded-xl sm:rounded-2xl shadow-lg'
                                src="https://avatars.mds.yandex.net/get-altay/15386900/2a00000197bb2319d338c0c81a687273626a/XXXL"
                                alt="Наше местоположение"
                                loading="lazy"
                            />
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-1/2">
                    <div >
                        <div className="flex flex-col gap-4 sm:gap-6 h-full">
                            <div className="flex-1 min-h-[300px] sm:min-h-[400px]">
                                <div
                                    className="relative w-full h-full rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
                                    <iframe
                                        src="https://yandex.ru/map-widget/v1/?um=constructor%3Aa90e112a2b315f4d3714dab2401a9fbb2222f4502cd93298e80e1fe3a0965ee4&amp;source=constructor"
                                        className='w-full h-[500px]'
                                        frameBorder="0"
                                        title="Карта расположения"
                                    />

                                </div>
                            </div>

                            <div className="text-center lg:text-left">
                                <a
                                    className='
                                        inline-flex items-center justify-center lg:justify-start
                                        text-blue-600 hover:text-blue-700
                                        font-semibold
                                        text-lg sm:text-xl lg:text-2xl
                                        transition-all
                                        duration-300
                                        transform
                                        hover:scale-105
                                        hover:underline
                                        py-2 px-4
                                        rounded-lg
                                        bg-blue-50 hover:bg-blue-100
                                        w-full lg:w-auto
                                    '
                                    target='_blank'
                                    rel="noopener noreferrer"
                                    href="https://yandex.ru/profile/4102753181?lang=ru&no-distribution=1&view-state=mini&source=wizbiz_new_map_single"
                                >
                                    Открыть в Яндекс.Картах
                                    <svg
                                        className="ml-2 w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                        />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {!isDesktop && (
                <div className="mt-6 sm:mt-8 text-center">
                    <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                        <h3 className="font-semibold text-gray-900 text-lg sm:text-xl mb-2">
                            Контактная информация
                        </h3>
                        <p className="text-gray-600 text-sm sm:text-base">
                            Мы находимся в удобном районе города с парковкой
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Locations;