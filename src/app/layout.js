import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToasterProvider from "@/components/ToasterProvider";

export const metadata = {
  metadataBase: new URL("https://haemoglobinmeter.com"),
  title: "Biomedical Products, Laboratory Equipment & Diagnostic Supplies | Raj Biosis",
  description: "Browse a broad biomedical catalogue covering laboratory instruments, diagnostic products, reagents, test kits, consumables, monitoring devices and related supplies.",
  keywords: [
    "Biomedical Products",
    "Laboratory Equipment",
    "Diagnostic Equipment",
    "Medical Laboratory Supplies",
    "Diagnostic Test Kits",
    "Laboratory Reagents",
    "Biomedical Consumables",
    "Patient Monitoring Equipment"
  ],
  openGraph: {
    title: "Biomedical Products & Laboratory Supplies | Raj Biosis",
    description: "A multi-category catalogue for laboratory equipment, diagnostics, reagents, kits, consumables and biomedical supplies.",
    url: "https://haemoglobinmeter.com",
    siteName: "Raj Biosis",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Raj Biosis Diagnostics",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Biomedical Products & Laboratory Supplies | Raj Biosis",
    description: "Biomedical equipment, diagnostic products and laboratory supplies for varied healthcare requirements.",
    images: ["/logo.png"],
  },
  alternates: {
    canonical: "https://haemoglobinmeter.com",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased" suppressHydrationWarning>
        <ToasterProvider />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

