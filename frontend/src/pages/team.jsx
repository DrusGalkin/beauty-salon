import SpecialistCardSlim from "../widgets/specialists/specialist-cart-slim.jsx";
import Loader from "../features/loader.jsx";
import {PHOTO_URL} from "../api/photos.jsx";
import {useEffect, useState} from "react";
import {GetAllTeammates} from "../api/other.jsx";

export default function Team() {
    const [team, setTeam] = useState(null)
    useEffect(() => {
        loadTeam()
    }, [])

    const loadTeam = async () => {
        const res = await GetAllTeammates()
        setTeam(res)
    }
    return (
        <div className='min-h-screen py-4 sm:py-6 lg:py-8'>
            <div className='max-w-7xl mx-auto px-3 sm:px-4 lg:px-6'>
                <nav className="mb-6 sm:mb-8">
                    <ol className="flex items-center space-x-2 text-sm text-gray-500">
                        <li
                            className="cursor-pointer transition hover:text-gray-700"
                            onClick={() => window.location.href = "/"}>
                            Главная
                        </li>
                        <li>/</li>
                        <li
                            className="cursor-pointer font-bold transition hover:text-gray-700"
                            onClick={() => window.location.href = "/team"}>
                            Команда
                        </li>
                    </ol>
                </nav>

                <div className="mx-auto">
                    <div className="mb-6 sm:mb-8 text-center lg:text-left">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
                            Команда
                        </h1>
                        <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
                            Наши первоклассные сотрудники
                        </p>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 justify-items-center'>
                        {
                            (team === null)
                                ?
                                <div className="col-span-full flex justify-center py-8">
                                    <Loader/>
                                </div>
                                : team.map((teammate, index) => (
                                    <SpecialistCardSlim
                                        key={index}
                                        image={`${PHOTO_URL}/${teammate.url}`}
                                        full_name={teammate.full_name}
                                        tag={teammate.tag}
                                    />
                                ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}