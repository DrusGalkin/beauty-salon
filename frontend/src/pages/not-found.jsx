import Header from "../widgets/header/header.jsx";
import Home from "./home.jsx";

export default function NotFound() {
    return (
        <div className='w-full flex flex-col items-center text-gray-400 justify-center  h-[300px]'>
            <div className="flex flex-col items-center justify-center">
                <h1 className='text-[100px]'>
                    404
                </h1>
                <h1>Страница не найдена ;(</h1>
            </div>
        </div>
    )
}