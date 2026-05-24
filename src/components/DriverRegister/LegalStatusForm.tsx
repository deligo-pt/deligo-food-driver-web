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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";
import { getDeliveryPartnerDetails, updatePartnerInformation } from "@/services/deliveryPartner/deliveryPartner";
import { legalStatusValidation } from "@/validations/edit-delivery-partner/legal-status.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  ArrowRightIcon,
  BuildingIcon,
  CalendarIcon,
  IdCardIcon,
} from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { DatePicker } from "../common/DatePicker";

interface IProps {
  onNext: () => void;
  id: string;
}

type FormData = z.infer<typeof legalStatusValidation>;

const permitTypes = [
  "Temporary Residence",
  "Permanent Residence",
  "EU Citizen",
  "Other",
];

export function LegalStatusForm({ onNext, id }: IProps) {
  const { t } = useTranslation();
  const form = useForm<FormData>({
    resolver: zodResolver(legalStatusValidation),
    defaultValues: {
      residencePermitType: "",
      residencePermitNumber: "",
      residencePermitExpiry: "",
    },
  });

  const onSubmit = async (values: FormData) => {
    const toastId = toast.loading("Updating Delivery Partner details...");

    try {
      const payload = {
        legalStatus: {
          residencePermitType: values.residencePermitType,
          residencePermitNumber: values.residencePermitNumber,
          residencePermitExpiry: new Date(
            values.residencePermitExpiry,
          ).toISOString(),
        },
      };

      const result = await updatePartnerInformation(id as string, payload);

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

  const getPartnerData = async () => {
    try {
      const result = await getDeliveryPartnerDetails(id as string);
      console.log("legal result", result);
      if (result?._id) {
        form.setValue(
          "residencePermitType",
          result?.legalStatus?.residencePermitType || "",
        );
        form.setValue(
          "residencePermitNumber",
          result?.legalStatus?.residencePermitNumber || "",
        );
        form.setValue(
          "residencePermitExpiry",
          (result?.legalStatus
            ?.residencePermitExpiry as unknown as string) || "",
        );
      }
    } catch (error) {
      console.log("Error fetching delivery partner data:", error);
    }
  };

  useEffect(() => {
    (() => getPartnerData())();
  }, []);

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
          {t("right_to_work")} / {t("legal_status")}
        </h2>
        <p className="text-gray-600">{t("please_provide_details_partner")}</p>
      </motion.div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="residencePermitType"
              render={({ field, fieldState }) => (
                <FormItem className="content-start">
                  <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center">
                      <BuildingIcon className="w-5 h-5 text-[#DC3173]" />
                      <span className="ml-2">{t("residence_permit_type")}</span>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        className={cn(
                          "w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#DC3173] focus:border-[#DC3173] outline-none transition-all",
                          fieldState.invalid
                            ? "border-red-500"
                            : "border-gray-300",
                        )}
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {permitTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="residencePermitNumber"
              render={({ field }) => (
                <FormItem className="content-start">
                  <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center">
                      <IdCardIcon className="w-5 h-5 text-[#DC3173]" />
                      <span className="ml-2">{t("trc_number")}</span>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Residence Permit Number"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#DC3173] focus:border-[#DC3173] outline-none transition-all border-gray-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="residencePermitExpiry"
              render={({ field, fieldState }) => (
                <FormItem className="content-start">
                  <FormLabel
                    htmlFor="residencePermitExpiry"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    <div className="flex items-center">
                      <CalendarIcon className="w-5 h-5 text-[#DC3173]" />
                      <span className="ml-2">{t("trc_expiration_date")}</span>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <DatePicker
                      inputId="residencePermitExpiry"
                      onChange={field.onChange}
                      value={field.value}
                      isInvalid={fieldState.invalid}
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
            {t("continue_to_payment_details")}
            <ArrowRightIcon className="w-5 h-5 ml-1" />
          </motion.button>
        </form>
      </Form>
    </div>
  );
}
