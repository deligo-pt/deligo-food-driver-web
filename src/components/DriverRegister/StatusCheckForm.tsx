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
    CheckCircle2,
    CircleX,
    Clock,
    LoaderCircle,
    LoaderIcon,
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
import { useRouter } from "next/navigation";

type FormData = z.infer<typeof deliveryPartnerValidation>;

export function StatusCheckForm() {
    const { t } = useTranslation();
    const router = useRouter();
    const [step, setStep] = useState(0);
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

        try {
            const result = (await postData(
                "/auth/login",
                data,
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
            console.log(error);
            toast.error(
                error?.response?.data?.message || error?.meessage || "Status checking failed",
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
            {step === 0 && <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <Card className="border-[#DC3173]/20 shadow-lg py-0">
                        <CardHeader className="bg-linear-to-r from-[#DC3173]/10 to-[#DC3173]/5 rounded-t-lg py-6">
                            <div className="flex justify-center mb-2">
                                <motion.div
                                    initial={{
                                        scale: 0,
                                    }}
                                    animate={{
                                        scale: 1,
                                    }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 260,
                                        damping: 20,
                                    }}
                                    className="w-12 h-12 rounded-full bg-[#DC3173]/10 flex items-center justify-center"
                                >
                                    <TruckIcon className="w-6 h-6 text-[#DC3173]" />
                                </motion.div>
                            </div>
                            <CardTitle className="text-center text-[#DC3173]">
                                {t("check_account_status")}
                            </CardTitle>
                            <CardDescription className="text-center">
                                {t("give_credentials_check_status")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="space-y-4"
                            >
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="email">{t("email")}</FormLabel>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                                    <Mail className="absolute top-1/2 left-1 transform -translate-y-1/2  w-5 h-5 text-[#DC3173]" />
                                                </div>
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        placeholder="e.g. john.doe@example.com"
                                                        className="pl-12 pr-4 py-3 text-base focus-visible:ring-2 focus-visible:ring-[#DC3173] focus:ring focus:ring-[#DC3173]/20 focus:border-[#DC3173] transition-all duration-300"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="password">{t("password")}</FormLabel>
                                            <div className="relative">
                                                <FormLabel className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                                    <Lock className="absolute top-1/2 left-1 transform -translate-y-1/2 w-5 h-5 text-[#DC3173]" />
                                                </FormLabel>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-[#DC3173] transition-colors"
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="w-5 h-5" />
                                                    ) : (
                                                        <Eye className="w-5 h-5" />
                                                    )}
                                                </button>
                                                <FormControl>
                                                    <Input
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="Enter a secure password"
                                                        className="pl-12 pr-4 py-3 text-base focus-visible:ring-2 focus-visible:ring-[#DC3173] focus:ring focus:ring-[#DC3173]/20 focus:border-[#DC3173] transition-all duration-300"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </motion.div>
                        </CardContent>
                        <CardFooter className="flex justify-between pb-6">
                            <motion.div
                                whileHover={{
                                    scale: 1.05,
                                }}
                                whileTap={{
                                    scale: 0.95,
                                }}
                            >
                                <Button
                                    type="submit"
                                    className="bg-[#DC3173] hover:bg-[#DC3173]/90"
                                >
                                    {t("check_status")}
                                </Button>
                            </motion.div>
                        </CardFooter>
                    </Card>
                </form>
            </Form>}
            {step === 1 && (
                <div className="flex items-center justify-center bg-linear-to-br from-white via-pink-50 to-[#DC3173]/10 rounded-lg px-4 py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="w-full max-w-2xl"
                    >
                        <Card className="rounded-3xl shadow-2xl border border-[#DC3173]/20 overflow-hidden backdrop-blur-sm bg-white/90">
                            <CardHeader className="bg-linear-to-r from-[#DC3173] to-pink-600 text-white p-6">
                                <div className="flex items-center gap-4">
                                    <div className="rounded-xl bg-white/20 p-3">
                                        {partner?.status === USER_STATUS.PENDING && (
                                            <LoaderIcon className="w-7 h-7 text-white" />
                                        )}
                                        {partner?.status === USER_STATUS.SUBMITTED && (
                                            <CheckCircle2 className="w-7 h-7 text-white" />
                                        )}
                                        {partner?.status === USER_STATUS.APPROVED && (
                                            <Award className="w-7 h-7 text-white" />
                                        )}
                                        {partner?.status === USER_STATUS.REJECTED && (
                                            <CircleX className="w-7 h-7 text-white" />
                                        )}
                                    </div>
                                    <CardTitle className="text-2xl font-bold tracking-wide">
                                        {partner?.status === USER_STATUS.PENDING && t("registration_pending")}
                                        {partner?.status === USER_STATUS.SUBMITTED && t("registration_completed")}
                                        {partner?.status === USER_STATUS.APPROVED && t("registration_approved")}
                                        {partner?.status === USER_STATUS.REJECTED && t("registration_rejected")}
                                    </CardTitle>
                                </div>
                                <p className="mt-2 text-sm text-white/90 max-w-xl">
                                    {partner?.status === USER_STATUS.PENDING && t("you_didnot_submit")}
                                    {partner?.status === USER_STATUS.SUBMITTED && t("you_submitted")}
                                    {partner?.status === USER_STATUS.APPROVED && t("submission_approved")}
                                    {partner?.status === USER_STATUS.REJECTED && t("submission_rejected")}
                                </p>
                            </CardHeader>

                            <CardContent className="p-8 space-y-8">
                                {partner?.status === USER_STATUS.PENDING && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="flex flex-col sm:flex-row items-center sm:items-start gap-6"
                                    >
                                        <div className="rounded-full bg-[#DC3173]/10 p-4">
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ repeat: Infinity, duration: 1 }}
                                            >
                                                <LoaderCircle className="w-10 h-10 text-[#DC3173]" />
                                            </motion.div>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800">
                                                {t("submissionInProgress")}
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                                                {t("submissionProgressDesc")}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                                {partner?.status === USER_STATUS.SUBMITTED && (
                                    <>
                                        <motion.div
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                            className="flex flex-col sm:flex-row items-center sm:items-start gap-6"
                                        >
                                            <div className="rounded-full bg-[#DC3173]/10 p-4">
                                                <Clock className="w-10 h-10 text-[#DC3173]" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800">
                                                    {t("reviewInProgress")}
                                                </h3>
                                                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                                                    {t("reviewInProgressDesc")}{" "}
                                                    <span className="font-medium text-[#DC3173]">
                                                        {t("hours24_48")}
                                                    </span>{" "}
                                                    {t("reviewInProgressDesc2")}
                                                </p>
                                            </div>
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 }}
                                            className="flex flex-col sm:flex-row items-center sm:items-start gap-6"
                                        >
                                            <div className="rounded-full bg-green-100 p-4">
                                                <ShieldCheck className="w-10 h-10 text-green-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800">
                                                    {t("nextStep")}
                                                </h3>
                                                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                                                    {t("nextStepDesc")}{" "}
                                                    <span className="font-semibold text-green-600">
                                                        {t("verifiedPartner")}
                                                    </span>{" "}
                                                    {t("nextStepDesc2")}
                                                </p>
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                                {partner?.status === USER_STATUS.APPROVED && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="flex flex-col sm:flex-row items-center sm:items-start gap-6"
                                    >
                                        <div className="rounded-full bg-[#DC3173]/10 p-4">
                                            <ShieldCheck className="w-10 h-10 text-[#DC3173]" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800">
                                                {t('approvedByAdmin')}
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                                                {partner?.remarks || ""}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                                {partner?.status === USER_STATUS.REJECTED && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="flex flex-col sm:flex-row items-center sm:items-start gap-6"
                                    >
                                        <div className="rounded-full bg-[#DC3173]/10 p-4">
                                            <Ban className="w-10 h-10 text-[#DC3173]" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800">
                                                {t("rejectedByAdmin")}
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                                                {partner?.remarks || ""}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}

                                <motion.div
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="pt-6 text-center"
                                >
                                    {partner?.status === USER_STATUS.PENDING && (
                                        <>
                                            <Button
                                                className="px-8 py-3 bg-[#DC3173] hover:bg-[#b72a63] text-white rounded-xl text-lg font-medium shadow-lg transition-all duration-300"
                                                onClick={() => {
                                                    setStep(0);
                                                    router.refresh()
                                                    Cookies.remove("accessToken");
                                                    Cookies.remove("refreshToken");
                                                }}
                                            >
                                                {t("check_again")}
                                            </Button>
                                            <p className="text-xs text-gray-500 mt-3">
                                                {t("applicationStatus")}
                                            </p>
                                        </>
                                    )}
                                    {partner?.status === USER_STATUS.SUBMITTED && (
                                        <>
                                            <Button
                                                className="px-8 py-3 bg-[#DC3173] hover:bg-[#b72a63] text-white rounded-xl text-lg font-medium shadow-lg transition-all duration-300"
                                                onClick={() => {
                                                    setStep(0);
                                                    Cookies.remove("accessToken");
                                                    Cookies.remove("refreshToken");
                                                }}
                                            >
                                                {t("check_again")}
                                            </Button>

                                            <p className="text-xs text-gray-500 mt-3">
                                                {t("applicationApproved")}
                                            </p>
                                        </>
                                    )}
                                    {partner?.status === USER_STATUS.APPROVED && (
                                        <>
                                            <Button
                                                className="px-8 py-3 bg-[#DC3173] hover:bg-[#b72a63] text-white rounded-xl text-lg font-medium shadow-lg transition-all duration-300"
                                                onClick={() => {
                                                    setStep(0);
                                                    Cookies.remove("accessToken");
                                                    Cookies.remove("refreshToken");
                                                }}
                                            >
                                                {t("check_again")}
                                            </Button>

                                            <p className="text-xs text-gray-500 mt-3">
                                                {t("loginAgainDesc")}
                                            </p>
                                        </>
                                    )}
                                    {partner?.status === USER_STATUS.REJECTED && (
                                        <>
                                            <Button
                                                className="px-8 py-3 bg-[#DC3173] hover:bg-[#b72a63] text-white rounded-xl text-lg font-medium shadow-lg transition-all duration-300"
                                                onClick={() => {
                                                    setStep(0);
                                                    Cookies.remove("accessToken");
                                                    Cookies.remove("refreshToken");
                                                }}
                                            >
                                                {t("check_again")}
                                            </Button>

                                            <p className="text-xs text-gray-500 mt-3">
                                                {t("applicationTryAgain")}
                                            </p>
                                        </>
                                    )}
                                </motion.div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
}
