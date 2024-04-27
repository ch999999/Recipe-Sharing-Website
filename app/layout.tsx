import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "./ui/navbar/navbar";
import { validateToken } from "./lib/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RecipeKamu",
  description: "This is a simple website that aims to provide users with the ability to easily create recipes, then share them via a simple link, or simply keep the link for their own reference.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tokenValidationRes = await validateToken()
  return (
    <html lang="en">
      <body data-theme="light" className="min-h-screen">
        <div className="min-h-screen">
          <NavBar isLoggedIn={tokenValidationRes.success}/>
          {children}
        </div>
      </body>
    </html>
  );
}
