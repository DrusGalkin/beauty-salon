import {useEffect, useState} from "react";
import {FindAllCategories} from "../api/catrgorys.jsx";
import {FindAllServices} from "../api/services.jsx";
import Loader from "../features/loader.jsx";

export default function PriceList() {
    const [services, setServices] = useState(null);
    const [categories, setCategories] = useState(null);

    const fetchCategories = async () => {
        try {
            const res = await FindAllCategories();
            setCategories(res);
        } catch (error) {
            console.error("Error fetching categories:", error);
            setCategories([]);
        }
    }

    const loadServices = async () => {
        try {
            const res = await FindAllServices();
            setServices(res);
            console.log(res);
        } catch (error) {
            console.error("Error fetching services:", error);
            setServices([]);
        }
    }

    useEffect(() => {
        fetchCategories();
        loadServices();
    }, []);

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
                            onClick={() => window.location.href = "/price-list"}>
                            Прайс-лист
                        </li>
                    </ol>
                </nav>
                {categories && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse border border-gray-300">
                            <thead className="bg-gray-100">
                            <tr>
                                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                                    Услуга
                                </th>
                                <th className="border border-gray-300 px-4 py-3 text-right font-semibold w-32">
                                    Цена
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {categories.map((category, categoryIndex) => (
                                <>
                                    <tr key={categoryIndex} className="bg-gray-50">
                                        <td
                                            colSpan="2"
                                            className="border border-gray-300 px-4 py-3 font-bold text-lg"
                                        >
                                            {category.title}
                                        </td>
                                    </tr>

                                    {services && services
                                        .filter(service => service.category_id === category.id)
                                        .map((service, serviceIndex) => (
                                            <tr
                                                key={service.id || serviceIndex}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="border border-gray-300 px-4 py-3">
                                                    {service.title}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-3 text-right">
                                                    {service.price ? `${service.price} ₽` : '—'}
                                                </td>
                                            </tr>
                                        ))
                                    }

                                    {services && services.filter(service => service.category_id === category.id).length === 0 && (
                                        <tr>
                                            <td
                                                colSpan="2"
                                                className="border border-gray-300 px-4 py-3 text-center text-gray-500"
                                            >
                                                Нет услуг в этой категории
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {!categories && (
                    <Loader/>
                )}
            </div>
        </div>


    )
}
