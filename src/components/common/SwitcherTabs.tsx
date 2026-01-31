'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

const SwitcherTabs = () => {
    const pathname = usePathname();
    const links = [
        {
            href: "/driver-register",
            label: "Driver Registration Form",
        },
        {
            href: "/status-check",
            label: "Status Check"
        }
    ];

    return (
        <div className="bg-primary/10 p-5 flex flex-row items-center justify-center gap-5 w-[70%] mx-auto rounded-lg">
            {
                links.map(link => {
                    const isActive = pathname === link.href;

                    return (
                        <Link key={link.href} href={link.href}
                            className={isActive ? "text-primary font-semibold border-b border-primary/50 rounded-lg p-2 w-full text-center" : "text-secondary p-2 font-semibold w-full text-center"}
                        >
                            {link.label}
                        </Link>
                    )
                })
            }

        </div>
    );
};

export default SwitcherTabs;