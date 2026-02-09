import NoteSection from '@/components/common/NoteSection';
import DeliveryPartnerVerifyOtp from '@/components/DriverRegister/DeliveryPartnerVerifyOtp';
import React from 'react';

interface IProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const VerifyOtpPage = async ({ searchParams }: IProps) => {
    const { email } = await searchParams;


    return (
        <div className="grid grid-cols-5 gap-10 h-full w-[80%] mx-auto my-10">
            <div className="col-span-5 lg:col-span-2">
                <NoteSection />
            </div>
            <div className="col-span-5 lg:col-span-3">
                <DeliveryPartnerVerifyOtp email={email as string} />
            </div>
        </div>
    );
};

export default VerifyOtpPage;