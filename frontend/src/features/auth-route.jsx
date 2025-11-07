import { useState, useEffect } from 'react';
import Loader from "./loader.jsx";
import {ValidToken} from "../api/auth.jsx";
import AuthModal from "../widgets/modals/auth.jsx";

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            await ValidToken();
            setIsAuthenticated(true);
        } catch (error) {
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loader/>;
    }

    return isAuthenticated ? children : (
        <div>
            <AuthModal setState={false} isRoute={true}/>
        </div>

    );
};

export default ProtectedRoute;