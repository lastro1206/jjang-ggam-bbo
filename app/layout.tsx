import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start",
});

export const metadata: Metadata = {
  title: "우주 픽셀 가위바위보",
  description: "8비트 픽셀 아트 스타일의 우주 테마 가위바위보 게임",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${pressStart2P.variable} antialiased`}
        style={{ cursor: "none" }}
      >
        {children}
      </body>
    </html>
  );
}
