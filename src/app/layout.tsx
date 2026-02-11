import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import "./globals.css";
import { TextureOverlay } from "@/components/texture-overlay";
import { CustomCursor } from "@/components/custom-cursor";
import { MusicProvider } from "@/components/music-provider";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
});

export const metadata: Metadata = {
  title: "True Love — Valentine's Day",
  description: "A love letter for you ❤️",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${fraunces.variable} antialiased`}>
        <TextureOverlay />
        <CustomCursor />
        <MusicProvider>{children}</MusicProvider>
      </body>
    </html>
  );
}
