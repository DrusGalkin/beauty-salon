import ServiceCart from "../widgets/profile/tools/services/service-cart.jsx";
import {useEffect, useState} from "react";
import {FindAllServices} from "../api/services.jsx";
import {Slide} from "react-awesome-reveal";
import Loader from "../features/loader.jsx";

export default function Services() {
    const [services, setServices] = useState(null)

    useEffect(() => {
        const loadServices = async () => {
            const res = await FindAllServices()
            setServices(res)
        }

        loadServices()
    }, [])

    if (services === null || services === undefined || services.length === 0) return <Loader/>;
    else return (
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
                            onClick={() => window.location.href = "/services"}>
                            Услуги
                        </li>
                    </ol>
                </nav>
                {

                    services.map((item, index) => (
                        <Slide direction='up'>
                            <ServiceCart id={item.id} key={index} title={item.title} description={item.description}
                                         price={item.price}/>
                        </Slide>
                    ))
                }
            </div>
        </div>

        )
}

