import NoteSection from "@/components/common/NoteSection";
import { DeliveryPartnerForm } from "@/components/DriverRegister/DeliveryPartnerForm";


const DriverRegisterPage = () => {

    return (
        <div className="grid grid-cols-5 gap-10 h-full w-[95%] md:w-[80%] mx-auto my-10">
            <div className="col-span-5 lg:col-span-2">
                <NoteSection />
            </div>
            <div className="col-span-5 lg:col-span-3">
                <DeliveryPartnerForm />
            </div>
        </div>
    );
};

export default DriverRegisterPage;