'use client';

import { useTranslation } from "@/hooks/use-translation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from 'framer-motion';
import { Button } from "../ui/button";

const SwitcherTabs = () => {
    const { t } = useTranslation();
    const pathname = usePathname();
    const links = [
        {
            href: "/rider-registration",
            label: t("rider_registration_form"),
        },
        {
            href: "/status-check",
            label: t("status_check"),
        }
    ];
    const go_back_action = pathname === '/rider-registration' || pathname === '/verify-otp' || pathname === '/status-check';

    return (
        <div className="w-[95%] md:w-[90%] lg:w-[70%] mx-auto ">
            {go_back_action && <div className="bg-primary/10 p-5 flex flex-col md:flex-row items-center justify-center gap-5 rounded-lg w-full">
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
            </div>}
            {pathname === "/rider-registration" && (
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.5,
                    }}
                    className="bg-primary/10 p-5 rounded-lg w-full text-primary italic mt-3">
                    <h2 className="text-lg font-semibold">{t("note")} : </h2>
                    <p className="text-sm">
                        - {t("you_man_register_using_rider_form")}
                    </p>
                    <p className="text-sm">
                        - {t("if_fleet_manager_available")}
                    </p>
                    <p className="text-sm">
                        - {t("if_fleet_manager_is_not_available")}
                    </p>
                </motion.div>
            )}
            {
                !go_back_action && (
                    <div className="bg-primary/10 p-5 flex flex-col md:flex-row items-center justify-start gap-5 rounded-lg w-full font-semibold">
                        <Button variant="default">
                            <Link href="/rider-registration">
                                Go to Home
                            </Link>
                        </Button>
                    </div>
                )
            }
        </div>
    );
};

export default SwitcherTabs;