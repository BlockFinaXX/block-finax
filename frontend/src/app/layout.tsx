import React from "react";
import "../assets/styles/globals.css";
import QueryProvider from "@/providers/query-provider";

export const metadata = {
  title: "BlockFinax",
  description: "Secure Trade Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
