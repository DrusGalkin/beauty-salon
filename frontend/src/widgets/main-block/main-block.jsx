import middlePhoto from './../../images/middle_photo.png';
import { useEffect, useState } from 'react';
import { Fade } from 'react-awesome-reveal';

export default function MailBlock() {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isDesktop = windowWidth > 1328;

    return (
        <div className={`w-full mt-10 px-6 ${isDesktop ? 'flex justify-between items-center' : 'flex flex-col items-center text-center'}`}>
            <div className={`max-w-2xl ${isDesktop ? '' : 'mb-8'}`}>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                    Салон красоты “Эстетика”
                </h1>

                <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8">
                    Добро пожаловать в наш салон красоты, где мы предлагаем широкий спектр услуг для мужчин и женщин!
                    Наша цель — создать атмосферу уюта и комфорта, где каждый клиент сможет расслабиться и насладиться процедурами, направленными на улучшение внешнего вида и самочувствия.
                </p>

                {!isDesktop && (
                    <div className="mb-8">
                        <Photo />
                    </div>
                )}

                <a
                    href="/services"
                    className="inline-block bg-black text-white sm:w-full lg:w-[240px] text-center px-8 py-4 rounded-2xl text-lg font-medium transition-all duration-300 hover:scale-105 hover:bg-[#2654DC] shadow-lg hover:shadow-xl"
                >
                    К каталогу услуг
                </a>
            </div>

            {isDesktop && (
                <div className="ml-12 flex-shrink-0">
                    <Photo />
                </div>
            )}
        </div>
    );
}

function Photo() {
    return (
        <Fade direction="up" triggerOnce>
            <img
                className="rounded-2xl h-[466px] w-[699px] object-cover object-center shadow-xl"
                src='https://avatars.mds.yandex.net/get-altay/7982580/2a00000187b803334b1565a1eebabaa09305/XXXL'
                alt="Салон красоты Эстетика"
            />
        </Fade>
    );
}