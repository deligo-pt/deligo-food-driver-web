"use client";
import { CheckCircle2, Users, Info } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

const NoteSection = () => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col gap-8 lg:max-w-md">
            {/* Heading */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                    {t('join_our_delivery')} <br /> {t("network_today")}
                </h1>
                <p className="mt-4 text-gray-500 text-sm leading-relaxed">
                    {t("become_a_part_of")}
                </p>
            </div>

            {/* Feature List */}
            <div className="space-y-5">
                <div className="flex gap-4 items-start">
                    <div className="p-2 flex items-center justify-center rounded-lg bg-primary/10">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800 text-sm">
                            {t("easy_registration")}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            {t("complete_your_profile")}
                        </p>
                    </div>
                </div>

                <div className="flex gap-4 items-start">
                    <div className="p-2 flex items-center justify-center rounded-lg bg-primary/10">
                        <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800 text-sm">
                            {t("smart_assignment")}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            {t("be_matched")}
                        </p>
                    </div>
                </div>
            </div>

            {/* Important Note */}
            <div className="bg-primary/10 border border-primary/10 rounded-xl p-4 flex gap-3">
                <Info className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                <div>
                    <h4 className="text-xs font-semibold text-gray-600 tracking-wide">
                        {t("important_note")}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                        {t("if_fleet_manager_available")}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NoteSection;
