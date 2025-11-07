import {Fade} from "react-awesome-reveal";

export default function SpecialistCardSlim({ image, full_name, tag}) {
    return (
        <Fade>
            <div className='flex w-full max-w-[320px] sm:max-w-none'>
                <div className="w-full transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 overflow-hidden">
                    <div className="relative w-full aspect-[3/4] sm:aspect-[2/3] lg:aspect-[3/4] overflow-hidden">
                        <img
                            className='w-full h-full object-cover object-center'
                            src={image}
                            alt={full_name}
                            loading="lazy"
                        />
                    </div>

                    <div className="flex flex-col flex-grow bg-[#2654DC] text-white p-4 sm:p-5 lg:p-6">
                        <h1 className='text-lg sm:text-xl lg:text-2xl font-semibold leading-tight break-words'>
                            {full_name}
                        </h1>

                        <hr className='w-16 sm:w-20 border-none bg-white rounded-2xl h-1 sm:h-1.5 mt-3 sm:mt-4 mb-3 sm:mb-4'/>

                        <div className="flex-grow flex items-start">
                            <p className='text-sm sm:text-base leading-relaxed break-words font-medium line-clamp-3'>
                                {tag}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Fade>
    )
}