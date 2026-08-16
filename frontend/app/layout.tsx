import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlobalVoiceProvider from "@/components/GlobalVoiceProvider";

export const metadata: Metadata = {
  title: "CreatED AI Hackathon 2026 - Hardware & Grounded AI Platform",
  description: "Official Hardware & AI Hackathon Platform at University of Edinburgh with Grounded Voice AI Assistant, Workshops, and Submissions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased relative">


        <GlobalVoiceProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </GlobalVoiceProvider>
      </body>
    </html>
  );
}
