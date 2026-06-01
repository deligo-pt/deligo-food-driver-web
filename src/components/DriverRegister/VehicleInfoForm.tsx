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
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/hooks/use-translation";
import { updatePartnerInformation } from "@/services/deliveryPartner/deliveryPartner";
import { vehicleInfoValidation } from "@/validations/edit-delivery-partner/vehicle-info.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  ArrowRightIcon,
  BikeIcon,
  CalendarIcon,
  CarIcon,
  MotorbikeIcon,
  TruckIcon,
} from "lucide-react";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { DatePicker } from "../common/DatePicker";
import { TDeliveryPartner } from "@/types/delivery-partner.type";

interface IProps {
  onNext: () => void;
  partner: TDeliveryPartner;
}

type FormData = z.infer<typeof vehicleInfoValidation>;

export function VehicleInfoForm({ onNext, partner }: IProps) {
  const { t } = useTranslation();
  const form = useForm<FormData>({
    resolver: zodResolver(vehicleInfoValidation),
    defaultValues: {
      vehicleType: "MOTORBIKE",
      brand: "",
      model: "",
      licensePlate: "",
      drivingLicenseNumber: "",
      drivingLicenseExpiry: "",
      insurancePolicyNumber: "",
      insuranceExpiry: "",
    },
  });

  const watchVehicleType = useWatch({
    control: form.control,
    name: "vehicleType",
  });

  const onSubmit = async (values: FormData) => {
    const toastId = toast.loading("Updating Delivery Partner details...");

    try {
      const payload = {
        vehicleInfo:
          values.vehicleType === "BICYCLE" || values.vehicleType === "E-BIKE"
            ? {
              vehicleType: values.vehicleType,
              brand: values.brand,
              model: values.model,
            }
            : {
              vehicleType: values.vehicleType,
              brand: values.brand,
              model: values.model,
              licensePlate: values.licensePlate,
              drivingLicenseNumber: values.drivingLicenseNumber,
              drivingLicenseExpiry: new Date(values.drivingLicenseExpiry).toISOString(),
              insurancePolicyNumber: values.insurancePolicyNumber,
              insuranceExpiry: new Date(values.insuranceExpiry).toISOString(),
            },
      };

      const result = await updatePartnerInformation(partner?.userId as string, payload);

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

  const vehicleOptions = [
    {
      id: "bicycle",
      label: t("bicycle"),
      icon: <BikeIcon className="w-6 h-6" />,
      value: "BICYCLE",
    },
    {
      id: "ebike",
      label: t("e_bike"),
      icon: <BikeIcon className="w-6 h-6" />,
      value: "E-BIKE",
    },
    {
      id: "scooter",
      label: t("scooter"),
      icon: <BikeIcon className="w-6 h-6" />,
      value: "SCOOTER",
    },
    {
      id: "motorbike",
      label: t("motorbike"),
      icon: <MotorbikeIcon className="w-6 h-6" />,
      value: "MOTORBIKE",
    },
    {
      id: "car",
      label: t("car"),
      icon: <CarIcon className="w-6 h-6" />,
      value: "CAR",
    },
  ];

  useEffect(() => {
    const getPartnerData = async () => {
      try {
        if (partner?._id) {
          form.setValue(
            "vehicleType",
            partner?.vehicleInfo?.vehicleType || "MOTORBIKE",
          );
          form.setValue("brand", partner?.vehicleInfo?.brand || "");
          form.setValue("model", partner?.vehicleInfo?.model || "");
          form.setValue(
            "licensePlate",
            partner?.vehicleInfo?.licensePlate || "",
          );
          form.setValue(
            "drivingLicenseNumber",
            partner?.vehicleInfo?.drivingLicenseNumber || "",
          );
          form.setValue(
            "drivingLicenseExpiry",
            (partner?.vehicleInfo
              ?.drivingLicenseExpiry as unknown as string) || "",
          );
          form.setValue(
            "insurancePolicyNumber",
            partner?.vehicleInfo?.insurancePolicyNumber || "",
          );
          form.setValue(
            "insuranceExpiry",
            (partner?.vehicleInfo?.insuranceExpiry as unknown as string) ||
            "",
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
          {t("vehicle_information")}
        </h2>
        <p className="text-gray-600">{t("please_provide_details_about")}</p>
      </motion.div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <FormField
              control={form.control}
              name="vehicleType"
              render={({ field }) => (
                <FormItem className="content-start">
                  <div className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center">
                      <CarIcon className="w-5 h-5 text-[#DC3173]" />
                      <span className="ml-2">{t("vehicle_type")}</span>
                    </div>
                  </div>
                  <FormControl>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                      {vehicleOptions.map((option) => (
                        <Label
                          key={option.id}
                          htmlFor={option.id}
                          className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all ${watchVehicleType === option.value
                            ? "bg-[#DC3173]/10 border-[#DC3173]"
                            : "bg-white border-gray-200 hover:border-[#DC3173]/50"
                            }`}
                          onClick={() => field.onChange(option.value)}
                        >
                          <Input
                            type="radio"
                            id={option.id}
                            {...field}
                            value={option.value}
                            checked={watchVehicleType === option.value}
                            className="hidden"
                          />
                          <div
                            className={`rounded-full p-3 mb-2 ${watchVehicleType === option.value
                              ? "bg-[#DC3173] text-white"
                              : "bg-gray-100 text-gray-500"
                              }`}
                          >
                            {option.icon}
                          </div>
                          <span
                            className={`font-medium ${watchVehicleType === option.value
                              ? "text-[#DC3173]"
                              : "text-gray-700"
                              }`}
                          >
                            {option.label}
                          </span>
                        </Label>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!!watchVehicleType && (
              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  duration: 0.5,
                }}
              >
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem className="content-start">
                        <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                          <div className="flex items-center">
                            <TruckIcon className="w-5 h-5 text-[#DC3173]" />
                            <span className="ml-2">{t("brand")}</span>
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
                    name="model"
                    render={({ field }) => (
                      <FormItem className="content-start">
                        <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                          <div className="flex items-center">
                            <TruckIcon className="w-5 h-5 text-[#DC3173]" />
                            <span className="ml-2">{t("model")}</span>
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

                  {(watchVehicleType === "CAR" ||
                    watchVehicleType === "SCOOTER" ||
                    watchVehicleType === "MOTORBIKE") && (
                      <>
                        <FormField
                          control={form.control}
                          name="licensePlate"
                          render={({ field }) => (
                            <FormItem className="content-start">
                              <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                                <div className="flex items-center">
                                  <TruckIcon className="w-5 h-5 text-[#DC3173]" />
                                  <span className="ml-2">
                                    {t("license_plate")}
                                  </span>
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
                          name="drivingLicenseNumber"
                          render={({ field }) => (
                            <FormItem className="content-start">
                              <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                                <div className="flex items-center">
                                  <TruckIcon className="w-5 h-5 text-[#DC3173]" />
                                  <span className="ml-2">
                                    {t("driving_license_number")}
                                  </span>
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
                          name="drivingLicenseExpiry"
                          render={({ field, fieldState }) => (
                            <FormItem className="content-start">
                              <FormLabel
                                htmlFor="drivingLicenseExpiry"
                                className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                <div className="flex items-center">
                                  <CalendarIcon className="w-5 h-5 text-[#DC3173]" />
                                  <span className="ml-2">
                                    {t("driving_license_expiry")}
                                  </span>
                                </div>
                              </FormLabel>
                              <FormControl>
                                <DatePicker
                                  inputId="drivingLicenseExpiry"
                                  onChange={field.onChange}
                                  value={field.value || ""}
                                  isInvalid={fieldState.invalid}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="insurancePolicyNumber"
                          render={({ field }) => (
                            <FormItem className="content-start">
                              <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                                <div className="flex items-center">
                                  <TruckIcon className="w-5 h-5 text-[#DC3173]" />
                                  <span className="ml-2">
                                    {t("insurance_policy_number")}
                                  </span>
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
                          name="insuranceExpiry"
                          render={({ field, fieldState }) => (
                            <FormItem className="content-start">
                              <FormLabel
                                htmlFor="insuranceExpiry"
                                className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                <div className="flex items-center">
                                  <CalendarIcon className="w-5 h-5 text-[#DC3173]" />
                                  <span className="ml-2">
                                    {t("insurance_expiry")}
                                  </span>
                                </div>
                              </FormLabel>
                              <FormControl>
                                <DatePicker
                                  inputId="insuranceExpiry"
                                  onChange={field.onChange}
                                  value={field.value}
                                  isInvalid={fieldState.invalid}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                </div>
              </motion.div>
            )}
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
            {t("continue_to_background_check")}
            <ArrowRightIcon className="w-5 h-5 ml-1" />
          </motion.button>
        </form>
      </Form>
    </div>
  );
}
