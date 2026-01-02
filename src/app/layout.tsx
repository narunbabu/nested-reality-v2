import type { Metadata } from "next";
import { Inter, Crimson_Pro } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  variable: '--font-crimson',
  weight: ['400', '600', '700']
});

export const metadata: Metadata = {
  title: "Nested Reality - A Density-Based Rewriting of Physics",
  description: "Nested Reality: A Density-Based Rewriting of Physics, Matter, and Life by Arun Nalamara. Explore the fundamental structure of space, continuity, and nested hierarchy of existence.",
  keywords: ["nested reality", "physics", "density", "science", "philosophy", "arun nalamara"],
  authors: [{ name: "Arun Nalamara" }],
  openGraph: {
    title: "Nested Reality - A Density-Based Rewriting of Physics",
    description: "A Density-Based Rewriting of Physics, Matter, and Life by Arun Nalamara",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${crimsonPro.variable} font-sans antialiased`}>
        <GoogleAnalytics />
        <div className="min-h-screen flex flex-col">
          <Navigation />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
