import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ModalProvider from "@/components/providers/modal-provider";

export const metadata: Metadata = {
  title: "DoodleConnect",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ClerkProvider>
        <html lang="en">
          <body>
            {children}
            <ModalProvider />
          </body>
        </html>
      </ClerkProvider>
    </>
  );
}
