"use client";

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
import { personalInfoValidation } from "@/validations/edit-delivery-partner/personal-info.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import parsePhoneNumberFromString from "libphonenumber-js";
import {
  ArrowRightIcon,
  CalendarIcon,
  FlagIcon,
  IdCardIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
} from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { PhoneInput } from "react-international-phone";
import { toast } from "sonner";
import { z } from "zod";
import { DatePicker } from "../common/DatePicker";

type FormData = z.infer<typeof personalInfoValidation>;

interface IProps {
  onNext: () => void;
  id: string;
}

export function PersonalInfoForm({ onNext, id }: IProps) {
  const { t } = useTranslation();
  const form = useForm<FormData>({
    resolver: zodResolver(personalInfoValidation),
    defaultValues: {
      firstName: "",
      lastName: "",
      prefixPhoneNumber: "",
      phoneNumber: "",
      dateOfBirth: "",
      nationality: "",
      gender: "MALE",
      nifNumber: "",
      passportNumber: "",
      street: "",
      city: "",
      postalCode: "",
      state: "",
      country: "",
    },
  });

  const onSubmit = async (values: FormData) => {
    const toastId = toast.loading("Updating Delivery Partner details...");

    try {
      const payload = {
        name: {
          firstName: values.firstName,
          lastName: values.lastName,
        },
        contactNumber: values.phoneNumber,
        personalInfo: {
          dateOfBirth: new Date(values.dateOfBirth).toISOString(),
          nationality: values.nationality,
          gender: values.gender,
          NIF: values.nifNumber,
          passportNumber: values.passportNumber,
        },
        address: {
          street: values.street,
          city: values.city,
          postalCode: values.postalCode,
          state: values.state,
          country: values.country,
        },
      };
      const result = await updatePartnerInformation(id as string, payload);

      if (result.success) {
        toast.success("Delivery Partner details updated successfully!", {
          id: toastId,
        });
        onNext();
      } else {
        toast.error(result?.message, { id: toastId })
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

      if (result.success) {
        const phone = parsePhoneNumberFromString(
          result?.data?.contactNumber || "",
        );

        form.setValue("firstName", result?.data?.name?.firstName || "");
        form.setValue("lastName", result?.data?.name?.lastName || "");
        form.setValue(
          "prefixPhoneNumber",
          (phone?.countryCallingCode && `+${phone?.countryCallingCode}`) || "",
        );
        form.setValue("phoneNumber", phone?.nationalNumber || "");
        form.setValue(
          "dateOfBirth",
          (result?.data?.personalInfo?.dateOfBirth as unknown as string) || "",
        );
        form.setValue(
          "nationality",
          result?.data?.personalInfo?.nationality || "",
        );
        form.setValue("gender", result?.data?.personalInfo?.gender || "MALE");
        form.setValue("nifNumber", result?.data?.personalInfo?.nifNumber || "");
        form.setValue(
          "passportNumber",
          result?.data?.personalInfo?.passportNumber || "",
        );
        form.setValue("street", result?.data?.address?.street || "");
        form.setValue("city", result?.data?.address?.city || "");
        form.setValue("postalCode", result?.data?.address?.postalCode || "");
        form.setValue("state", result?.data?.address?.state || "");
        form.setValue("country", result?.data?.address?.country || "");
      }
    } catch (error) {
      console.log("Error fetching delivery partner data:", error);
    }
  };

  useEffect(() => {
    (() => getPartnerData())();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          {t("personal_information")}
        </h2>
        <p className="text-gray-600">{t("please_provide_partner_details")}</p>
      </motion.div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="content-start">
                  <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center">
                      <UserIcon className="w-5 h-5 text-[#DC3173]" />
                      <span className="ml-2">{t("first_name")}</span>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g. John"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#DC3173] focus:border-[#DC3173] outline-none transition-all border-gray-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="content-start">
                  <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center">
                      <UserIcon className="w-5 h-5 text-[#DC3173]" />
                      <span className="ml-2">{t("last_name")}</span>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g. Doe"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#DC3173] focus:border-[#DC3173] outline-none transition-all border-gray-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="relative">
              <div className="flex items-center text-sm font-medium text-gray-700 mb-3">
                <PhoneIcon className="w-5 h-5 text-[#DC3173]" />
                <span className="ml-2">{t("phone_number")}</span>
              </div>
              <FormField
                control={form.control}
                name="prefixPhoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="absolute left-2 z-10">
                        <PhoneInput
                          {...field}
                          defaultCountry="pt"
                          countrySelectorStyleProps={{
                            buttonStyle: {
                              border: "none",
                              height: "36px",
                              backgroundColor: "transparent",
                            },
                          }}
                          inputStyle={{
                            marginTop: "1px",
                            border: "none",
                            height: "34px",
                            width: "48px",
                            borderRadius: "0px",
                            backgroundColor: "#ccc",
                            zIndex: "-99",
                            position: "relative",
                          }}
                          inputProps={{
                            placeholder: "Phone Number",
                            disabled: true,
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="tel"
                        className="pl-26! w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#DC3173] focus:border-[#DC3173] outline-none transition-all border-gray-300"
                        {...field}
                        onChange={(e) => {
                          const onlyDigits = e.target.value.replace(/\D/g, "");
                          field.onChange(onlyDigits);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field, fieldState }) => (
                <FormItem className="content-start">
                  <FormLabel
                    htmlFor="dateOfBirth"
                    className="block text-sm font-medium bg-background text-foreground mb-1"
                  >
                    <div className="flex items-center">
                      <CalendarIcon className="w-5 h-5 text-[#DC3173]" />
                      <span className="ml-2">{t("date_of_birth")}</span>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <DatePicker
                      inputId="dateOfBirth"
                      onChange={field.onChange}
                      value={field.value}
                      isInvalid={fieldState.invalid}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field, fieldState }) => (
                <FormItem className="content-start">
                  <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center">
                      <UserIcon className="w-5 h-5 text-[#DC3173]" />
                      <span className="ml-2">{t("gender")}</span>
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
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">{t("male")}</SelectItem>
                        <SelectItem value="FEMALE">{t("female")}</SelectItem>
                        <SelectItem value="other">{t("other")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nationality"
              render={({ field }) => (
                <FormItem className="content-start">
                  <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center">
                      <FlagIcon className="w-5 h-5 text-[#DC3173]" />
                      <span className="ml-2">{t("nationality")}</span>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g. Portugese"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#DC3173] focus:border-[#DC3173] outline-none transition-all border-gray-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nifNumber"
              render={({ field }) => (
                <FormItem className="content-start">
                  <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center">
                      <IdCardIcon className="w-5 h-5 text-[#DC3173]" />
                      <span className="ml-2">{t("nif_number")}</span>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#DC3173] focus:border-[#DC3173] outline-none transition-all border-gray-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="passportNumber"
              render={({ field }) => (
                <FormItem className="content-start">
                  <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center">
                      <IdCardIcon className="w-5 h-5 text-[#DC3173]" />
                      <span className="ml-2">{t("passport_number_optional")}</span>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder=""
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#DC3173] focus:border-[#DC3173] outline-none transition-all border-gray-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem className="content-start">
                  <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center">
                      <MapPinIcon className="w-5 h-5 text-[#DC3173]" />
                      <span className="ml-2">{t("street")}</span>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder=""
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#DC3173] focus:border-[#DC3173] outline-none transition-all border-gray-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="content-start">
                  <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center">
                      <MapPinIcon className="w-5 h-5 text-[#DC3173]" />
                      <span className="ml-2">{t("city")}</span>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder=""
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#DC3173] focus:border-[#DC3173] outline-none transition-all border-gray-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem className="content-start">
                  <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center">
                      <MapPinIcon className="w-5 h-5 text-[#DC3173]" />
                      <span className="ml-2">{t("postal_code")}</span>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder=""
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#DC3173] focus:border-[#DC3173] outline-none transition-all border-gray-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem className="content-start">
                  <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center">
                      <MapPinIcon className="w-5 h-5 text-[#DC3173]" />
                      <span className="ml-2">{t("state_optional")}</span>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder=""
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#DC3173] focus:border-[#DC3173] outline-none transition-all border-gray-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem className="content-start">
                  <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center">
                      <FlagIcon className="w-5 h-5 text-[#DC3173]" />
                      <span className="ml-2">{t("country")}</span>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder=""
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#DC3173] focus:border-[#DC3173] outline-none transition-all border-gray-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* {formFields.map((field) => (
            <div
              key={field.name}
              className={
                field.type === 'textarea' || field.type === 'file'
                  ? 'col-span-1 md:col-span-2'
                  : ''
              }
            >
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor={field.name}
              >
                <div className="flex items-center">
                  {field.icon}
                  <span className="ml-2">{field.label}</span>
                  {field.required && (
                    <span className="text-[#DC3173] ml-1">*</span>
                  )}
                </div>
              </label>
              {field.type === 'file' ? (
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor={field.name}
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 border-gray-300 hover:border-[#DC3173]"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        className="w-8 h-8 mb-4 text-gray-500"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span>{' '}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        Upload front and back of your ID
                      </p>
                    </div>
                    <input
                      id={field.name}
                      type="file"
                      accept={field.accept}
                      multiple={field.multiple}
                      className="hidden"
                      {...register(field.name)}
                    />
                  </label>
                </div>
              ) : ""}
            </div>
          ))} */}
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
            {t("continue_to_legal_status")}
            <ArrowRightIcon className="w-5 h-5 ml-1" />
          </motion.button>
        </form>
      </Form>
    </div>
  );
}
