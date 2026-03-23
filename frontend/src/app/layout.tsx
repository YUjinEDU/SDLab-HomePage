import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "스마트데이터연구실 | Smart Data Lab",
  description:
    "충남대학교 컴퓨터인공지능학부 스마트데이터연구실(SD Lab)은 데이터 기반 인공지능 및 스마트 시스템 연구를 수행합니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
