import type { Metadata } from "next";
import {
  Inter,
  Poppins,
  Jersey_15,
  Jersey_10,
  Just_Another_Hand,
  Just_Me_Again_Down_Here,
} from "next/font/google";
import "./globals.css";
import "./responsive.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jersey10 = Jersey_10({
  variable: "--font-jersey-10",
  subsets: ["latin"],
  weight: "400",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jersey15 = Jersey_15({
  variable: "--font-jersey-15",
  subsets: ["latin"],
  weight: "400",
});

const justAnotherHand = Just_Another_Hand({
  variable: "--font-just-another-hand",
  subsets: ["latin"],
  weight: "400",
});

const justMeAgainDownHere = Just_Me_Again_Down_Here({
  variable: "--font-just-me-again-down-here",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Shamanth Krishna V R",
  description:
    "Portfolio of Shamanth Krishna V R — Full Stack Developer, Cloud & AWS, AI/ML and DevOps.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${poppins.variable} ${jersey15.variable} ${jersey10.variable} ${justAnotherHand.variable} ${justMeAgainDownHere.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
