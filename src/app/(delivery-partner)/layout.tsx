import Navbar from '@/components/common/Navbar';
import SwitcherTabs from '@/components/common/SwitcherTabs';
import React from 'react';

const DeliveryPartnerLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <div className='bg-gray-50'>
            <div className="w-[95%] lg:w-7xl mx-auto space-y-3 my-16">
                <Navbar />
                <SwitcherTabs />
                <div className="min-h-screen">{children}</div>
            </div>
        </div>
    );
};

export default DeliveryPartnerLayout;