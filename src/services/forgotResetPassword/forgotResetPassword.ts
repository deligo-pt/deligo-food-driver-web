"use server";

import { serverFetch } from "@/lib/serverFetch";


export const forgotPasswordReq = async (payload: { email: string }) => {
  const data = {
    ...payload,
    role: "DELIVERY_PARTNER"
  }
  const res = await serverFetch.post("/auth/forgot-password", {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  return result;
};

export const resetPasswordReq = async (payload: {
  email: string;
  newPassword: string;
  token: string;
}) => {

  const data = {
    ...payload,
    role: "DELIVERY_PARTNER"
  }

  const res = await serverFetch.post("/auth/reset-password", {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  return result;
};