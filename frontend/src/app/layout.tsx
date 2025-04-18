import React from "react";
import "./globals.css";
import QueryProvider from "@/providers/query-provider";
import Layout from "../components/layout/Layout";

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
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
