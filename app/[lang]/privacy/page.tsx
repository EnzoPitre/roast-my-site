import { Header } from "@/components/Header";

export const metadata = { title: "Politique de confidentialité | Roast My Site" };

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-8">
    <h2 className="text-lg font-black mb-3" style={{ color: '#F97316' }}>{title}</h2>
    <div className="leading-relaxed" style={{ color: '#CBD5E1' }}>{children}</div>
  </div>
);

export default function Privacy() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-20 flex-1 w-full">
        <h1 className="text-4xl font-black mb-3 tracking-tight" style={{ color: '#F8FAFC' }}>Politique de confidentialité</h1>
        <div className="h-px mb-10" style={{ background: 'rgba(249,115,22,0.2)' }} />

        <Section title="1. Données collectées">
          <p>Lors de l&apos;utilisation de Roast My Site, nous collectons les informations suivantes :</p>
          <ul className="mt-3 space-y-2 list-none">
            {[
              { label: 'Données de compte :', desc: 'votre adresse email fournie par l\'authentification Google.' },
              { label: 'Données d\'utilisation :', desc: 'les URLs soumises pour analyse.' },
              { label: 'Résultats d\'analyse :', desc: 'le contenu généré par l\'IA concernant l\'URL soumise.' },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span style={{ color: '#F97316' }}>›</span>
                <span><strong style={{ color: '#F8FAFC' }}>{item.label}</strong> {item.desc}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="2. Utilisation des données">
          <p>Vos données sont exclusivement utilisées pour le fonctionnement du service Roast My Site, l&apos;accès à l&apos;historique de vos audits, et l&apos;amélioration de la qualité des analyses.</p>
        </Section>

        <Section title="3. Durée de conservation">
          <p>Vos données (URLs analysées et rapports associés) sont conservées pendant une durée de <strong style={{ color: '#F8FAFC' }}>12 mois</strong> à compter de la date de création de l&apos;audit.</p>
        </Section>

        <Section title="4. Droits RGPD">
          <p>Conformément à la réglementation (RGPD), vous disposez des droits suivants concernant vos données personnelles : droit d&apos;accès, de rectification, de suppression et d&apos;opposition.</p>
          <p className="mt-2">Pour exercer ces droits, veuillez contacter notre DPO à l&apos;adresse indiquée ci-dessous.</p>
        </Section>

        <Section title="5. Contact DPO">
          <p>Pour toute question relative à vos données, contactez-nous à : <code style={{ color: '#F97316', background: 'rgba(249,115,22,0.1)', padding: '1px 6px', borderRadius: '4px' }}>enzo.pitre33@gmail.com</code></p>
        </Section>
      </main>
    </>
  );
}
