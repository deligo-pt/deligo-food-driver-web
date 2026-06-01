'use client';

import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useTranslation } from "@/hooks/use-translation";
import { updatePartnerInformation } from "@/services/deliveryPartner/deliveryPartner";
import { backgroundCheckValidation } from "@/validations/edit-delivery-partner/background-check.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowRightIcon, CalendarIcon, ShieldCheckIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { DatePicker } from "../common/DatePicker";
import { TDeliveryPartner } from "@/types/delivery-partner.type";

type FormData = z.infer<typeof backgroundCheckValidation>;

interface IProps {
  onNext: () => void;
  partner: TDeliveryPartner;
}

export function BackgroundCheckForm({ onNext, partner }: IProps) {
  const { t } = useTranslation();
  const form = useForm({
    resolver: zodResolver(backgroundCheckValidation),
    defaultValues: {
      haveCriminalRecordCertificate: false,
      issueDate: "",
      expiryDate: "",
    },
  });

  const hasCertificate = form.watch("haveCriminalRecordCertificate");

  const onSubmit = async (values: FormData) => {
    const toastId = toast.loading("Updating Delivery Partner details...");

    try {
      const payload = {
        criminalRecord: {
          certificate: values.haveCriminalRecordCertificate,
          ...(values.haveCriminalRecordCertificate && {
            issueDate: new Date(values.issueDate || "").toISOString(),
            expiryDate: new Date(values.expiryDate || "").toISOString(),
          }),
        },
      };
      if (
        !values.haveCriminalRecordCertificate &&
        payload?.criminalRecord?.issueDate && payload?.criminalRecord?.expiryDate
      ) {
        delete payload?.criminalRecord?.issueDate;
        delete payload?.criminalRecord?.expiryDate;
      }
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
          form.setValue(
            "haveCriminalRecordCertificate",
            partner?.criminalRecord?.certificate || false,
          );
          form.setValue(
            "issueDate",
            (partner?.criminalRecord?.issueDate as unknown as string) || "",
          );
          form.setValue(
            "expiryDate",
            (partner?.criminalRecord?.expiryDate as unknown as string) || "",
          );
        }
      } catch (error) {
        console.log("Error fetching delivery partner data:", error);
      }
    };

    getPartnerData();
  }, [partner]);


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
          {t("criminal_background_check")}
        </h2>
        <p className="text-gray-600">
          {t("provide_delivery_partner_criminal")}
        </p>
      </motion.div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <div className="bg-[#DC3173]/10 p-4 rounded-lg border border-[#DC3173]/20 mb-6">
              <div className="flex items-start">
                <ShieldCheckIcon className="w-5 h-5 text-[#DC3173] mt-1 mr-3 shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-800">
                    {t("background_check_requirement")}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {t("portugal_food_delivery")}
                  </p>
                  <ul className="text-sm text-gray-600 mt-2 list-disc list-inside space-y-1">
                    <li>
                      {t("online_at")}{" "}
                      <span className="font-medium">{t("justica_gov")}</span>
                    </li>
                    <li>{t("civil_registry")}</li>
                    <li>{t("citizen_shops")}</li>
                  </ul>
                </div>
              </div>
            </div>
            <FormField
              control={form.control}
              name="haveCriminalRecordCertificate"
              render={({ field }) => (
                <FormItem className="content-start">
                  <FormLabel
                    htmlFor="haveCriminalRecordCertificate"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    <div className="flex items-center">
                      <ShieldCheckIcon className="w-5 h-5 text-[#DC3173]" />
                      <span className="ml-2">
                        {t("have_criminal_record_certificate")}
                      </span>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <FormLabel
                      htmlFor="haveCriminalRecordCertificate"
                      className="text-sm text-gray-700 flex items-center"
                    >
                      <Checkbox
                        id="haveCriminalRecordCertificate"
                        checked={!!field.value}
                        onCheckedChange={(checked) => field.onChange(checked)}
                        className="h-4 w-4 text-[#DC3173] focus:ring-[#DC3173] border-gray-300 rounded data-[state=checked]:bg-[#DC3173] data-[state=checked]:border-[#DC3173]"
                      />
                      {t("criminal_record_certificate")}
                    </FormLabel>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="issueDate"
              render={({ field, fieldState }) => (
                <FormItem className="content-start">
                  <FormLabel
                    htmlFor="issueDate"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    <div className="flex items-center">
                      <CalendarIcon className="w-5 h-5 text-[#DC3173]" />
                      <span className="ml-2">
                        {t("certificate_issue_date")}
                      </span>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <DatePicker
                      inputId="issueDate"
                      onChange={field.onChange}
                      value={field.value as unknown as string}
                      isInvalid={fieldState.invalid}
                      disabled={!hasCertificate}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field, fieldState }) => (
                <FormItem className="content-start">
                  <FormLabel
                    htmlFor="expiryDate"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    <div className="flex items-center">
                      <CalendarIcon className="w-5 h-5 text-[#DC3173]" />
                      <span className="ml-2">
                        {t("certificate_expiry_date")}
                      </span>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <DatePicker
                      inputId="expiryDate"
                      onChange={field.onChange}
                      value={field.value as string}
                      isInvalid={fieldState.invalid}
                      disabled={!hasCertificate}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            {t("continue_to_equipment")}
            <ArrowRightIcon className="w-5 h-5 ml-1" />
          </motion.button>
        </form>
      </Form>
    </div>
  );
}
