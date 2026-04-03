import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Header } from "@/components/Header";
import { RoastCard } from "@/components/RoastCard";
import { RoastBody } from "@/components/RoastBody";
import { RefreshOnSuccess } from "@/components/RefreshOnSuccess";
import { ReadingProgressBar } from "@/components/ReadingProgressBar";
import { Suspense } from "react";
import { translations, Language, TranslationKey } from "@/lib/translations";
import { Metadata } from 'next';

const BASE_URL = process.env.NEXTAUTH_URL || 'https://roastmysite.com';

export async function generateMetadata({ params }: { params: { id: string; lang: string } }): Promise<Metadata> {
  const roast = await prisma.roast.findUnique({ where: { id: params.id }, select: { url: true, globalScore: true, summary: true } });
  if (!roast) return {};
  const lang = params.lang as Language;
  const title = lang === 'fr'
    ? `Audit de ${roast.url} — ${roast.globalScore}/10 | Roast My Site`
    : `Roast of ${roast.url} — Score ${roast.globalScore}/10 | Roast My Site`;
  const description = roast.summary.slice(0, 155) + (roast.summary.length > 155 ? '…' : '');
  const ogUrl = `${BASE_URL}/og?score=${roast.globalScore}&url=${encodeURIComponent(roast.url)}&lang=${lang}`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [ogUrl] },
  };
}

export default async function RoastPage({ params }: { params: { id: string; lang: string } }) {
  const lang = params.lang as Language;
  const t = (key: TranslationKey) => translations[lang][key] as string;

  const session = await getServerSession(authOptions);

  const roast = await prisma.roast.findUnique({ where: { id: params.id } });
  if (!roast) notFound();

  const showPaywall = !roast.isPaid;

  return (
    <>
      <ReadingProgressBar />
      <Suspense fallback={null}><RefreshOnSuccess /></Suspense>
      <Header />
      <main className="min-h-screen pt-16 px-4 sm:px-6 relative pb-32">
        <RoastCard roast={roast}>
          <RoastBody roast={roast} lang={lang} showPaywall={showPaywall} />
        </RoastCard>
      </main>
    </>
  );
}
