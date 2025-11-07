import {Logout} from "../../../api/auth.jsx";

export function Exit() {

    return (
        <button
            className='hover:text-red-500 cursor-pointer transition-all hover:scale-110'
            onClick={()=> Logout()}>
            Выйти
        </button>
    )
}