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
        mode: "onChange",
    });

    const onSubmit = async (data: FormData) => {
        const toastId = toast.loading("Creating account...");

        try {
            const result = await createDeliveryPartner(data);

            if (result.success) {
                toast.success(result.message, { id: toastId });
                router.push(`/verify-otp?email=${result.data.email}`);
            } else {
                toast.error(result.message, { id: toastId });
            }
        } catch (err: any) {
            toast.error("Something went wrong", { id: toastId });
            console.log(err);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full lg:max-w-md"
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <Card className="rounded-2xl shadow-xl border border-gray-100">
                        {/* HEADER */}
                        <CardHeader className="text-center pb-4">
                            <div className="mx-auto mb-4 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                <TruckIcon className="w-6 h-6 text-primary" />
                            </div>

                            <CardTitle className="text-xl font-semibold text-gray-900">
                                {t("create_an_account")}
                            </CardTitle>
                            <CardDescription className="text-sm text-gray-500">
                                {t("enter_details_start_application")}
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
                                        <FormLabel className="text-xs text-gray-500">
                                            {t("email_address")}
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
                                        <FormLabel className="text-xs text-gray-500">
                                            {t("secure_password")}
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
                                                    placeholder="Min. 8 characters"
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
                                className="w-full h-12 rounded-xl bg-primary text-white font-semibold"
                                disabled={!form.formState.isValid}
                            >
                                {t("continue")}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </Form>
        </motion.div>
    );
}
