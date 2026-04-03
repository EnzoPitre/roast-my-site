import { Header } from "@/components/Header";

export const metadata = { title: "CGU | Roast My Site" };

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-8">
    <h2 className="text-lg font-black mb-3" style={{ color: '#F97316' }}>{title}</h2>
    <div className="leading-relaxed" style={{ color: '#CBD5E1' }}>{children}</div>
  </div>
);

export default function Terms() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-20 flex-1 w-full">
        <h1 className="text-4xl font-black mb-3 tracking-tight" style={{ color: '#F8FAFC' }}>Conditions Générales d&apos;Utilisation</h1>
        <div className="h-px mb-10" style={{ background: 'rgba(249,115,22,0.2)' }} />

        <Section title="1. Objet">
          <p>Les présentes CGU ont pour objet de définir les modalités de mise à disposition des services du site Roast My Site.</p>
        </Section>

        <Section title="2. Service fourni « en l'état »">
          <p>Les rapports générés par l&apos;IA (Claude) sont fournis « en l&apos;état » sans garantie quant à l&apos;exactitude absolue des recommandations. L&apos;utilisateur est seul responsable de l&apos;application ou non des modifications suggérées sur son site web.</p>
        </Section>

        <Section title="3. Paiement non remboursable">
          <p>Roast My Site propose un achat unique par rapport. Le produit étant un service numérique généré et délivré instantanément, les achats sont fermes et non remboursables conformément aux exceptions légales au droit de rétractation applicables aux contenus numériques.</p>
        </Section>

        <Section title="4. Usage personnel uniquement">
          <p>L&apos;accès au compte et les rapports générés sont destinés à un usage personnel et professionnel direct. Toute tentative de revente massive automatisée du service est interdite.</p>
        </Section>

        <Section title="5. Droit applicable">
          <p>Les présentes CGU sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.</p>
        </Section>
      </main>
    </>
  );
}
