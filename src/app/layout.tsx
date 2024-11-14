import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import {NavBar} from "@/app/components/navBar";
import { CustomFooter } from "./components/footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "XChange",
  description: "Web dedicada a facilitar los intercambios entre usuarios ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
        <NavBar />
        {children}
        <CustomFooter />
      </body>
    </html>
  );
}