import type { Metadata } from "next";
import { Inter, Crimson_Pro } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { DEFAULT_SEO, generateBookSchema, generateOrganizationSchema } from "@/lib/seo";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  variable: '--font-crimson',
  weight: ['400', '600', '700']
});

export const metadata: Metadata = DEFAULT_SEO;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const bookSchema = generateBookSchema();
  const organizationSchema = generateOrganizationSchema();

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(bookSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
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
