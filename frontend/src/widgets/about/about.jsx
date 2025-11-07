import image from './../../images/about_photo.png'
import {useEffect, useState} from "react";
import {Fade, Slide} from "react-awesome-reveal";

const About = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    })

    return (
        <Slide direction='right'>
            <div>
                <div className=
                         {
                             (windowWidth > 1328)
                                 ?
                                 "relative mt-[100px] flex w-full mb-[50px]"
                                 :
                                 "relative mt-[100px] justify-center items-center flex w-full mb-[50px]"
                         }
                >

                    {
                        (windowWidth > 1328)
                            ?
                            <img
                                className='absolute z-50 top-[-118px] w-[750px] h-[540px]'
                                src={image}
                                alt=""/>
                            : null
                    }


                    <div className=
                             {
                                 (windowWidth > 1328)
                                     ?
                                     "rounded-4xl w-full flex justify-between items-center relative bg-[#2654DC] h-[422px]"
                                     :
                                     "rounded-4xl  flex  max-w-[800px] justify-center flex-col-reverse items-center relative bg-[#2654DC]"
                             }>
                        <div>
                            {
                                (windowWidth < 1328)
                                    ?
                                    <img
                                        className='w-full max-w-[800px] h-[540px] object-cover'
                                        src={image}
                                        alt=""/>

                                    : null
                            }
                        </div>


                        <div className="text-white p-5">
                            <div>
                                <h1 className=
                                        {
                                            (windowWidth > 1328)
                                                ?
                                                'font-bold text-4xl'

                                                : 'font-bold text-6xl mt-2'
                                        }>
                                    О нас
                                </h1>
                            </div>


                            <div className="w-full max-w-[650px] text-2xl mt-[30px]">
                                Добро пожаловать в наш салон красоты, где мы предлагаем широкий спектр услуг для мужчин и
                                женщин! Наша цель — создать атмосферу уюта и комфорта, где каждый клиент сможет расслабиться и
                                насладиться процедурами, направленными на улучшение внешнего вида и самочувствия.
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </Slide>


    )
}

export default About