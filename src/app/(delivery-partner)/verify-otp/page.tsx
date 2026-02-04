import DeliveryPartnerVerifyOtp from '@/components/DriverRegister/DeliveryPartnerVerifyOtp';
import React from 'react';

interface IProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const VerifyOtpPage = async ({ searchParams }: IProps) => {
    const { email } = await searchParams;


    return (
        <div className='w-[95%] md:w-[90%] lg:w-[70%] mx-auto'>
            <DeliveryPartnerVerifyOtp email={email as string} />
        </div>
    );
};

export default VerifyOtpPage;