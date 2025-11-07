import React, {useEffect, useRef, useState} from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import './swiperMD.css'
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import {Slide} from "react-awesome-reveal";
import {FindAllServices, FindServicesByID} from "../../api/services.jsx";
import {GetPhotos, PHOTO_URL} from "../../api/photos.jsx";
import Loader from "../../features/loader.jsx";



const styles = {
    container: {
        width: '100%',
        height: '100%',
        marginTop: '15px',
        position: 'relative',
    },
    slide: {
        textAlign: 'center',
        height: '450px',
        color: 'white',
        background: '#678AF4',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
        alignItems: 'center',
        borderRadius: '15px',
    },
    slideImage: {
        display: 'block',
        width: '100%',
        height: 'auto',
        flex: 1,
        flexGrow: 1,
        borderBottomLeftRadius: '15px',
        borderBottomRightRadius: '15px',
        objectFit: 'cover',
    },
    navigationButton: {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 10,
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        border: 'none',
        outline: 'none',
    },
    prevButton: {
        left: '10px',
    },
    nextButton: {
        right: '10px',
    }
};

const Services = () => {
    const swiperRef = useRef(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const [service, setService] = useState([]);
    const [loading, setLoading] = useState(false);

    const GetServicesAndSet = async () => {
        try {
            setLoading(true);
            const res = await FindAllServices();
            setService(res);
        } catch (error) {
            console.log("Ошибка получения сервиса по id", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const SetImages = async () => {
        setLoading(true);
        console.log(service)
        service.map(async(el) => {
            const res = await GetPhotos(el.id);
            console.log(res);
            el.img = res[0].url
        })
        setLoading(false)
    }

    const LoadServices = async () => {
        try {
            setLoading(true);


            const services = await FindAllServices();

            const servicesWithImages = await Promise.all(
                services.map(async (el) => {
                    try {
                        const photos = await GetPhotos(el.id);
                        return {
                            ...el,
                            img: photos[0]?.url || null
                        };
                    } catch (error) {
                        console.error(`Ошибка загрузки фото для услуги ${el.id}:`, error);
                        return {
                            ...el,
                            img: null
                        };
                    }
                })
            );

            setService(servicesWithImages);

        } catch (error) {
            console.error("Ошибка загрузки услуг:", error);
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    })

    useEffect(() => {
        LoadServices()
    },[])

    if (loading) return <Loader/>;

    return (
        <Slide direction="right">
            <div style={{
                position: 'relative',
                height: '100%',
                background: '#fff',
                color: '#000',
                margin: 0,
                padding: '40px 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <div className={
                            'w-full text-start flex-wrap flex items-center justify-center'

                    }
                         >
                        <div className={
                            (windowWidth > 1328)
                                ?
                                'w-full text-start flex-wrap flex items-center justify-between'
                                :
                                "text-start flex-wrap flex items-center justify-between flex-1 max-w-[1300px] "
                        }>
                            <h1 className="text-5xl font-bold mb-4 text-gray-900">
                                Наши услуги
                            </h1>

                            <div className='flex items-center justify-between gap-5'>

                                <svg
                                    className='cursor-pointer transition-all hover:scale-110'
                                    onClick={() => swiperRef.current?.slidePrev()}
                                    width="38" height="37" viewBox="0 0 38 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13.6545 7.79852C14.298 7.17117 15.3519 7.17117 15.9954 7.79852C16.6454 8.43267 16.6454 9.48073 15.9954 10.1149L7.77954 18.1247L15.9954 26.1345C16.6458 26.7687 16.6457 27.8176 15.9954 28.4518L15.9944 28.4509C15.6679 28.7843 15.2246 28.9265 14.8245 28.9265C14.4087 28.9263 13.9863 28.7754 13.6545 28.4518L4.2522 19.2839C3.6017 18.6496 3.6017 17.6007 4.2522 16.9665L13.6545 7.79852Z" fill="#678AF4" stroke="#678AF4"/>
                                    <path d="M31.7568 16.4923C32.656 16.4924 33.4189 17.2179 33.4189 18.1251C33.4189 19.0323 32.656 19.7578 31.7568 19.7579H5.68555C4.78627 19.7579 4.02344 19.0324 4.02344 18.1251C4.02344 17.2179 4.78627 16.4923 5.68555 16.4923H31.7568Z" fill="#678AF4" stroke="#678AF4"/>
                                </svg>

                                <svg
                                    className='cursor-pointer transition-all hover:scale-110'
                                    onClick={() => swiperRef.current?.slideNext()}
                                    width="38" height="37" viewBox="0 0 38 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M24.1516 28.4514C23.5082 29.0788 22.4542 29.0788 21.8108 28.4514C21.1607 27.8173 21.1608 26.7692 21.8108 26.135L30.0266 18.1252L21.8108 10.1155C21.1604 9.48126 21.1604 8.43234 21.8108 7.79809L21.8118 7.79907C22.1383 7.46565 22.5815 7.32349 22.9817 7.32349C23.3974 7.32359 23.8198 7.47458 24.1516 7.79809L33.554 16.9661C34.2045 17.6003 34.2045 18.6492 33.554 19.2834L24.1516 28.4514Z" fill="#678AF4" stroke="#678AF4"/>
                                    <path d="M6.04932 19.7577C5.15012 19.7576 4.38721 19.0321 4.38721 18.1249C4.38721 17.2177 5.15013 16.4922 6.04932 16.4921L32.1206 16.4921C33.0199 16.4921 33.7827 17.2176 33.7827 18.1249C33.7827 19.0321 33.0199 19.7577 32.1206 19.7577L6.04932 19.7577Z" fill="#678AF4" stroke="#678AF4"/>
                                </svg>
                        </div>
                    </div>
                </div>

                <div style={{ position: 'relative', width: '100%' }}>
                    <Swiper
                        style={styles.container}
                        modules={[Pagination, Navigation]}
                        loop={true}
                        onSwiper={(swiper) => {
                            swiperRef.current = swiper;
                        }}
                        slidesPerView={1}
                        spaceBetween={10}
                        breakpoints={{
                            640: {
                                slidesPerView: 1,
                                spaceBetween: 20
                            },
                            768: {
                                slidesPerView: 2,
                                spaceBetween: 30
                            },
                            1024: {
                                slidesPerView: 3,
                                spaceBetween: 40
                            },
                            1280: {
                                slidesPerView: 4,
                                spaceBetween: 50
                            }
                        }}
                        className="mySwiper"
                    >

                        {
                            (service !== null || service !== undefined) &&
                            service.map((el, index) => (
                                <SwiperSlide key={index} style={styles.slide}>
                                    <div className='text-2xl w-full text-start p-[25px]'>
                                        <h1>{el.title}</h1>
                                    </div>
                                    <img
                                        src={`${PHOTO_URL}/${el.img}`}
                                        alt={""}
                                        style={styles.slideImage} />
                                </SwiperSlide>
                            ))
                        }


                    </Swiper>
                </div>
            </div>
        </Slide>


    );
};

export default Services;