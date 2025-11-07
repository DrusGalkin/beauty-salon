import { useEffect, useState } from "react";
import { CreateContact, GetAllContacts } from "../api/other.jsx";
import Loader from "../features/loader.jsx";
import {Slide} from "react-awesome-reveal";

export default function Contacts() {
    const [totalContacts, setTotalContacts] = useState(null);

    const setContacts = async () => {
        try {
            const contacts = await GetAllContacts();
            setTotalContacts(contacts);
        } catch (error) {
            console.error("Ошибка загрузки контактов:", error);
        }
    }

    useEffect(() => {
        setContacts();
    }, []);

    if (totalContacts === null) return <Loader />;

    return (

        <div className='min-h-screen py-8'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <nav className="mb-8">
                    <ol className="flex items-center space-x-2 text-sm text-gray-500">
                        <li
                            className="cursor-pointer transition hover:scale-101"
                            onClick={() => window.location.href = "/"}>
                            Главная
                        </li>
                        <li>/</li>
                        <li
                            className="cursor-pointer font-bold transition hover:scale-101"
                            onClick={() => window.location.href = "/contacts"}>
                            Контакты
                        </li>
                    </ol>
                </nav>
                <div className="py-4 sm:py-6 lg:py-8">
                    <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                        <div className="mb-6 sm:mb-8 text-center sm:text-left">
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                                Контакты
                            </h1>
                            <p className="text-gray-600 text-sm sm:text-base">
                                Свяжитесь с нами удобным для вас способом
                            </p>
                        </div>

                        <div className='flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8'>

                            <div className="flex flex-col gap-4 sm:gap-6 w-full lg:max-w-[400px] lg:grow-0">
                                {totalContacts.map((contact, index) => (
                                    <div
                                        key={index}
                                        className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-all duration-300 border border-gray-100"
                                    >
                                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                                            {contact.title}
                                        </h3>
                                        <div className="text-gray-600 space-y-1 sm:space-y-2">
                                            {contact.contacts.split('\n').map((line, lineIndex) => (
                                                <p key={lineIndex} className="text-xs sm:text-sm leading-relaxed">
                                                    {line}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className='w-full lg:flex-1'>
                                <div className="flex flex-col gap-3 sm:gap-4 lg:gap-6 w-full">
                                    <div className="w-full relative pb-[75%] h-0 sm:pb-[60%] lg:pb-0 lg:h-[400px] xl:h-[450px] rounded-lg overflow-hidden">
                                        <iframe
                                            src="https://yandex.ru/map-widget/v1/?um=constructor%3Aa90e112a2b315f4d3714dab2401a9fbb2222f4502cd93298e80e1fe3a0965ee4&amp;source=constructor"
                                            className='absolute top-0 left-0 w-full h-full'
                                            frameBorder="0"
                                            title="Карта расположения"
                                        />
                                    </div>

                                    <a
                                        className='text-[#678AF4] font-medium text-base sm:text-lg lg:text-xl text-center lg:text-left transition-all hover:scale-105 inline-block'
                                        target='_blank'
                                        rel="noopener noreferrer"
                                        href="https://yandex.ru/profile/4102753181?lang=ru&no-distribution=1&view-state=mini&source=wizbiz_new_map_single"
                                    >
                                        Открыть Яндекс.Карты
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}