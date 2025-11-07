import {useEffect, useState} from "react";
import {Fade} from "react-awesome-reveal";
import {GetAllTeammates} from "../../api/other.jsx";
import Loader from "../../features/loader.jsx";
import SpecialistCardSlim from "./specialist-cart-slim.jsx";
import {PHOTO_URL} from "../../api/photos.jsx";

export default function GalleryBlock() {
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
    const [team, setTeam] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        loadTeam()
    }, [])

    const getRandomItems = (array, count) => {
        const shuffled = [...array].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    const loadTeam = async () => {
        try {
            setLoading(true);
            const res = await GetAllTeammates();

            const randomTeam = getRandomItems(res || [], 3);
            setTeam(randomTeam);
        } catch (error) {
            console.error('Error loading team:', error);
            setTeam([]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Fade className="w-full mt-5  flex ">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-start mb-9 ">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
                        Наши Специалисты
                    </h1>
                    <p className="text-gray-600 text-lg sm:text-xl max-w-2xl ">
                        Профессионалы с многолетним опытом работы
                    </p>
                </div>

                <div className="flex justify-center mb-8 sm:mb-12">
                    <div className={`
                        grid justify-items-center
                        ${windowWidth < 640 ? 'grid-cols-1 gap-6 max-w-md' : ''}
                        ${windowWidth >= 640 && windowWidth < 1024 ? 'grid-cols-2 gap-6' : ''}
                        ${windowWidth >= 1024 ? 'grid-cols-3 gap-6 lg:gap-8' : ''}
                        w-full
                    `}>
                        {loading ? (
                            <div className="col-span-full flex justify-center py-12">
                                <Loader />
                            </div>
                        ) : team.length === 0 ? (
                            <div className="col-span-full text-center py-12">
                                <p className="text-gray-500 text-xl">Специалисты не найдены</p>
                            </div>
                        ) : (
                            team.map((teammate, index) => (
                                <div
                                    key={teammate.id || index}
                                    className={`
                                        ${windowWidth < 640 ? 'w-full max-w-sm' : ''}
                                        ${windowWidth >= 640 && windowWidth < 1024 ? 'w-full' : ''}
                                        ${windowWidth >= 1024 ? 'w-full' : ''}
                                    `}
                                >
                                    <SpecialistCardSlim
                                        image={`${PHOTO_URL}/${teammate.url}`}
                                        full_name={teammate.full_name}
                                        tag={teammate.tag}
                                    />
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="text-start">
                    <button
                        className="
                            w-full sm:w-auto
                            min-w-[200px] max-w-sm sm:max-w-none
                            bg-gray-900 hover:bg-[#2654DC]
                            text-white
                            font-semibold
                            py-3 sm:py-4
                            px-6 sm:px-8
                            rounded-xl
                            text-lg sm:text-xl
                            transition-all
                            duration-300
                            transform
                            hover:scale-105
                            active:scale-95
                            shadow-lg
                            hover:shadow-xl
                        "
                        onClick={() => window.location.href = '/team'}
                    >
                        Показать всех
                    </button>
                </div>
            </div>
        </Fade>
    );
}