import './App.css'
import 'animate.css';
import {Route, Routes} from "react-router-dom";
import Header from "../widgets/header/header.jsx";
import Home from "../pages/home.jsx";
import NotFound from "../pages/not-found.jsx";
import Footer from "../widgets/footer/footer.jsx";
import Profile from "../pages/profile.jsx";
import PriceList from "../pages/price-list.jsx";
import Services from "../pages/services.jsx";
import About from "../pages/about.jsx";
import Contacts from "../pages/contacts.jsx";
import Team from "../pages/team.jsx";
import Service from "../pages/service.jsx";
import Gallery from "../pages/gallery.jsx";
import AbsoluteStatement from "../features/absolute-statement.jsx";
import ProtectedRoute from "../features/auth-route.jsx";

function App() {
    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center">
            <Header/>

            <div className='w-full min-h-screen flex-1 max-w-[1440px] '>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/services" element={<Services/>}/>
                    <Route path="/gallery" element={<Gallery/>}/>
                    <Route path="/services/:id" element={<Service/>}/>
                    <Route path="/price-list" element={<PriceList/>}/>
                    <Route path="/team" element={<Team/>}/>
                    <Route path="/about" element={<About/>}/>
                    <Route path="/contacts" element={<Contacts/>}/>
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile/>
                            </ProtectedRoute>
                        }
                    />
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
                {
                    window.location.href === 'http://localhost:5173/profile'
                        ? null
                        : <AbsoluteStatement/>
                }
            </div>

            <Footer/>
        </div>
    )
}

export default App
