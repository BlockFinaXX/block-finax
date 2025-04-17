import React from "react";
import "@/assets/styles/globals.css";

export const metadata = {
  title: "BlockFinax",
  description: ">Secure Trade Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
