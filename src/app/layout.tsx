
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import Navbar from "@/components/common/Navbar";
import 'react-international-phone/style.css';
import SwitcherTabs from "@/components/common/SwitcherTabs";

export const metadata: Metadata = {
  title: "DeliGo Rider Registration Form | Check Status",
  description:
    "DeliGo Rider Registration Form enables one to register as a Delivery Partner if there is no Fleet Manager in his area.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased bg-gray-50`}>
        <div className="w-[95%] lg:w-7xl mx-auto space-y-3 my-16">
          <Navbar />
          <SwitcherTabs />
          <div className="min-h-screen">{children}</div>
        </div>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
