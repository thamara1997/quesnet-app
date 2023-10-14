"use client";

import NavBar from "@/components/navbar/NavBar";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

// const poppins = Poppins({ subsets: ["latin"] });

import { metadata } from "./constants/SiteMetaData";

export default function RootLayout({ children, session }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/path/to/fonts.css" />
      </head>
      <body>
        <SessionProvider session={session}>
          <NavBar />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
