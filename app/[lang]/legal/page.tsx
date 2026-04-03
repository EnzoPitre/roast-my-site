import { Header } from "@/components/Header";

export const metadata = { title: "Mentions légales | Roast My Site" };

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-8">
    <h2 className="text-lg font-black mb-3" style={{ color: '#F97316' }}>{title}</h2>
    <div className="leading-relaxed" style={{ color: '#CBD5E1' }}>{children}</div>
  </div>
);

export default function Legal() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-20 flex-1 w-full">
        <h1 className="text-4xl font-black mb-3 tracking-tight" style={{ color: '#F8FAFC' }}>Mentions légales</h1>
        <div className="h-px mb-10" style={{ background: 'rgba(249,115,22,0.2)' }} />

        <Section title="1. Éditeur du site">
          <p>Ce site est édité par :</p>
          <p className="mt-2"><strong style={{ color: '#F8FAFC' }}>Enzo Pitre</strong><br />Statut : Auto-entrepreneur<br />Email de contact : <code style={{ color: '#F97316', background: 'rgba(249,115,22,0.1)', padding: '1px 6px', borderRadius: '4px' }}>enzo.pitre33@gmail.com</code></p>
        </Section>

        <Section title="2. Hébergement">
          <p>Ce site est hébergé par :</p>
          <p className="mt-2"><strong style={{ color: '#F8FAFC' }}>Vercel Inc.</strong><br />340 S Lemon Ave #4133<br />Walnut, CA 91789<br />États-Unis</p>
        </Section>
      </main>
    </>
  );
}
