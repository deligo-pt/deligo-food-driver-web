
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import Navbar from "@/components/common/Navbar";
import SwitcherTabs from "@/components/common/SwitcherTabs";

export const metadata: Metadata = {
  title: "DeliGo Fleet Manager Portal | Manage Drivers & Operations",
  description:
    "DeliGo Fleet Manager Portal enables delivery fleet partners to manage Drivers,  track performance, monitor payouts, and streamline delivery operations from a powerful dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased bg-gray-50`}>
        <div className="w-[90%] lg:w-4xl mx-auto space-y-3 my-16">
          <Navbar />
          <SwitcherTabs />
          <div className="min-h-screen">{children}</div>
        </div>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
