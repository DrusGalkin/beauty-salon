import MailBlock from "../widgets/main-block/main-block.jsx";
import EntryForm from "../widgets/entry-form/entry-form-block.jsx";
import GalleryBlock from "../widgets/gallery/gallery-block.jsx";
import SpecialistsBlock from "../widgets/specialists/specialists-block.jsx";
import Services from "../widgets/services/services.jsx";
import Locations from "../widgets/location/location.jsx";
import About from "../widgets/about/about.jsx";

export default function Home() {
    return (
        <div className='p-1'>
            <MailBlock/>
            <Services/>
            <EntryForm/>
            <SpecialistsBlock/>
            <About/>
            <GalleryBlock/>
            <Locations/>
        </div>
    )
}