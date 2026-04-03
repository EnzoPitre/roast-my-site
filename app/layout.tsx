import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Footer } from "@/components/Footer";
import { Analytics } from "@/components/Analytics";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { CookieBanner } from "@/components/CookieBanner";
import { Orbitron } from 'next/font/google';

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['700', '900'],
  variable: '--font-orbitron',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Roast My Site | Brutal AI Audits",
  description: "Get a brutally honest, AI-powered audit of your website's UX, design, and copy. Stop losing conversions immediately.",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={orbitron.variable}>
      <body style={{ backgroundColor: '#0A0A0F', color: '#E2E8F0' }} className="min-h-screen flex flex-col antialiased">
        {/* Fixed global background — sits behind all pages while content scrolls */}
        <div aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: -1, backgroundColor: '#0A0A0F', overflow: 'hidden', pointerEvents: 'none' }}>
          {/* Orb 1 — top-left, large deep red */}
          <div style={{ position: 'absolute', width: '700px', height: '700px', borderRadius: '50%', top: '-10%', left: '-5%', background: 'radial-gradient(circle, rgba(180,30,0,0.25), transparent 70%)', filter: 'blur(130px)', animation: 'orb-breathe 11s ease-in-out infinite' }} />
          {/* Orb 2 — top-right, deep orange */}
          <div style={{ position: 'absolute', width: '600px', height: '600px', borderRadius: '50%', top: '-5%', right: '-10%', background: 'radial-gradient(circle, rgba(234,88,12,0.15), transparent 70%)', filter: 'blur(120px)', animation: 'orb-breathe 15s ease-in-out infinite', animationDelay: '3s' }} />
          {/* Orb 3 — center, large warm glow */}
          <div style={{ position: 'absolute', width: '900px', height: '900px', borderRadius: '50%', top: '40%', left: '30%', background: 'radial-gradient(circle, rgba(120,15,0,0.20), transparent 70%)', filter: 'blur(160px)', animation: 'orb-breathe 13s ease-in-out infinite', animationDelay: '1.5s' }} />
          {/* Orb 4 — bottom-left, dark red */}
          <div style={{ position: 'absolute', width: '600px', height: '600px', borderRadius: '50%', bottom: '-10%', left: '-5%', background: 'radial-gradient(circle, rgba(200,40,0,0.18), transparent 70%)', filter: 'blur(140px)', animation: 'orb-breathe 10s ease-in-out infinite', animationDelay: '5s' }} />
          {/* Orb 5 — bottom-right, orange ember */}
          <div style={{ position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', bottom: '-5%', right: '-5%', background: 'radial-gradient(circle, rgba(249,115,22,0.12), transparent 70%)', filter: 'blur(120px)', animation: 'orb-breathe 8s ease-in-out infinite', animationDelay: '2s' }} />
        </div>
        <Providers>
          {children}
          <Footer />
          <CookieBanner />
          <Analytics />
          <VercelAnalytics />
        </Providers>
      </body>
    </html>
  );
}
