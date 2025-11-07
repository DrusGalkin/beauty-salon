export default function Footer() {
    return (
        <div className="bg-[#2654DC] text-white w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-7">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-5">
                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 text-center sm:text-left">
                        <p className="text-sm sm:text-base whitespace-nowrap">
                            © {new Date().getFullYear()} Эстетика. Все права защищены.
                        </p>

                        <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                            <p
                                onClick={()=> window.location.href = '/about'}
                                className="hover:text-gray-200 transition-colors cursor-pointer whitespace-nowrap">
                                Команда
                            </p>
                            <p
                                onClick={()=> window.location.href = '/team'}
                                className="hover:text-gray-200 transition-colors cursor-pointer whitespace-nowrap">
                                О нас
                            </p>
                            <p
                                onClick={()=> window.location.href = '/contacts'}
                                className="hover:text-gray-200 transition-colors cursor-pointer whitespace-nowrap">
                                Контакты
                            </p>
                        </div>
                    </div>

                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://github.com/DrusGalkin"
                        className="text-sm sm:text-base hover:text-gray-200 transition-colors whitespace-nowrap text-center md:text-right"
                    >
                        Сделано с ❤️ DrusGalkin
                    </a>
                </div>
            </div>
        </div>
    )
}