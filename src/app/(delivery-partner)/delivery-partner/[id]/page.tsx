import EditDeliveryPartner from "@/components/DriverRegister/EditDeliveryPartner";


interface IProps {
    params: {
        id: string;
    };
};

const EditDeliveryPartnerPage = async ({ params }: IProps) => {
    const { id } = await params;

    return (
        <div>
            <EditDeliveryPartner id={id} />
        </div>
    );
};

export default EditDeliveryPartnerPage;