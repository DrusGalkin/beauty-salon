import AuthForm from "./auth-form.jsx";
import StatementForm from "./statement-form.jsx";
import {Fade} from "react-awesome-reveal";
import {useEffect, useState} from "react";

export default function StatementModal({id, title, setOpen}) {
    const [reverse, setReverse] = useState(false);

    useEffect(() => {
        if (reverse) {
            const timer = setTimeout(() => {
                setOpen(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [reverse, setOpen]);

    return (
        <Fade reverse={reverse} className="fixed p-2 inset-0 z-9999">
            <div className="fixed inset-0 bg-black/50">

            </div>

            <StatementForm title={title} open={reverse} setOpen={setReverse} />
        </Fade>
    )
}