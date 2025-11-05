import type { Metadata } from "next";
import "./globals.css";

export { viewport } from "./viewport";

export const metadata: Metadata = {
  title: "PAPYR - Dein digitales Bekenntnis",
  description: "Schreiben. Siegeln. Verinnerlichen.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PAPYR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
