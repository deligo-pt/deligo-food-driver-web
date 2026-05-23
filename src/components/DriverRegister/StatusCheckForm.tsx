/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Award,
    Ban,
    CircleX,
    Clock,
    LoaderCircle,
    ShieldCheck,
} from "lucide-react";
import Cookies from "js-cookie";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/hooks/use-translation";
import { postData } from "@/utils/requests";
import { deliveryPartnerValidation } from "@/validations/delivery-partner/delivery-partner.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, TruckIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { USER_STATUS } from "@/consts/user.const";
import { jwtDecode } from "jwt-decode";
import { getDeliveryPartnerDetails } from "@/services/deliveryPartner/deliveryPartner";
import { TDeliveryPartner } from "@/types/delivery-partner.type";
import { TResponse } from "@/types";
import { getDeviceInfo } from "@/utils/getDeviceInfo";

type FormData = z.infer<typeof deliveryPartnerValidation>;

const StatusItem = ({
    icon,
    title,
    description,
    success,
    danger,
}: {
    icon: React.ReactNode;
    title: string;
    description: React.ReactNode;
    success?: boolean;
    danger?: boolean;
}) => {
    const color =
        success ? "text-green-600" : danger ? "text-red-600" : "text-primary";

    return (
        <div className="flex items-start gap-4">
            <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gray-100 ${color}`}
            >
                {icon}
            </div>
            <div>
                <h4 className="font-semibold text-gray-900">{title}</h4>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                    {description}
                </p>
            </div>
        </div>
    );
};

export function StatusCheckForm() {
    const { t } = useTranslation();
    const [step, setStep] = useState(0);
    const deviceInfo = getDeviceInfo();
    const [partner, setPartner] = useState<TDeliveryPartner | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const form = useForm<FormData>({
        resolver: zodResolver(deliveryPartnerValidation),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: FormData) => {
        const toastId = toast.loading("Checking status...");

        const deviceDetails = await deviceInfo;
        const payload = {
            ...data,
            deviceDetails
        };
        try {
            const result = (await postData(
                "/auth/login",
                payload,
            )) as unknown as TResponse<any>;

            if (result.success) {
                const decoded = jwtDecode(result.data.accessToken) as {
                    userId: string;
                    role: string;
                };
                if (decoded?.role !== "DELIVERY_PARTNER") {
                    toast.error("Cannot check status without being a Delivery Partner", { id: toastId })
                    return;
                };
                toast.success(result?.message, {
                    id: toastId,
                });
                form.reset();

                Cookies.set("accessToken", result?.data?.accessToken, { expires: 0.0069 });
                Cookies.set("refreshToken", result?.data?.refreshToken, { expires: 0.0207 });

                const partnerDetails = await getDeliveryPartnerDetails(decoded?.userId);

                setPartner(partnerDetails);
                setStep(1);
            }
            else {
                toast.error(result?.message, { id: toastId })
            }
        } catch (error: any) {
            console.log(error?.message);
            toast.error(
                error?.message ? error?.message : error?.response?.data?.message || "Status checking failed",
                { id: toastId }
            );
        }
    };

    return (
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
            className="w-full"
        >
            {step === 0 && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <Card className="rounded-2xl shadow-xl border border-gray-100">
                            {/* HEADER */}
                            <CardHeader className="text-center pb-4">
                                <div className="mx-auto mb-4 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <TruckIcon className="w-6 h-6 text-primary" />
                                </div>

                                <CardTitle className="text-xl font-semibold text-gray-900">
                                    {t("check_account_status")}
                                </CardTitle>

                                <CardDescription className="text-sm text-gray-500">
                                    {t("give_credentials_check_status")}
                                </CardDescription>
                            </CardHeader>

                            {/* CONTENT */}
                            <CardContent className="space-y-6">
                                {/* EMAIL */}
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs uppercase text-gray-500">
                                                {t("email")}
                                            </FormLabel>

                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="email"
                                                        placeholder="e.g. john.doe@example.com"
                                                        className="pl-12 h-12 rounded-xl bg-gray-50 border-gray-200 focus-visible:ring-primary"
                                                    />
                                                </FormControl>
                                            </div>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* PASSWORD */}
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs uppercase text-gray-500">
                                                {t("password")}
                                            </FormLabel>

                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
                                                >
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>

                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="Enter your password"
                                                        className="pl-12 h-12 rounded-xl bg-gray-50 border-gray-200 focus-visible:ring-primary"
                                                    />
                                                </FormControl>
                                            </div>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>

                            {/* FOOTER */}
                            <CardFooter className="pt-2">
                                <Button
                                    type="submit"
                                    className="w-full h-12 rounded-xl bg-primary hover:bg-primary/95 text-white font-semibold"
                                >
                                    {t("check_status")}
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </Form>
            )}
            {step === 1 && (
                <div className="w-full flex justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-xl"
                    >
                        <Card className="rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                            {/* HEADER */}
                            <CardHeader className="text-center pb-6">
                                <div className="mx-auto mb-4 w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                                    {partner?.status === USER_STATUS.PENDING && (
                                        <LoaderCircle className="w-7 h-7 text-primary animate-spin" />
                                    )}
                                    {partner?.status === USER_STATUS.SUBMITTED && (
                                        <Clock className="w-7 h-7 text-primary" />
                                    )}
                                    {partner?.status === USER_STATUS.APPROVED && (
                                        <Award className="w-7 h-7 text-primary" />
                                    )}
                                    {partner?.status === USER_STATUS.REJECTED && (
                                        <CircleX className="w-7 h-7 text-primary" />
                                    )}
                                </div>

                                <CardTitle className="text-xl font-semibold text-gray-900">
                                    {partner?.status === USER_STATUS.PENDING && t("registration_pending")}
                                    {partner?.status === USER_STATUS.SUBMITTED && t("registration_completed")}
                                    {partner?.status === USER_STATUS.APPROVED && t("registration_approved")}
                                    {partner?.status === USER_STATUS.REJECTED && t("registration_rejected")}
                                </CardTitle>

                                <CardDescription className="text-sm text-gray-500 max-w-md mx-auto">
                                    {partner?.status === USER_STATUS.PENDING && t("you_didnot_submit")}
                                    {partner?.status === USER_STATUS.SUBMITTED && t("you_submitted")}
                                    {partner?.status === USER_STATUS.APPROVED && t("submission_approved")}
                                    {partner?.status === USER_STATUS.REJECTED && t("submission_rejected")}
                                </CardDescription>
                            </CardHeader>

                            {/* CONTENT */}
                            <CardContent className="space-y-6 px-6">
                                {/* STATUS DETAILS */}
                                {partner?.status === USER_STATUS.PENDING && (
                                    <StatusItem
                                        icon={<LoaderCircle className="animate-spin" />}
                                        title={t("submissionInProgress")}
                                        description={t("submissionProgressDesc")}
                                    />
                                )}

                                {partner?.status === USER_STATUS.SUBMITTED && (
                                    <>
                                        <StatusItem
                                            icon={<Clock />}
                                            title={t("reviewInProgress")}
                                            description={
                                                <>
                                                    {t("reviewInProgressDesc")}{" "}
                                                    <span className="font-semibold text-primary">
                                                        {t("hours24_48")}
                                                    </span>{" "}
                                                    {t("reviewInProgressDesc2")}
                                                </>
                                            }
                                        />

                                        <StatusItem
                                            icon={<ShieldCheck />}
                                            title={t("nextStep")}
                                            description={
                                                <>
                                                    {t("nextStepDesc")}{" "}
                                                    <span className="font-semibold text-green-600">
                                                        {t("verifiedPartner")}
                                                    </span>{" "}
                                                    {t("nextStepDesc2")}
                                                </>
                                            }
                                            success
                                        />
                                    </>
                                )}

                                {partner?.status === USER_STATUS.APPROVED && (
                                    <StatusItem
                                        icon={<ShieldCheck />}
                                        title={t("approvedByAdmin")}
                                        description={partner?.remarks || ""}
                                        success
                                    />
                                )}

                                {partner?.status === USER_STATUS.REJECTED && (
                                    <StatusItem
                                        icon={<Ban />}
                                        title={t("rejectedByAdmin")}
                                        description={partner?.remarks || ""}
                                        danger
                                    />
                                )}
                            </CardContent>

                            {/* FOOTER */}
                            <CardFooter className="px-6 pb-6">
                                <Button
                                    className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold"
                                    onClick={() => {
                                        setStep(0);
                                        Cookies.remove("accessToken");
                                        Cookies.remove("refreshToken");
                                    }}
                                >
                                    {t("check_again")}
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
}
