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
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/hooks/use-translation";
import { createDeliveryPartner } from "@/services/deliveryPartner/deliveryPartner";
import { deliveryPartnerValidation } from "@/validations/delivery-partner/delivery-partner.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, TruckIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

type FormData = z.infer<typeof deliveryPartnerValidation>;

export function DeliveryPartnerForm() {
    const { t } = useTranslation();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const form = useForm<FormData>({
        resolver: zodResolver(deliveryPartnerValidation),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: FormData) => {
        const toastId = toast.loading("Creating Delivery Partner...");

        try {
            // const result = await createDeliveryPartner(data as FormData);

            // if (result.success) {
            //     toast.success("Delivery Partner created successfully!", {
            //         id: toastId,
            //     });
            //     form.reset();

            //     router.push(`/verify-otp?email=mdmorshed0187@gmail.com`);
            //     // router.push(`/verify-otp?email=${result?.data?.email}`);
            //     // onSuccess(result?.data?.email || "");
            // } else {
            //     toast.error(result?.message, { id: toastId })
            // }
            router.push(`/verify-otp?email=mdmorshed0187@gmail.com`);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message || "Delivery Partner creation failed",
                { id: toastId }
            );
            console.log(error);
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
            <Form {...form}>
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
                                {t("delivery_partner_registration")}
                            </CardTitle>
                            <CardDescription className="text-center">
                                {t("join_our_delivery_network")}
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
                                    {t("register_partner")}
                                </Button>
                            </motion.div>
                        </CardFooter>
                    </Card>
                </form>
            </Form>
        </motion.div>
    );
}
