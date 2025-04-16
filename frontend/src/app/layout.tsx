// app/layout.tsx
import React from "react";
import "@/styles/globals.css";

export const metadata = {
  title: "ApeChain DApp",
  description: "Your dashboard on ApeChain",
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
