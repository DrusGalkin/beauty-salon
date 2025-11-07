import AuthForm from "./auth-form.jsx";
import {useEffect, useState} from "react";
import {Fade} from "react-awesome-reveal";

export default function AuthModal({setState, isRoute}) {

    const [reverse, setReverse] = useState(false);

    useEffect(() => {
        if (reverse) {
            const timer = setTimeout(() => {
                setState(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [reverse, setState]);

    return (
        <Fade reverse={reverse} className="fixed inset-0 z-9999">
            <div className="absolute inset-0 bg-black/50"></div>

            <AuthForm setState={setReverse} isRoute={isRoute}/>
        </Fade>
    )
}