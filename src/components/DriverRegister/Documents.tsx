"use client";

import { motion } from "framer-motion";
import {
  CheckIcon,
  Eye,
  File,
  FileText,
  ImageIcon,
  UploadCloud,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/use-translation";
import { getDeliveryPartnerDetails, submitForApproval, uploadPartnerDocuments } from "@/services/deliveryPartner/deliveryPartner";

type DocKey =
  | "idProofFront"
  | "idProofBack"
  | "drivingLicenseFront"
  | "drivingLicenseBack"
  | "vehicleRegistration"
  | "criminalRecordCertificate"
  | "activity"
  | "insurancePolicy";

type FilePreview = {
  file: File | null;
  url: string | null;
  isImage: boolean;
};

const OPTIONAL_DOCS: DocKey[] = ["activity", "insurancePolicy", "drivingLicenseFront", "drivingLicenseBack",];

const REQUIRED_DOCS: DocKey[] = [
  "idProofFront",
  "idProofBack",
  "vehicleRegistration",
  "criminalRecordCertificate",
];

export default function Documents({ id }: { id: string }) {
  const { t } = useTranslation();

  const [previews, setPreviews] = useState<Record<DocKey, FilePreview | null>>({
    idProofFront: null,
    idProofBack: null,
    drivingLicenseFront: null,
    drivingLicenseBack: null,
    vehicleRegistration: null,
    criminalRecordCertificate: null,
    activity: null,
    insurancePolicy: null,
  });
  const router = useRouter();
  const inputsRef = useRef<Record<string, HTMLInputElement | null>>({});

  const DOCUMENTS: {
    key: DocKey;
    label: string;
    prefersImagePreview: boolean;
  }[] = [
      {
        key: "idProofFront",
        label: t("id_proof_front"),
        prefersImagePreview: true,
      },
      {
        key: "idProofBack",
        label: t("id_proof_back"),
        prefersImagePreview: true
      },
      {
        key: "drivingLicenseFront",
        label: t("driving_license_front"),
        prefersImagePreview: true,
      },
      {
        key: "drivingLicenseBack",
        label: t("driving_license_back"),
        prefersImagePreview: true,
      },
      {
        key: "vehicleRegistration",
        label: t("vehicle_registration"),
        prefersImagePreview: true,
      },
      {
        key: "criminalRecordCertificate",
        label: t("criminal_record_certification"),
        prefersImagePreview: true,
      },
      {
        key: "activity",
        label: t("activity"),
        prefersImagePreview: true,
      },
      {
        key: "insurancePolicy",
        label: t("insurance_policy"),
        prefersImagePreview: true,
      },
    ];

  const isFormValid = REQUIRED_DOCS.every(
    (key) => previews[key] !== null
  );

  const openPicker = (key: DocKey) => {
    const el = inputsRef.current[key];
    el?.click();
  };

  const handleFileChange = async (key: DocKey, f?: File | null) => {
    if (!f) return;
    const isImage = f.type.startsWith("image/");
    const url = URL.createObjectURL(f);

    const toastId = toast.loading("Uploading...");

    try {
      const result = (await uploadPartnerDocuments(
        id as string,
        key,
        f
      ));

      if (result.success) {
        toast.success("File uploaded successfully!", { id: toastId });

        const prev = previews[key];
        if (prev && prev.url) URL.revokeObjectURL(prev.url);

        setPreviews((p) => ({ ...p, [key]: { file: f, url, isImage } }));

        if (inputsRef.current[key]) {
          inputsRef.current[key]!.value = "";
        }
        return;
      }
      toast.error(result.message || "File upload failed", {
        id: toastId,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message || "File upload failed", {
        id: toastId,
      });
      return;
    }
  };

  const removeFile = (key: DocKey) => {
    const prev = previews[key];
    if (prev && prev.url) URL.revokeObjectURL(prev.url);

    setPreviews((p) => ({ ...p, [key]: null }));

    if (inputsRef.current[key]) {
      inputsRef.current[key]!.value = "";
    }
  };

  const fetchExistingDocs = async () => {
    try {
      const result = await getDeliveryPartnerDetails(id as string);

      if (result?.success) {
        const docs = result?.data?.documents || {};

        const newPreviews: Record<DocKey, FilePreview | null> = {
          idProofFront: null,
          idProofBack: null,
          drivingLicenseFront: null,
          drivingLicenseBack: null,
          vehicleRegistration: null,
          criminalRecordCertificate: null,
          activity: null,
          insurancePolicy: null,
        };

        (Object.keys(docs) as DocKey[]).forEach((key) => {
          const url = (docs as Record<DocKey, string>)[key] as string;
          if (url) {
            newPreviews[key] = {
              file: null,
              url: url || "",
              isImage: /\.(jpg|jpeg|png|gif|webp)$/i.test(url),
            };
          }
        });
        setPreviews(newPreviews);
      }
    } catch (error) {
      console.log("Failed to fetch existing docs", error);
    }
  };

  useEffect(() => {
    return () => {
      Object.values(previews).forEach((p) => {
        if (p && p.url) URL.revokeObjectURL(p.url);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (() => fetchExistingDocs())();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const completeReg = async () => {
    const toastId = toast.loading("Uploading...");
    if (!isFormValid) {
      toast.error("Please upload all required documents", { id: toastId });
      return;
    }

    try {

      const result = await submitForApproval(id as string);

      if (result.success) {
        toast.success(
          result.message || "Registration successful & Request submitted",
          { id: toastId }
        );
        router.push("/status-check");
        return;
      }
      toast.error(result.message || "Request failed", { id: toastId });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
      console.log(error);
    }
  };

  function getActualFileName(url: string): string {
    try {
      const decoded = decodeURIComponent(url);
      const lastSegment = decoded.split("/").pop() || "";
      const match = lastSegment.match(/file-(.+)$/);
      return match ? match[1] : lastSegment;
    } catch {
      return "";
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4">
        <div className="w-full">
          <CardTitle className="text-2xl font-semibold tracking-wide mb-4">
            {t("upload_your_documents")}
          </CardTitle>
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
            className="bg-primary/10 p-5 rounded-lg w-full text-primary italic my-3">
            <h2 className="text-lg font-semibold">{t("note")} : </h2>
            <p className="text-sm">
              - {t("vehicle_type_bicycle")}
            </p>
            <p className="text-sm">
              - {t("vehicle_type_not_bicycle")}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {DOCUMENTS.map((d, idx) => {
          const preview = previews[d.key];
          const isSelected = !!preview;
          return (
            <motion.div
              key={d.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              className={`flex items-center justify-between p-4 border rounded-xl shadow-sm hover:shadow-md transition-all ${isSelected ? "border-[#DC3173]/30 bg-[#FFF7FB]" : "bg-white"
                }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-lg flex items-center justify-center ${isSelected ? "bg-[#DC3173]/10" : "bg-gray-50"
                    }`}
                >
                  {d.prefersImagePreview ? (
                    <ImageIcon className="w-6 h-6 text-[#DC3173]" />
                  ) : (
                    <FileText className="w-6 h-6 text-[#DC3173]" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="text-sm font-semibold text-gray-800">
                    {d.label}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {preview ? (
                      d.prefersImagePreview &&
                        preview.isImage &&
                        preview.url ? (
                        <div className="flex items-center gap-2">
                          <Image
                            src={preview.url}
                            alt={
                              preview.file?.name ||
                              getActualFileName(preview.url || "")
                            }
                            width={56}
                            height={40}
                            className="object-cover rounded-md border"
                            unoptimized
                          />
                          <div className="truncate">
                            {preview.file?.name ||
                              getActualFileName(preview.url || "")}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <File className="w-4 h-4 text-gray-500" />
                          <div className="truncate">
                            {preview.file?.name ||
                              getActualFileName(preview.url || "")}
                          </div>
                        </div>
                      )
                    ) : (
                      <span>{t("noFileSelected")}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* hidden native input */}
                <input
                  ref={(el) => {
                    inputsRef.current[d.key] = el;
                  }}
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={(e) =>
                    handleFileChange(
                      d.key,
                      e.target.files ? e.target.files[0] : null
                    )
                  }
                />

                {preview ? (
                  <>
                    <button
                      onClick={() =>
                        preview.url
                          ? window.open(preview.url, "_blank")
                          : alert(preview.file?.name)
                      }
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm border border-gray-200 hover:shadow"
                    >
                      <Eye className="w-4 h-4 text-[#DC3173]" /> {t("viewCTA")}
                    </button>

                    <button
                      onClick={() => removeFile(d.key)}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-600 border border-gray-100 hover:bg-gray-50"
                    >
                      {t("removeCTA")}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => openPicker(d.key)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[#DC3173] border border-[#DC3173]/20 hover:bg-[#DC3173]/5 transition"
                  >
                    <UploadCloud className="w-4 h-4" />
                    {t("select_file")}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="pt-4">
        <motion.button
          whileHover={{ scale: isFormValid ? 1.02 : 1 }}
          whileTap={{ scale: isFormValid ? 0.98 : 1 }}
          type="button"
          disabled={!isFormValid}
          onClick={completeReg}
          className={`mt-8 w-full py-3 px-6 rounded-lg font-medium text-lg flex items-center justify-center transition-colors duration-300
    ${isFormValid
              ? "bg-[#DC3173] text-white hover:bg-[#c21c5e]"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }
  `}
        >
          {t("complete_submit")}
          <CheckIcon className="w-5 h-5 ml-1" />
        </motion.button>

      </div>
    </div>
  );
}
