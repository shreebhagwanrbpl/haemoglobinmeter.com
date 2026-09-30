"use client";

import { Toaster } from "react-hot-toast";

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      containerStyle={{
        top: 24,
        right: 24,
        zIndex: 999999,
      }}
      toastOptions={{
        duration: 4500,
        style: {
          background: "#0f172a",
          color: "#ffffff",
          fontSize: "14px",
          fontWeight: "500",
          borderRadius: "14px",
          padding: "14px 20px",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.25)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          zIndex: 999999,
        },
        success: {
          style: {
            background: "#064e3b",
            color: "#ecfdf5",
            border: "1px solid #059669",
          },
          iconTheme: {
            primary: "#10b981",
            secondary: "#ffffff",
          },
        },
        error: {
          style: {
            background: "#881337",
            color: "#fff1f2",
            border: "1px solid #f43f5e",
          },
          iconTheme: {
            primary: "#f43f5e",
            secondary: "#ffffff",
          },
        },
      }}
    />
  );
}
