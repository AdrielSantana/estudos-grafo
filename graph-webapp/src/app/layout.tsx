import "./globals.css";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ["400", "700"],
  display: "swap",
  subsets: ["latin-ext"],
});

export const metadata: Metadata = {
  title: "Graph Webapp",
  description: "Graph Webapp",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
        <body className={roboto.className}>{children}</body>
    </html>
  );
}
