
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import 'react-international-phone/style.css';

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
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
