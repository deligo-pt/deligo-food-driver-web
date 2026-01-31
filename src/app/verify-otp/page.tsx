import DeliveryPartnerVerifyOtp from '@/components/DriverRegister/DeliveryPartnerVerifyOtp';
import React from 'react';

interface IProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const VerifyOtpPage = async ({ searchParams }: IProps) => {
    const { email } = await searchParams;


    return (
        <div>
            <DeliveryPartnerVerifyOtp email={email as string} />
        </div>
    );
};

export default VerifyOtpPage;