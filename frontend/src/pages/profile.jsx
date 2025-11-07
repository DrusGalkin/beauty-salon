import {useEffect, useState} from "react";
import {IsAdmin} from "../api/auth.jsx";
import AdminGUI from "../widgets/profile/admin.jsx";
import UserGUI from "../widgets/profile/user.jsx";

export default function Profile(){
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchAdminStatus = async () => {
                const res = await IsAdmin()
                setIsAdmin(res.admin)
        }

        fetchAdminStatus();
    }, [])
    return (
        <>
            {isAdmin ? <AdminGUI/> : <UserGUI/>}
        </>
    );
}