import type { Metadata } from "next";
import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: { default: "Ransom — Software Engineer", template: "%s | Ransom" },
  description: "Portfolio of Bonya Ransom Nkeh Kongnyuy — Software Engineer specializing in full-stack development, AI/ML, and scalable systems.",
  keywords: ["Software Engineer", "Full-Stack Developer", "AI", "Machine Learning", "Cameroon"],
  authors: [{ name: "Ransom" }],
  creator: "Ransom",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Ransom — Software Engineer",
    description: "Building elegant, scalable software.",
    siteName: "Ransom Portfolio",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#1A221A",
              color: "#F0F5F0",
              border: "1px solid rgba(0,200,83,0.2)",
              fontFamily: "DM Mono, monospace",
              fontSize: "13px",
            },
            success: { iconTheme: { primary: "#00C853", secondary: "#080A08" } },
          }}
        />
      </body>
    </html>
  );
}
