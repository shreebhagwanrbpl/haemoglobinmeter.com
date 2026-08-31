import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

export const metadata = {
  metadataBase: new URL("https://haemoglobinmeter.com"),
  title: "Clinical Haemoglobin Meters & Diagnostic Solutions | Raj Biosis",
  description: "Explore high-precision clinical haemoglobinometers, automated cell counters, and point-of-care (POC) blood diagnostics for hospitals and pathology clinics.",
  keywords: [
    "Clinical Haemoglobin Meter",
    "Professional Haemoglobinometer",
    "POC Haemoglobin Analyzer",
    "Blood Haemoglobin Testing",
    "Portable Haemoglobinometer",
    "Automated Hb Meter",
    "Hospital Haemoglobin Meter",
    "Diagnostics Haemoglobin Testing"
  ],
  openGraph: {
    title: "Clinical Haemoglobin Meters & Diagnostic Solutions | Raj Biosis",
    description: "Supplier of clinical-grade haemoglobinometers and automated hematology testing systems.",
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
    title: "Clinical Haemoglobin Meters & Diagnostic Solutions | Raj Biosis",
    description: "Clinical-grade haemoglobinometers and diagnostic systems across India.",
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
        <Navbar />
        <main>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
            }}
          />
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
