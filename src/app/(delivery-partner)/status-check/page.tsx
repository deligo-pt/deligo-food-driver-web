import NoteSection from "@/components/common/NoteSection";
import { StatusCheckForm } from "@/components/DriverRegister/StatusCheckForm";


const StatusCheckPage = () => {
    return (
        <div className="grid grid-cols-5 gap-10 h-full w-[95%] md:w-[80%] mx-auto my-10">
            <div className="col-span-5 lg:col-span-2">
                <NoteSection />
            </div>
            <div className="col-span-5 lg:col-span-3">
                <StatusCheckForm />
            </div>
        </div>
    );
};

export default StatusCheckPage;