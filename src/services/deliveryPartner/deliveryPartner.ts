/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/serverFetch";


export const getDeliveryPartnerDetails = async (id?: string) => {
  try {
    const res = await serverFetch.get(`/delivery-partners/${id}`);

    const result = await res.json();

    return result?.data;

  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      message: `${process.env.NODE_ENV === 'development' ? error?.response?.data?.message : 'Something went wrong in delivery partner fetching.'}`
    };
  }
};

export const createDeliveryPartner = async (payload: any) => {
  const res = await serverFetch.post("/auth/register/create-delivery-partner", {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload)
  });

  const result = await res.json();

  return result;
};

export const updatePartnerInformation = async (id: string, payload: any) => {

  const res = await serverFetch.patch(`/delivery-partners/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload)
  });

  const result = await res.json();

  return result;
};

export const submitForApproval = async (id: string) => {
  const res = await serverFetch.patch(`/auth/${id}/submitForApproval`);

  const result = await res.json();

  return result;
};
