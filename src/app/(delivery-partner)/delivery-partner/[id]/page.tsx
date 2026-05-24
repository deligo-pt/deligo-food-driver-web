import EditDeliveryPartner from "@/components/DriverRegister/EditDeliveryPartner";
import { getDeliveryPartnerDetails } from "@/services/deliveryPartner/deliveryPartner";


interface IProps {
    params: {
        id: string;
    };
};

const EditDeliveryPartnerPage = async ({ params }: IProps) => {
    const { id } = await params;
    const partnerDetails = await getDeliveryPartnerDetails(id);

    return (
        <div>
            <EditDeliveryPartner partnerDetails={partnerDetails || {}} />
        </div>
    );
};

export default EditDeliveryPartnerPage;