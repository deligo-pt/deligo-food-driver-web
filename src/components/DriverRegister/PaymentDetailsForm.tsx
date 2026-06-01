'use client';

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
import { updatePartnerInformation } from "@/services/deliveryPartner/deliveryPartner";
import { TDeliveryPartner } from "@/types/delivery-partner.type";
import { paymentDetailsValidation } from "@/validations/edit-delivery-partner/payment-details.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  ArrowRightIcon,
  BuildingIcon,
  CreditCardIcon,
  UserIcon,
} from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface IProps {
  onNext: () => void;
  partner: TDeliveryPartner;
}

type FormData = z.infer<typeof paymentDetailsValidation>;

export function PaymentDetailsForm({ onNext, partner }: IProps) {
  const { t } = useTranslation();
  const form = useForm<FormData>({
    resolver: zodResolver(paymentDetailsValidation),
    defaultValues: {
      iban: "",
      bankName: "",
      swiftCode: "",
      accountHolderName: "",
    },
  });

  const onSubmit = async (values: FormData) => {
    const toastId = toast.loading("Updating Delivery Partner details...");

    try {
      const payload = {
        bankDetails: {
          iban: values.iban,
          bankName: values.bankName,
          swiftCode: values.swiftCode,
          accountHolderName: values.accountHolderName,
        },
      };

      const result = await updatePartnerInformation(partner?.userId as string, payload);

      if (result.success) {
        toast.success("Delivery Partner details updated successfully!", {
          id: toastId,
        });
        onNext();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      toast.error(
        error?.response?.data?.message ||
        "Failed to update Delivery Partner details",
        {
          id: toastId,
        },
      );
    }
  };

  useEffect(() => {
    const getPartnerData = async () => {
      try {
        if (partner?._id) {
          form.setValue("iban", partner?.bankDetails?.iban || "");
          form.setValue("bankName", partner?.bankDetails?.bankName || "");
          form.setValue("swiftCode", partner?.bankDetails?.swiftCode || "");
          form.setValue(
            "accountHolderName",
            partner?.bankDetails?.accountHolderName || "",
          );
        }
      } catch (error) {
        console.log("Error fetching delivery partner data:", error);
      }
    };

    getPartnerData();
  }, [partner, form]);

  return (
    <div>
      <motion.div
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
        }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold text-gray-800">
          {t("payment_banking_details")}
        </h2>
        <p className="text-gray-600">{t("please_provide_partner_banking")}</p>
      </motion.div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="bankName"
              render={({ field }) => (
                <FormItem className="content-start">
                  <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center">
                      <BuildingIcon className="w-5 h-5 text-[#DC3173]" />
                      <span className="ml-2">{t("bankName")}</span>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g. Santander Bank"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#DC3173] focus:border-[#DC3173] outline-none transition-all border-gray-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="accountHolderName"
              render={({ field }) => (
                <FormItem className="content-start">
                  <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center">
                      <UserIcon className="w-5 h-5 text-[#DC3173]" />
                      <span className="ml-2">{t("accountHolder")}</span>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Full name as on account"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#DC3173] focus:border-[#DC3173] outline-none transition-all border-gray-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="iban"
              render={({ field }) => (
                <FormItem className="content-start">
                  <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center">
                      <CreditCardIcon className="w-5 h-5 text-[#DC3173]" />
                      <span className="ml-2">{t("iban")}</span>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g. GB29NWBK60161331926819"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#DC3173] focus:border-[#DC3173] outline-none transition-all border-gray-300 uppercase"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="swiftCode"
              render={({ field }) => (
                <FormItem className="content-start">
                  <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center">
                      <BuildingIcon className="w-5 h-5 text-[#DC3173]" />
                      <span className="ml-2">{t("swift")} </span>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g. NWBKGB2L"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#DC3173] focus:border-[#DC3173] outline-none transition-all border-gray-300 uppercase"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-[#DC3173]/10 p-4 rounded-lg border border-[#DC3173]/20">
              <p className="text-sm text-gray-700 flex items-start">
                <svg
                  className="w-5 h-5 mr-2 text-[#DC3173] shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                {t("this_payment_information_is_secure")}
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.98,
            }}
            type="submit"
            className="mt-8 w-full bg-[#DC3173] text-white py-3 px-6 rounded-lg font-medium text-lg hover:bg-[#c21c5e] transition-colors duration-300 flex items-center justify-center"
          >
            {t("continue_to_vehicle_information")}
            <ArrowRightIcon className="w-5 h-5 ml-1" />
          </motion.button>
        </form>
      </Form>
    </div>
  );
}
