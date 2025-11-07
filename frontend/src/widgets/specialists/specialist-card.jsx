export default function SpecialistCard({image, full_name, tag}) {
    return (
        <div className="min-w-[250px]  max-h-[750px] max-w-[500px]">
            <img
                className='h-[500px] object-cover object-center rounded-tl-2xl rounded-tr-2xl'
                src={image}
                alt="специалист"
            />

            <div className="flex flex-col h-auto rounded-bl-2xl rounded-br-2xl justify-center items-stretch bg-[#2654DC] text-white pt-5 pb-7 pl-6 pr-6">
                <h1 className='text-[25px] font-[500] leading-[100%] tracking-[0%]'>
                    {full_name}
                </h1>

                <hr className='w-[70%] border-none bg-white rounded-2xl h-[3px] mt-4 mb-4'/>

                <p className='text-[15px] break-words font-[500] leading-[100%] tracking-[0%]'>
                    {tag}
                </p>
            </div>
        </div>
    )
}