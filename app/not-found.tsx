import { Header } from "@/components/Header";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = { title: "404 - Not Found | Roast My Site" };

export default function NotFound() {
  return (
    <>
      <Header />
      <main style={{ backgroundColor: '#0A0A0F' }} className="flex-1 w-full flex flex-col items-center justify-center px-6 relative overflow-hidden text-center min-h-[80vh]">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full pointer-events-none animate-float" style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.07), transparent 70%)', filter: 'blur(100px)' }} />
        
        <h1 className="text-9xl md:text-[12rem] font-black tracking-tighter mb-4 relative z-10 leading-none" style={{ color: '#F97316', textShadow: '0 0 80px rgba(249,115,22,0.3)' }}>
          404
        </h1>
        <h2 className="text-3xl font-black mb-4 relative z-10 tracking-tight" style={{ color: '#F8FAFC' }}>
          This page got roasted and disappeared.
        </h2>
        <p className="text-lg font-medium mb-12 relative z-10" style={{ color: '#94A3B8' }}>
          But don't worry, your conversions don't have to do the same.
        </p>
        
        <Link href="/" className="btn-orange inline-flex items-center gap-2 relative z-10">
          <ArrowLeft className="w-5 h-5" /> Back to Home
        </Link>
      </main>
    </>
  );
}
