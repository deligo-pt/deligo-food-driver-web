'use client';

import { useTranslation } from "@/hooks/use-translation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const SwitcherTabs = () => {
    const { t } = useTranslation();
    const pathname = usePathname();

    const tabs = [
        {
            href: "/rider-registration",
            label: t("rider_registration"),
        },
        {
            href: "/status-check",
            label: t("status_check"),
        },
    ];

    const showTabs =
        pathname === "/rider-registration" ||
        pathname === "/verify-otp" ||
        pathname === "/status-check";

    return (
        <div className="w-full flex flex-col items-center mt-14">
            {showTabs && (
                <div className="relative flex gap-10 border-b border-gray-200">
                    {tabs.map((tab) => {
                        const isActive = pathname === tab.href;

                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={cn(
                                    "relative pb-3 text-sm transition-colors font-semibold",
                                    isActive
                                        ? "text-primary"
                                        : "text-gray-400 hover:text-gray-600"
                                )}
                            >
                                {tab.label}

                                {isActive && (
                                    <motion.span
                                        layoutId="active-tab"
                                        className="absolute left-0 right-0 -bottom-px h-0.5 bg-[#DC3173] rounded-full"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>
            )}

            {/* NOTE SECTION (unchanged logic, cleaner style) */}
            {/* {pathname === "/rider-registration" && (
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mt-6 w-full max-w-3xl bg-[#DC3173]/10 border border-[#DC3173]/20 rounded-xl p-4 text-[#DC3173]"
                >
                    <h2 className="text-sm font-semibold mb-1">
                        {t("note")}:
                    </h2>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                        <li>{t("you_man_register_using_rider_form")}</li>
                        <li>{t("if_fleet_manager_available")}</li>
                        <li>{t("if_fleet_manager_is_not_available")}</li>
                    </ul>
                </motion.div>
            )} */}
        </div>
    );
};

export default SwitcherTabs;
