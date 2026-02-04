import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Skivelgeren 25/26",
  description: "Finn riktig ski.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="no">
      <body
        className={`${inter.className} min-h-screen bg-white text-gray-900 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
