import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbare from "@/components/nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "The Batch of the Year",
  description: "A voting platform to choose the batch name, built by Hashimi.", 
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        
        <Navbare  />
        
        {children}
      </body>
    </html> 
  );
}
