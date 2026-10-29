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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://shamanth-prfolio.netlify.app",
  ),
  title: {
    default: "Shamanth Krishna V R | Full-Stack Developer & DevOps Enthusiast",
    template: "%s | Shamanth Krishna V R",
  },
  description:
    "Portfolio of Shamanth Krishna V R, a full-stack developer and DevOps enthusiast building reliable web applications, cloud solutions, and creative digital experiences.",
  keywords: [
    "Shamanth Krishna V R",
    "full-stack developer",
    "DevOps enthusiast",
    "AWS developer",
    "portfolio",
  ],
  authors: [{ name: "Shamanth Krishna V R" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    title: "Shamanth Krishna V R | Full-Stack Developer & DevOps Enthusiast",
    description:
      "Explore Shamanth Krishna V R's projects, technical skills, experience, and creative work.",
    siteName: "Shamanth Krishna V R",
    images: [
      {
        url: "/about-photo.png",
        width: 1200,
        height: 630,
        alt: "Shamanth Krishna V R portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shamanth Krishna V R | Full-Stack Developer & DevOps Enthusiast",
    description:
      "Explore Shamanth Krishna V R's projects, technical skills, experience, and creative work.",
    images: ["/about-photo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
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
