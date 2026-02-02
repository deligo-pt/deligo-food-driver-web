import { Checkbox } from "@/components/ui/checkbox";
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
import { equipmentValidation } from "@/validations/edit-delivery-partner/equipment.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  ArrowRightIcon,
  BackpackIcon,
  BriefcaseBusiness,
  ClockIcon,
  MapPinIcon,
  PlusIcon,
  TruckIcon,
  XIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

type FormData = z.infer<typeof equipmentValidation>;

interface IProps {
  onNext: () => void;
  id: string;
}

export function EquipmentForm({ onNext, id }: IProps) {
  const { t } = useTranslation();
  const [zone, setZone] = useState("");
  const form = useForm<FormData>({
    resolver: zodResolver(equipmentValidation),
    defaultValues: {
      preferredZones: [],
      preferredHours: [],
      isothermalBag: false,
      helmet: false,
      powerBank: false,
      workedWithOtherPlatform: false,
      otherPlatformName: "",
    },
  });
  const equipment = [
    {
      id: "isothermalBag",
      label: t("delivery_bag"),
    },
    {
      id: "helmet",
      label: t("helmet"),
    },
    {
      id: "powerBank",
      label: t("power_bank"),
    },
  ];

  const [watchZones, watchWorkedWithOtherPlatform] = useWatch({
    control: form.control,
    name: ["preferredZones", "workedWithOtherPlatform"],
  });

  const addZone = () => {
    if (zone && !form?.getValues("preferredZones")?.includes(zone)) {
      const newZones = [...form?.getValues("preferredZones"), zone];
      form.setValue("preferredZones", newZones);
    }
    setZone("");
  };

  const removeZone = (zoneToRemove: string) => {
    const newZones = form
      ?.getValues("preferredZones")
      ?.filter((t) => t !== zoneToRemove);
    form.setValue("preferredZones", newZones);
  };

  const onSubmit = async (values: FormData) => {
    const toastId = toast.loading("Updating Delivery Partner details...");
    try {
      const payload = {
        workPreferences: {
          preferredZones: values.preferredZones,
          preferredHours: values.preferredHours,
          hasEquipment: {
            isothermalBag: values.isothermalBag,
            helmet: values.helmet,
            powerBank: values.powerBank,
          },
          workedWithOtherPlatform: values.workedWithOtherPlatform,
          otherPlatformName: values.otherPlatformName,
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

      if (result.success) {
        form.setValue(
          "preferredZones",
          result?.data?.workPreferences?.preferredZones || [],
        );
        form.setValue(
          "preferredHours",
          result?.data?.workPreferences?.preferredHours || [],
        );
        form.setValue(
          "isothermalBag",
          result?.data?.workPreferences?.hasEquipment?.isothermalBag || false,
        );
        form.setValue(
          "helmet",
          result?.data?.workPreferences?.hasEquipment?.helmet || false,
        );
        form.setValue(
          "powerBank",
          result?.data?.workPreferences?.hasEquipment?.powerBank || false,
        );
        form.setValue(
          "workedWithOtherPlatform",
          result?.data?.workPreferences?.workedWithOtherPlatform || false,
        );
        form.setValue(
          "otherPlatformName",
          result?.data?.workPreferences?.otherPlatformName || "",
        );
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
          {t("equipment_availability")}
        </h2>
        <p className="text-gray-600">{t("tell_us_about_equipment")}</p>
      </motion.div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-8">
            <div className="space-y-2">
              <Label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <MapPinIcon className="w-5 h-5 text-[#DC3173]" />
                {t("preferred_working_zones")}
              </Label>
              {watchZones?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-1">
                  {watchZones?.map((zone) => (
                    <motion.div
                      key={zone}
                      initial={{
                        scale: 0,
                      }}
                      animate={{
                        scale: 1,
                      }}
                      className="flex items-center bg-[#DC3173] bg-opacity-10 text-white px-3 py-1 rounded-full"
                    >
                      <span>{zone}</span>
                      <button
                        type="button"
                        onClick={() => removeZone(zone)}
                        className="ml-2 text-white hover:text-[#CCC]"
                      >
                        <XIcon className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
              <FormField
                control={form.control}
                name="preferredZones"
                render={() => (
                  <FormItem className="gap-1">
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="text"
                          value={zone}
                          onChange={(e) => setZone(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-0! foce focus:border-[#DC3173]! outline-none inset-0 h-10"
                          placeholder="Add a zone"
                          onKeyUp={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addZone();
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={addZone}
                          className="bg-[#DC3173] text-white px-4 py-2 rounded-r-md hover:bg-[#B02458] transition-colors absolute top-0 right-0 h-full"
                        >
                          <PlusIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="preferredHours"
              render={({ field, fieldState }) => (
                <FormItem className="content-start">
                  <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center">
                      <ClockIcon className="w-5 h-5 text-[#DC3173]" />
                      <span className="ml-2">
                        {t("preferred_working_hours")}
                      </span>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange([value])}
                      value={field.value?.[0]}
                    >
                      <SelectTrigger
                        className={cn(
                          "w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#DC3173] focus:border-[#DC3173] outline-none transition-all",
                          fieldState.invalid
                            ? "border-red-500"
                            : "border-gray-300",
                        )}
                      >
                        <SelectValue placeholder="Select Preferred Hours" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">
                          {t("morning_8_12")}
                        </SelectItem>
                        <SelectItem value="afternoon">
                          {t("afternoon_12_6")}
                        </SelectItem>
                        <SelectItem value="evening">
                          {t("evening_6_10")}
                        </SelectItem>
                        <SelectItem value="night">
                          {t("night_10_12")}
                        </SelectItem>
                        <SelectItem value="fullday">{t("full_day")}</SelectItem>
                        <SelectItem value="flexible">
                          {t("flexible")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <div className="flex items-center">
                  <BackpackIcon className="w-5 h-5 text-[#DC3173]" />
                  <span className="ml-2">{t("delivery_equipment")}</span>
                </div>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {equipment.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name={item.id as "isothermalBag" | "helmet" | "powerBank"}
                    render={({ field }) => (
                      <FormItem className="content-start">
                        <FormControl>
                          <FormLabel
                            htmlFor={item.id}
                            className="text-sm text-gray-700 flex items-center"
                          >
                            <Checkbox
                              id={item.id}
                              checked={!!field.value}
                              onCheckedChange={(checked) =>
                                field.onChange(checked)
                              }
                              className="h-4 w-4 text-[#DC3173] focus:ring-[#DC3173] border-gray-300 rounded data-[state=checked]:bg-[#DC3173] data-[state=checked]:border-[#DC3173]"
                            />
                            {item.label}
                          </FormLabel>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>
            <FormField
              control={form.control}
              name="workedWithOtherPlatform"
              render={({ field }) => (
                <FormItem className="content-start">
                  <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center">
                      <BriefcaseBusiness className="w-5 h-5 text-[#DC3173]" />
                      <span className="ml-2">
                        {t("worked_with_other_delivery_platform")}
                      </span>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <FormLabel htmlFor="workedWithOtherPlatform">
                      <Checkbox
                        id="workedWithOtherPlatform"
                        checked={!!field.value}
                        onCheckedChange={(checked) => field.onChange(checked)}
                        className="h-4 w-4 text-[#DC3173] focus:ring-[#DC3173] border-gray-300 rounded data-[state=checked]:bg-[#DC3173] data-[state=checked]:border-[#DC3173]"
                      />
                      {t("")}
                    </FormLabel>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!!watchWorkedWithOtherPlatform && (
              <FormField
                control={form.control}
                name="otherPlatformName"
                render={({ field }) => (
                  <FormItem className="content-start">
                    <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                      <div className="flex items-center">
                        <TruckIcon className="w-5 h-5 text-[#DC3173]" />
                        <span className="ml-2">{t("other_platform_name")}</span>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Other platform name"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#DC3173] focus:border-[#DC3173] outline-none transition-all border-gray-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
            {t("continue_to_documents")}
            <ArrowRightIcon className="w-5 h-5 ml-1" />
          </motion.button>
        </form>
      </Form>
    </div>
  );
}
