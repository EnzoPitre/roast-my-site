export type Category = 'cro' | 'ux' | 'copy' | 'seo' | 'cases';

export interface BlogPost {
  slug: string;
  category: Category;
  tag: { en: string; fr: string };
  tagColor: string;
  date: string;
  readTime: number;
  title: { en: string; fr: string };
  excerpt: { en: string; fr: string };
  content: { en: string; fr: string };
  related: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: '7-signs-killing-conversions',
    category: 'cro',
    tag: { en: 'CRO Tips', fr: 'Conseils CRO' },
    tagColor: '#F97316',
    date: 'Mar 28, 2026',
    readTime: 4,
    title: {
      en: '7 Signs Your Website Is Killing Your Conversions',
      fr: '7 Signes que Votre Site Web Tue Vos Conversions',
    },
    excerpt: {
      en: 'A website is your 24/7 salesperson. If it\'s failing, you are bleeding money.',
      fr: 'Un site web est votre commercial disponible 24h/24. S\'il échoue, vous perdez de l\'argent.',
    },
    content: {
      en: `A website is your 24/7 salesperson. If it's failing, you are bleeding money. The reality is that most founders are too close to their product to see the obvious flaws in their landing page. Here are 7 undeniable signs that your website is actively killing your conversion rate.

**1. Your hero section is vague.**
If a visitor cannot understand exactly what you sell within 5 seconds, they will bounce. Stop using "clever" jargon. Be direct. "AI-powered project management for remote agencies" beats "Reimagining the future of work" every single time.

**2. You hide the pricing.**
Making users schedule a call just to find out your SaaS costs $20/month is a massive friction point. Transparency builds trust. Hide your pricing and you're signaling you're either ashamed of it or you're trying to trap people.

**3. Too many CTAs.**
"Sign up", "Learn more", "Read our blog", "Follow us on Twitter". When you ask users to do everything, they do nothing. Every page needs one primary call to action. One. The rest are distractions.

**4. Slow loading speed.**
Every second of delay drops conversions by up to 20%. Compress your images. Remove unused scripts. Use a CDN. Your beautiful high-res hero image is costing you sales.

**5. No social proof above the fold.**
People don't want to be the first to try your product. Show them others have succeeded. A "Trusted by 500+ companies" badge or three short testimonials directly below your headline can lift conversions by 15-30%.

**6. Terrible mobile layout.**
Over 60% of traffic is mobile. If your buttons are too small to tap with a thumb, if text is overflowing, if you have to zoom in to read the price — you're losing sales. Check your analytics. The bounce rate on mobile vs desktop will tell you everything.

**7. Broken or confusing navigation.**
Don't reinvent the wheel. Put the logo on the left, primary links on the right. Keep the navigation to 5 items maximum. Every extra link is another decision a visitor has to make — and decision fatigue leads to abandonment.

If your site exhibits more than 3 of these signs, your conversion rate is suffering. Run a brutally honest AI audit and get a prioritized fix plan in 30 seconds.`,
      fr: `Un site web est votre commercial disponible 24h/24. S'il échoue, vous perdez de l'argent. La réalité est que la plupart des fondateurs sont trop proches de leur produit pour voir les défauts évidents de leur landing page. Voici 7 signes indéniables que votre site tue activement votre taux de conversion.

**1. Votre section hero est floue.**
Si un visiteur ne comprend pas exactement ce que vous vendez en 5 secondes, il part. Arrêtez d'utiliser du jargon "créatif". Soyez direct. "Gestion de projet par IA pour les agences à distance" bat "Réinventer l'avenir du travail" à chaque fois.

**2. Vous cachez vos tarifs.**
Obliger les utilisateurs à prendre rendez-vous pour découvrir que votre SaaS coûte 20€/mois est un énorme frein. La transparence construit la confiance. Cachez vos prix et vous signalez que vous en avez honte ou que vous essayez de piéger les gens.

**3. Trop de CTA.**
"S'inscrire", "En savoir plus", "Lire notre blog", "Nous suivre sur Twitter". Quand vous demandez aux utilisateurs de tout faire, ils ne font rien. Chaque page a besoin d'un seul appel à l'action principal. Un seul. Le reste n'est que distraction.

**4. Temps de chargement lent.**
Chaque seconde de délai réduit les conversions jusqu'à 20%. Compressez vos images. Supprimez les scripts inutilisés. Utilisez un CDN. Votre belle image hero en haute résolution vous coûte des ventes.

**5. Aucune preuve sociale au-dessus de la ligne de flottaison.**
Les gens ne veulent pas être les premiers à essayer votre produit. Montrez-leur que d'autres ont réussi. Un badge "Approuvé par 500+ entreprises" ou trois courts témoignages juste sous votre titre principal peut augmenter les conversions de 15 à 30%.

**6. Mise en page mobile catastrophique.**
Plus de 60% du trafic est mobile. Si vos boutons sont trop petits pour un pouce, si le texte déborde, si vous devez zoomer pour lire le prix — vous perdez des ventes. Vérifiez vos analytics. Le taux de rebond sur mobile vs desktop vous dira tout.

**7. Navigation cassée ou confuse.**
N'inventez pas la roue. Logo à gauche, liens principaux à droite. Limitez la navigation à 5 éléments maximum. Chaque lien supplémentaire est une décision que le visiteur doit prendre — et la fatigue décisionnelle mène à l'abandon.

Si votre site présente plus de 3 de ces signes, votre taux de conversion en souffre. Lancez un audit IA brutal et obtenez un plan d'action priorisé en 30 secondes.`,
    },
    related: ['hero-section-losing-clients', 'perfect-above-fold-formula', 'trust-signals-2026'],
  },

  {
    slug: 'hero-section-losing-clients',
    category: 'copy',
    tag: { en: 'Copywriting', fr: 'Copywriting' },
    tagColor: '#06B6D4',
    date: 'Mar 25, 2026',
    readTime: 3,
    title: {
      en: 'Why Your Hero Section Is Losing You Clients',
      fr: 'Pourquoi Votre Section Hero Fait Fuir Vos Clients',
    },
    excerpt: {
      en: 'Clarity beats cleverness. If your hero text reads like a philosophical puzzle, you are losing money.',
      fr: 'La clarté bat la créativité. Si votre texte hero ressemble à une énigme philosophique, vous perdez de l\'argent.',
    },
    content: {
      en: `The first 5 seconds dictate whether a user stays or bounces. Your hero section is the most expensive real estate on your digital property, yet 80% of founders waste it on vague, abstract copywriting.

The hero section must instantly answer three fundamental questions:
1. **What is the product?**
2. **Who is it for?**
3. **What is the next step?**

**The Clarity Test**

Stop using phrases like "Empowering the future of synergistic paradigms." Nobody knows what that means. Instead, use "Project management software for remote marketing agencies." Boring? Maybe. Converting? Absolutely.

Here's a quick test: show your landing page to a friend who has never heard of your company. Give them exactly 5 seconds, then ask: "What does this company sell?" If they hesitate or give a vague answer, your copywriting is failing.

**The Anatomy of a High-Converting Hero**

- **The H1 (Headline):** The ultimate benefit. What will your user achieve? "Double your e-commerce revenue" is better than "The best e-commerce platform."
- **The H2 (Sub-headline):** The how. A brief explanation of the mechanism. "Powered by AI-driven personalization and automatic A/B testing."
- **The Primary CTA:** A distinct, high-contrast button telling them exactly what to do next. "Start free trial" beats "Get started" which beats "Learn more."
- **Social Proof Hook:** Directly below the CTA. "Join 2,000+ founders" or three logos of known clients.

**Common Hero Mistakes**

Mistake 1: Animating the headline with a typewriter effect that takes 8 seconds to finish. Users read the first word, give up, and leave.

Mistake 2: Using a full-screen video background. It loads slowly, distracts from your copy, and most users have it muted anyway.

Mistake 3: Making the CTA button the same color as the background. If your entire site is dark navy and your button is midnight blue, it's invisible.

Clarity beats cleverness every single time. Your headline is not a creative writing exercise. It's a sales document.`,
      fr: `Les 5 premières secondes déterminent si un utilisateur reste ou part. Votre section hero est le bien immobilier le plus précieux de votre propriété digitale, pourtant 80% des fondateurs le gaspillent avec un copywriting vague et abstrait.

La section hero doit instantanément répondre à trois questions fondamentales :
1. **Qu'est-ce que le produit ?**
2. **Pour qui est-il fait ?**
3. **Quelle est la prochaine étape ?**

**Le Test de Clarté**

Arrêtez d'utiliser des phrases comme "Révolutionner l'avenir des synergies digitales." Personne ne sait ce que cela signifie. Utilisez plutôt "Logiciel de gestion de projet pour les agences marketing à distance." Ennuyeux ? Peut-être. Convertissant ? Absolument.

Voici un test rapide : montrez votre landing page à un ami qui n'a jamais entendu parler de votre entreprise. Donnez-lui exactement 5 secondes, puis demandez : "Que vend cette entreprise ?" S'il hésite ou donne une réponse vague, votre copywriting échoue.

**L'Anatomie d'un Hero qui Convertit**

- **Le H1 (Titre) :** Le bénéfice ultime. Que va accomplir votre utilisateur ? "Doublez votre CA e-commerce" est meilleur que "La meilleure plateforme e-commerce."
- **Le H2 (Sous-titre) :** Le comment. Une brève explication du mécanisme.
- **Le CTA Principal :** Un bouton distinct et contrasté qui leur dit exactement quoi faire. "Commencer l'essai gratuit" bat "Commencer" qui bat "En savoir plus."
- **Accroche de Preuve Sociale :** Directement sous le CTA. "Rejoint par 2 000+ fondateurs" ou trois logos de clients connus.

**Erreurs Hero Courantes**

Erreur 1 : Animer le titre avec un effet machine à écrire qui prend 8 secondes. Les utilisateurs lisent le premier mot, abandonnent et partent.

Erreur 2 : Utiliser une vidéo en plein écran en arrière-plan. Elle se charge lentement, distrait de votre texte, et la plupart des utilisateurs ont le son coupé de toute façon.

Erreur 3 : Faire en sorte que le bouton CTA ait la même couleur que l'arrière-plan. Si votre site est entièrement en bleu marine foncé et que votre bouton est en bleu nuit, il est invisible.

La clarté bat la créativité à chaque fois. Votre titre n'est pas un exercice d'écriture créative. C'est un document de vente.`,
    },
    related: ['perfect-above-fold-formula', '7-signs-killing-conversions', 'headline-that-converts'],
  },

  {
    slug: '5-minute-website-audit',
    category: 'cro',
    tag: { en: 'DIY Guide', fr: 'Guide Pratique' },
    tagColor: '#EA580C',
    date: 'Mar 20, 2026',
    readTime: 3,
    title: {
      en: 'The 5-Minute Website Audit Every Founder Should Do',
      fr: 'L\'Audit de Site en 5 Minutes que Tout Fondateur Devrait Faire',
    },
    excerpt: {
      en: 'Don\'t have time or budget for a full agency audit? Do this 5-minute self-audit to find the biggest leaks.',
      fr: 'Pas de temps ou de budget pour un audit d\'agence ? Faites cet auto-audit en 5 minutes pour trouver les plus grosses fuites.',
    },
    content: {
      en: `Before you spend thousands on ads, ensure the bucket isn't leaking. You don't always need a $5,000 agency audit to find the biggest conversion killers. Here is a 5-minute framework every founder should run monthly.

**Step 1: The "Squint" Test (1 minute)**
Back up from your monitor and squint your eyes until the text is illegible. What stands out? If the primary call-to-action button doesn't immediately grab your attention as the highest-contrast element on the page, you have a visual hierarchy problem. Fix it before you do anything else.

**Step 2: The "5-Second" Test (2 minutes)**
Show your landing page to a friend who doesn't know what you do for exactly 5 seconds. Close the laptop and ask: "What does this company sell? Who is it for?" If they hesitate or get it wrong, your copywriting is failing. Not your design, not your code — your words.

**Step 3: The Mobile Navigation Check (1 minute)**
Open your site on your phone. Try to navigate to the pricing page and click the primary CTA using only your thumb while walking. If you tap the wrong link or have to zoom in, your mobile experience is broken. This alone could be costing you 40% of potential conversions.

**Step 4: Form Frictions (1 minute)**
Go to your signup or contact form. Count the fields. Every unnecessary field reduces form completion by approximately 10%. If you're asking for a phone number on a free trial signup, remove it immediately. If you're asking for a company name when it's optional — make it optional. Friction kills momentum.

**What To Do With Your Findings**

Write down every issue you found. Rank them by estimated impact. Tackle the top 3 this week. Don't try to fix everything at once — that's how nothing gets fixed.

Fixing the issues found in this 5-minute audit is often enough to lift conversions by 20% to 50%. And if you want a more thorough, AI-powered version of this process — that's exactly what Roast My Site does in 30 seconds.`,
      fr: `Avant de dépenser des milliers en publicités, assurez-vous que le seau ne fuit pas. Vous n'avez pas toujours besoin d'un audit d'agence à 5 000€ pour trouver les plus gros tueurs de conversion. Voici un framework de 5 minutes que tout fondateur devrait faire mensuellement.

**Étape 1 : Le Test du "Plissement des Yeux" (1 minute)**
Éloignez-vous de votre écran et plissez les yeux jusqu'à ce que le texte soit illisible. Qu'est-ce qui ressort ? Si le bouton d'appel à l'action principal ne retient pas immédiatement votre attention comme l'élément le plus contrasté de la page, vous avez un problème de hiérarchie visuelle.

**Étape 2 : Le Test des "5 Secondes" (2 minutes)**
Montrez votre landing page à un ami qui ne sait pas ce que vous faites, pendant exactement 5 secondes. Fermez l'ordinateur et demandez : "Que vend cette entreprise ? Pour qui ?" S'il hésite ou se trompe, votre copywriting échoue. Pas votre design, pas votre code — vos mots.

**Étape 3 : Vérification de la Navigation Mobile (1 minute)**
Ouvrez votre site sur votre téléphone. Essayez de naviguer vers la page de tarification et de cliquer sur le CTA principal en utilisant uniquement votre pouce en marchant. Si vous tapez sur le mauvais lien ou devez zoomer, votre expérience mobile est cassée.

**Étape 4 : Frictions des Formulaires (1 minute)**
Allez sur votre formulaire d'inscription ou de contact. Comptez les champs. Chaque champ inutile réduit la complétion du formulaire d'environ 10%. Si vous demandez un numéro de téléphone pour un essai gratuit, supprimez-le immédiatement.

**Que Faire de Vos Résultats**

Notez chaque problème trouvé. Classez-les par impact estimé. Attaquez-vous aux 3 premiers cette semaine. N'essayez pas de tout corriger d'un coup — c'est ainsi que rien n'est corrigé.

Corriger les problèmes trouvés dans cet audit de 5 minutes suffit souvent à augmenter les conversions de 20% à 50%.`,
    },
    related: ['7-signs-killing-conversions', 'mobile-first-checklist', 'contact-form-losing-leads'],
  },

  {
    slug: '7-deadly-sins-landing-page-design',
    category: 'ux',
    tag: { en: 'UX & Design', fr: 'UX & Design' },
    tagColor: '#8B5CF6',
    date: 'Apr 1, 2026',
    readTime: 4,
    title: {
      en: 'The 7 Deadly Sins of Landing Page Design',
      fr: 'Les 7 Péchés Capitaux du Design de Landing Page',
    },
    excerpt: {
      en: 'Design is communication, not decoration. Most landing pages commit the same fatal mistakes — here\'s how to avoid them.',
      fr: 'Le design est de la communication, pas de la décoration. La plupart des landing pages commettent les mêmes erreurs fatales.',
    },
    content: {
      en: `Design is not decoration — it's communication. A landing page lives or dies by whether a visitor instantly understands your offer, trusts you, and knows what to do next. Yet most landing pages commit the same avoidable mistakes again and again.

**Sin #1: No Clear Visual Hierarchy**
If everything on your page looks equally important, nothing is important. Your headline, subheadline, and CTA should dominate the page. Everything else supports them. A page with equal-weight typography and uniform element sizing tells the eye: "look everywhere." The result? The visitor looks nowhere.

**Sin #2: Too Many Fonts**
Three fonts on a single page signals amateur hour. Pick one display font for headlines and one readable font for body copy. Mixing five typefaces isn't creativity — it's chaos that increases cognitive load and reduces trust.

**Sin #3: Low Contrast Text**
Dark grey text on a slightly-less-dark background is invisible to a significant portion of your visitors and fatiguing for everyone else. Your body copy should pass WCAG AA contrast standards at minimum. If you have to strain to read it on your 27" Retina display, imagine how it looks to someone on an old phone in direct sunlight.

**Sin #4: Stock Photo Overuse**
The smiling businessperson in a glass office is invisible to users — they have learned to filter out generic imagery. Use real photos of your product in action, your actual team, or real customer results. Authenticity outperforms polish.

**Sin #5: Misaligned CTA Placement**
Your call to action should appear where intent is highest: immediately after your value proposition, after a strong testimonial, after a specific feature benefit. Not buried after five paragraphs of background context or legal boilerplate.

**Sin #6: Ignoring Whitespace**
The temptation to fill every pixel causes visual fatigue. Whitespace is not wasted space — it's breathing room that directs the eye, increases comprehension, and makes your content feel premium. Cramped pages feel cheap, even if the product is excellent.

**Sin #7: Desktop-Only Design Thinking**
You build your landing page on a 27" monitor and forget that 62% of your visitors will see it on a 390px-wide phone screen. Design mobile first, then scale up. The hero should work on a 4-inch screen before it works on a 4K monitor.

Run your landing page through a brutal AI audit to see exactly which of these sins your site commits — and get a concrete fix plan.`,
      fr: `Le design n'est pas de la décoration — c'est de la communication. Une landing page réussit ou échoue selon qu'un visiteur comprend instantanément votre offre, vous fait confiance et sait quoi faire ensuite. Pourtant, la plupart des landing pages commettent les mêmes erreurs évitables.

**Péché #1 : Absence de Hiérarchie Visuelle Claire**
Si tout sur votre page semble également important, rien n'est important. Votre titre, sous-titre et CTA doivent dominer la page. Une page avec une typographie de poids uniforme dit à l'œil : "regardez partout." Le résultat ? Le visiteur ne regarde nulle part.

**Péché #2 : Trop de Polices**
Trois polices sur une seule page signale le manque d'expérience. Choisissez une police d'affichage pour les titres et une police lisible pour le corps du texte. Mélanger cinq typographies augmente la charge cognitive et réduit la confiance.

**Péché #3 : Contraste Insuffisant**
Du texte gris foncé sur fond légèrement moins foncé est fatiguant pour tous et invisible pour certains. Votre corps de texte doit respecter les standards de contraste WCAG AA au minimum.

**Péché #4 : Abus de Photos Stock**
Le businessman souriant dans un bureau en verre est invisible pour les utilisateurs — ils ont appris à filtrer les images génériques. Utilisez de vraies photos de votre produit en action, de votre équipe réelle ou des résultats de vrais clients.

**Péché #5 : Placement du CTA Mal Aligné**
Votre appel à l'action doit apparaître là où l'intention est la plus forte : immédiatement après votre proposition de valeur, après un témoignage fort, après un avantage spécifique. Pas enfoui après cinq paragraphes de contexte.

**Péché #6 : Négliger les Espaces Blancs**
L'espace blanc n'est pas de l'espace gaspillé — c'est une respiration qui guide l'œil et rend votre contenu premium. Les pages encombrées semblent bon marché, même si le produit est excellent.

**Péché #7 : Conception Pensée Uniquement pour Desktop**
Vous construisez votre landing page sur un écran 27" et oubliez que 62% de vos visiteurs la verront sur un téléphone. Concevez d'abord pour mobile, puis élargissez.

Faites analyser votre landing page par un audit IA brutal pour voir exactement lesquels de ces péchés votre site commet.`,
    },
    related: ['mobile-first-checklist', '7-signs-killing-conversions', 'trust-signals-2026'],
  },

  {
    slug: 'headline-that-converts',
    category: 'copy',
    tag: { en: 'Copywriting', fr: 'Copywriting' },
    tagColor: '#06B6D4',
    date: 'Apr 3, 2026',
    readTime: 4,
    title: {
      en: 'How to Write a Hero Headline That Actually Converts',
      fr: 'Comment Écrire un Titre Hero qui Convertit Vraiment',
    },
    excerpt: {
      en: 'The formula for writing headlines that stop visitors in their tracks and push them toward buying.',
      fr: 'La formule pour écrire des titres qui stoppent les visiteurs et les poussent à acheter.',
    },
    content: {
      en: `The average website visitor decides whether to stay or leave within 5 seconds. Your hero headline is your one shot — and most headlines fail that test completely.

**The Formula That Works**

The highest-converting hero headlines share a simple structure: [Specific Outcome] for [Specific Audience] without [Main Objection].

Examples:
- "Double your e-commerce revenue without spending more on ads"
- "Project management for remote agencies — no learning curve"
- "Get your first 100 customers in 60 days or your money back"

Notice what they don't say: "Empowering synergistic innovation." "The future of work." "Your all-in-one solution." These are placeholder words that mean nothing.

**What Makes a Headline Convert**

**Specificity over cleverness.** "Save 8 hours per week" beats "Work smarter, not harder" every time. Numbers are magnets for the human brain. They create specificity and set expectations that make your product feel real and tangible.

**Outcome-led, not feature-led.** Visitors don't care about your features. They care about their results. "Automatically schedule your social media" is a feature. "Never miss a post again — schedule a week in 10 minutes" is an outcome. The difference is everything.

**Match your visitor's level of awareness.** Someone who just Googled "how to increase website conversions" already knows their problem. Don't start with the problem — offer the solution immediately and specifically.

**One headline = one promise.** As soon as you try to say two things in a headline, you say nothing. "Increase sales AND improve customer loyalty AND save time" is three promises, which registers as zero.

**The Rewrite Exercise**

Take your current headline. Ask yourself: "If I read this having never heard of my company, do I know exactly what it does, who it's for, and why I should care?" If the answer is no — rewrite it.

Test: "We help [specific type of business] achieve [specific result] by [brief mechanism]." Fill in the blanks with real specifics. That draft is almost always better than what you currently have.

A/B test two versions. Give each version 200 visits minimum. Let the data tell you the truth.

Your headline is not a creative writing exercise. It's a sales document. The most important sales document your business has.`,
      fr: `Le visiteur moyen d'un site décide de rester ou de partir en 5 secondes. Votre titre hero est votre unique chance — et la plupart des titres échouent complètement à ce test.

**La Formule qui Fonctionne**

Les titres hero qui convertissent le mieux partagent une structure simple : [Résultat Spécifique] pour [Audience Spécifique] sans [Principale Objection].

Exemples :
- "Doublez votre CA e-commerce sans dépenser plus en publicités"
- "Gestion de projet pour les agences à distance — sans courbe d'apprentissage"
- "Obtenez vos 100 premiers clients en 60 jours ou remboursé"

Remarquez ce qu'ils ne disent pas : "Révolutionner l'avenir du travail." "La solution tout-en-un." Ce sont des mots vides qui ne signifient rien.

**Ce qui Fait Convertir un Titre**

**La spécificité bat la créativité.** "Économisez 8 heures par semaine" bat "Travaillez plus intelligemment" à chaque fois. Les chiffres sont des aimants pour le cerveau humain. Ils créent de la spécificité et rendent votre produit tangible.

**Axé sur les résultats, pas les fonctionnalités.** Les visiteurs ne se soucient pas de vos fonctionnalités. Ils se soucient de leurs résultats. "Planifiez automatiquement vos réseaux sociaux" est une fonctionnalité. "Ne manquez plus jamais une publication — planifiez une semaine en 10 minutes" est un résultat.

**Un titre = une promesse.** Dès que vous essayez de dire deux choses dans un titre, vous ne dites rien. Concentrez-vous sur la promesse la plus importante pour votre client idéal.

**L'Exercice de Réécriture**

Prenez votre titre actuel. Demandez-vous : "Si je lisais cela sans avoir jamais entendu parler de mon entreprise, est-ce que je sais exactement ce qu'elle fait, pour qui, et pourquoi je devrais m'y intéresser ?" Si la réponse est non — réécrivez-le.

Testez : "Nous aidons [type spécifique d'entreprise] à atteindre [résultat spécifique] grâce à [bref mécanisme]." Remplissez les blancs avec de vraies informations. Ce brouillon est presque toujours meilleur que ce que vous avez actuellement.`,
    },
    related: ['hero-section-losing-clients', 'perfect-above-fold-formula', '7-deadly-sins-landing-page-design'],
  },

  {
    slug: 'contact-form-losing-leads',
    category: 'cro',
    tag: { en: 'Conversion Rate', fr: 'Taux de Conversion' },
    tagColor: '#F97316',
    date: 'Apr 5, 2026',
    readTime: 3,
    title: {
      en: 'Why Your Contact Form Is Losing You 80% of Leads',
      fr: 'Pourquoi Votre Formulaire de Contact Vous Fait Perdre 80% de vos Leads',
    },
    excerpt: {
      en: 'The average contact form abandonment rate is 81%. Here\'s the exact friction points killing your lead flow.',
      fr: 'Le taux d\'abandon des formulaires de contact est de 81%. Voici les frictions exactes qui tuent votre flux de leads.',
    },
    content: {
      en: `The average contact form abandonment rate is 81%. Eight out of ten people who start filling out your contact form never finish it. Here's why — and how to fix it.

**The Field Count Problem**

Research from various conversion optimization studies consistently shows: every additional field in a form reduces completion by roughly 10%. A form with 7 fields converts at roughly half the rate of a form with 3 fields. Yet the average contact form has 5-7 fields, many of which are completely unnecessary at the initial contact stage.

The golden rule: only ask for what you genuinely need to have a useful first conversation. Usually, that's name, email, and a brief description. Phone number? Skip it. Company size? Not yet. LinkedIn profile? Absolutely not.

**The Trust Gap**

Your form needs to earn trust before a visitor will share their contact information. Add:
- A privacy note ("We never share your info. One reply, within 48h.")
- Social proof nearby ("Join 500+ founders who've reached out")
- A human face and name attached to the form ("Enzo will read your message personally")

A form that sits in a sterile white box with no context converts at a fraction of the rate of a form surrounded by trust signals.

**The CTA Button Problem**

"Submit" is the worst possible CTA on a contact form. It's passive, generic, and sounds like you're submitting to some bureaucratic process. Instead, use:
- "Send my question"
- "Get in touch"
- "Start the conversation"

The button copy should describe the outcome of clicking it, not the mechanical action of clicking it.

**The Confirmation Problem**

What happens after someone submits your form? If the answer is "they get a generic 'Form submitted' message and nothing else," you're creating anxiety. Tell them: what happens next, who will reply, when they'll hear back. "Thanks! Enzo will reply within 48 hours to your email" is infinitely better than "Form submitted successfully."

**The Mobile Problem**

Check your form on mobile. Are the fields large enough to tap without zooming? Does the keyboard cover the submit button? Is autocomplete enabled? These seem minor but can kill mobile form completion entirely.

Fix these five issues and your contact form conversion rate will improve dramatically. The leads were always there — your form was just chasing them away.`,
      fr: `Le taux moyen d'abandon des formulaires de contact est de 81%. Huit personnes sur dix qui commencent à remplir votre formulaire de contact ne le terminent jamais. Voici pourquoi — et comment y remédier.

**Le Problème du Nombre de Champs**

Les recherches en optimisation de conversion montrent systématiquement : chaque champ supplémentaire dans un formulaire réduit la complétion d'environ 10%. Un formulaire avec 7 champs convertit environ deux fois moins bien qu'un formulaire avec 3 champs. Pourtant, le formulaire de contact moyen a 5 à 7 champs, dont beaucoup sont complètement inutiles au stade du premier contact.

La règle d'or : ne demandez que ce dont vous avez réellement besoin pour avoir une première conversation utile. Généralement, c'est le nom, l'email et une brève description. Numéro de téléphone ? Pas maintenant. Taille de l'entreprise ? Pas encore.

**Le Fossé de Confiance**

Votre formulaire doit établir la confiance avant qu'un visiteur partage ses coordonnées. Ajoutez :
- Une note de confidentialité ("Nous ne partageons jamais vos données. Une réponse, sous 48h.")
- De la preuve sociale à proximité ("Plus de 500 fondateurs nous ont déjà contactés")
- Un visage humain et un nom associé au formulaire

**Le Problème du Bouton CTA**

"Envoyer" est le pire CTA possible sur un formulaire. Utilisez plutôt :
- "Envoyer ma question"
- "Prendre contact"
- "Démarrer la conversation"

Le texte du bouton doit décrire le résultat du clic, pas l'action mécanique de cliquer.

**Le Problème de la Confirmation**

Ce qui se passe après la soumission du formulaire est crucial. Dites-leur : ce qui se passe ensuite, qui va répondre, quand ils auront une réponse. "Merci ! Enzo répondra sous 48 heures à votre email" est infiniment mieux que "Formulaire soumis avec succès."

Corrigez ces cinq problèmes et votre taux de conversion de formulaire s'améliorera considérablement. Les leads étaient là — votre formulaire les chassait simplement.`,
    },
    related: ['5-minute-website-audit', '7-signs-killing-conversions', 'social-proof-guide'],
  },

  {
    slug: 'mobile-first-checklist',
    category: 'ux',
    tag: { en: 'UX & Design', fr: 'UX & Design' },
    tagColor: '#8B5CF6',
    date: 'Apr 7, 2026',
    readTime: 4,
    title: {
      en: 'The Mobile-First Checklist Every Website Needs',
      fr: 'La Checklist Mobile-First que Chaque Site Devrait Avoir',
    },
    excerpt: {
      en: '62% of traffic is mobile. If your site isn\'t built for thumbs, you\'re losing more than half your potential customers.',
      fr: '62% du trafic est mobile. Si votre site n\'est pas conçu pour les pouces, vous perdez plus de la moitié de vos clients potentiels.',
    },
    content: {
      en: `62% of all web traffic is mobile. Yet most websites are still designed on desktop monitors and "made responsive" as an afterthought. Here's the definitive checklist for a mobile experience that converts.

**Typography**
☐ Minimum 16px base font size (below this, iOS auto-zooms, breaking your layout)
☐ Line height 1.5-1.7 for body text (cramped lines are unreadable on small screens)
☐ Headlines no larger than 2.5rem on mobile (prevent horizontal overflow)
☐ Sufficient contrast — WCAG AA minimum (outdoor lighting is brutal)

**Buttons & Tap Targets**
☐ Minimum 44x44px tap target size (Apple's HIG recommendation)
☐ At least 8px spacing between adjacent tap targets
☐ Primary CTA visible without scrolling on mobile viewport
☐ No hover-only states (there's no hover on touch)

**Forms**
☐ Correct input types (type="email", type="tel", type="number") to trigger appropriate keyboards
☐ Autocomplete attributes on name and email fields
☐ Form submit button visible when keyboard is open
☐ Labels above inputs, not placeholder-only (placeholders disappear when typing)

**Navigation**
☐ Hamburger menu or bottom navigation bar (max 5 items)
☐ Logo links back to home (users expect this)
☐ Search accessible from main nav
☐ No dropdown menus that require hover

**Performance**
☐ Images optimized and served in WebP format
☐ Core Web Vitals: LCP under 2.5s on mobile network
☐ No render-blocking scripts
☐ Fonts subset to only characters used

**Layout**
☐ Single column layout on viewport widths below 768px
☐ No horizontal overflow (test by setting viewport to 320px)
☐ Sticky header doesn't consume more than 10% of viewport height
☐ No fixed-width containers exceeding viewport width

**Testing Protocol**
Don't just resize your browser. Test on a real device — or at minimum, use Chrome DevTools device emulation with a throttled connection. Test with your non-dominant thumb. If you can complete your primary conversion action (signup, purchase, contact) one-handed, you pass.

If you want a quick automated check of your mobile experience, run your URL through Roast My Site — mobile experience is one of the 7 scored dimensions.`,
      fr: `62% de tout le trafic web est mobile. Pourtant, la plupart des sites sont encore conçus sur des moniteurs desktop et "rendus responsives" en tant qu'afterthought. Voici la checklist définitive pour une expérience mobile qui convertit.

**Typographie**
☐ Taille de police de base minimum 16px
☐ Interlignage 1.5-1.7 pour le corps du texte
☐ Titres pas plus larges que 2.5rem sur mobile
☐ Contraste suffisant — minimum WCAG AA

**Boutons & Zones Tactiles**
☐ Taille de zone tactile minimum 44x44px
☐ Au moins 8px d'espacement entre les zones tactiles adjacentes
☐ CTA principal visible sans défilement sur la fenêtre mobile
☐ Pas d'états uniquement au survol (il n'y a pas de survol sur tactile)

**Formulaires**
☐ Types d'entrée corrects (type="email", type="tel") pour déclencher les bons claviers
☐ Attributs d'autocomplétion sur les champs nom et email
☐ Bouton de soumission visible quand le clavier est ouvert
☐ Libellés au-dessus des champs, pas uniquement des placeholders

**Navigation**
☐ Menu hamburger ou barre de navigation inférieure (5 éléments max)
☐ Le logo renvoie à la page d'accueil
☐ Pas de menus déroulants nécessitant le survol

**Performance**
☐ Images optimisées et servies en format WebP
☐ Core Web Vitals : LCP sous 2,5s sur réseau mobile
☐ Pas de scripts bloquant le rendu

**Mise en Page**
☐ Mise en page en colonne unique en dessous de 768px
☐ Pas de débordement horizontal
☐ L'en-tête fixe ne consomme pas plus de 10% de la hauteur de la fenêtre

**Protocole de Test**
Ne vous contentez pas de redimensionner votre navigateur. Testez sur un vrai appareil. Testez avec votre pouce non dominant. Si vous pouvez accomplir votre action de conversion principale en une main, vous passez le test.`,
    },
    related: ['7-deadly-sins-landing-page-design', '7-signs-killing-conversions', 'page-speed-conversion'],
  },

  {
    slug: 'social-proof-guide',
    category: 'cro',
    tag: { en: 'Conversion Rate', fr: 'Taux de Conversion' },
    tagColor: '#F97316',
    date: 'Apr 9, 2026',
    readTime: 5,
    title: {
      en: 'Social Proof: The Complete Guide for Small Businesses',
      fr: 'Preuve Sociale : Le Guide Complet pour les Petites Entreprises',
    },
    excerpt: {
      en: '92% of consumers read reviews before buying. Social proof isn\'t optional — here\'s how to use it strategically.',
      fr: '92% des consommateurs lisent des avis avant d\'acheter. La preuve sociale n\'est pas optionnelle — voici comment l\'utiliser stratégiquement.',
    },
    content: {
      en: `92% of consumers read reviews before making a purchase decision. Social proof isn't optional — it's one of the most powerful conversion tools available to any business. Here's a complete strategy for small businesses with limited social proof.

**The 6 Types of Social Proof**

**1. Customer Reviews & Testimonials**
The most powerful type. A specific, outcome-focused testimonial ("We doubled our trial signups in 3 weeks") is worth ten generic ones ("Great service!"). Collect testimonials by asking customers 30 days after purchase, when results are measurable.

**2. Usage Statistics**
"Trusted by 2,000+ companies" or "500,000 URLs analyzed." Numbers signal that others have already made the leap. If you're early stage, use more specific metrics: "47 founders have roasted their site this week."

**3. Client Logos**
A row of recognizable logos communicates credibility instantly. Even small businesses often work with notable clients. Ask permission and display them proudly. Three impressive logos outperform twenty unknown ones.

**4. Press & Media Mentions**
"As featured in" with media logos creates powerful third-party validation. PR isn't just for enterprises — even a mention in a niche newsletter counts.

**5. Case Studies**
Detailed before/after stories with specific numbers. "From 1.2% to 2.8% add-to-cart rate after fixing CTA placement." Specificity creates believability.

**6. Real-Time Signals**
"23 people are viewing this page right now" or "Last purchased 2 hours ago." Used ethically, these create urgency and demonstrate popularity.

**Strategic Placement**

Don't bury your social proof in a testimonials section at the bottom. Place it:
- Immediately below the hero CTA (highest-impact location)
- Near the pricing section (where doubt peaks)
- On the checkout page (where abandonment peaks)
- In remarketing ads (reminder for people who didn't convert)

**Getting Your First Reviews**

Ask directly, immediately after a positive interaction. "We're a small team building something we believe in — an honest review would mean the world to us." Personalized requests get 5x more responses than automated ones. Offer nothing in return (beyond your sincere gratitude) — reviews earned are more credible.

Social proof compounds. The more you have, the easier it is to get more. Start collecting now, display what you have, and optimize placement strategically.`,
      fr: `92% des consommateurs lisent des avis avant de prendre une décision d'achat. La preuve sociale n'est pas optionnelle — c'est l'un des outils de conversion les plus puissants disponibles. Voici une stratégie complète pour les petites entreprises.

**Les 6 Types de Preuve Sociale**

**1. Avis & Témoignages Clients**
Le type le plus puissant. Un témoignage spécifique, axé sur les résultats ("Nous avons doublé nos inscriptions en 3 semaines") vaut dix témoignages génériques ("Super service !"). Collectez des témoignages en demandant aux clients 30 jours après l'achat, quand les résultats sont mesurables.

**2. Statistiques d'Utilisation**
"Approuvé par 2 000+ entreprises" ou "500 000 URLs analysées." Les chiffres signalent que d'autres ont déjà fait le pas. Si vous êtes en phase de démarrage, utilisez des métriques plus spécifiques : "47 fondateurs ont audité leur site cette semaine."

**3. Logos Clients**
Une rangée de logos reconnaissables communique la crédibilité instantanément. Même les petites entreprises travaillent souvent avec des clients notables. Demandez la permission et affichez-les fièrement.

**4. Mentions Presse & Médias**
"Comme mentionné dans" avec des logos de médias crée une validation tierce puissante. Les RP ne sont pas réservés aux grandes entreprises — même une mention dans une newsletter de niche compte.

**5. Études de Cas**
Des histoires détaillées avant/après avec des chiffres spécifiques. "De 1,2% à 2,8% de taux d'ajout au panier après correction du placement du CTA." La spécificité crée la crédibilité.

**6. Signaux en Temps Réel**
"23 personnes consultent cette page en ce moment" ou "Dernier achat il y a 2 heures." Utilisés éthiquement, ils créent l'urgence.

**Placement Stratégique**

N'enterrez pas votre preuve sociale dans une section de témoignages en bas de page. Placez-la :
- Immédiatement sous le CTA hero (emplacement à plus fort impact)
- Près de la section tarification (où le doute est maximal)
- Sur la page de paiement (où l'abandon est maximal)

**Obtenir vos Premiers Avis**

Demandez directement, immédiatement après une interaction positive. Une demande personnalisée reçoit 5x plus de réponses qu'une demande automatisée. La preuve sociale se compose — commencez à la collecter maintenant.`,
    },
    related: ['7-signs-killing-conversions', 'trust-signals-2026', 'cta-restaurant-case-study'],
  },

  {
    slug: 'french-sme-website-analysis',
    category: 'cases',
    tag: { en: 'Case Studies', fr: 'Études de Cas' },
    tagColor: '#10B981',
    date: 'Apr 11, 2026',
    readTime: 6,
    title: {
      en: 'How We Analyzed 100+ French SME Websites (And What We Found)',
      fr: 'Comment Nous Avons Analysé 100+ Sites de PME Françaises (Et Ce que Nous Avons Trouvé)',
    },
    excerpt: {
      en: 'After running audits on over 100 French SME websites, the same 5 mistakes show up again and again.',
      fr: 'Après avoir audité plus de 100 sites de PME françaises, les mêmes 5 erreurs reviennent encore et encore.',
    },
    content: {
      en: `After running AI-powered audits on over 100 French small and medium enterprise websites across sectors including retail, services, crafts, and professional services, clear patterns emerged. Here's what we found.

**The Average Score: 4.2/10**

The average global score across our sample was 4.2 out of 10. Broken down by dimension:
- First Impression: 4.0/10 (most commonly flagged: unclear hero messaging)
- Visual Design: 5.1/10 (often functional, rarely optimized)
- Copywriting: 3.8/10 (worst performing dimension overall)
- Trust Signals: 3.9/10 (missing or poorly placed)
- Mobile Experience: 4.4/10
- Navigation: 5.3/10
- Conversion Architecture: 3.2/10 (worst performing dimension)

**The Top 5 Issues**

**Issue #1: No Clear Value Proposition (Found in 78% of sites)**
The most common problem was a hero section that described what the company does without explaining why a visitor should care. "Nous sommes un cabinet de comptabilité à Lyon" is a description. "Économisez 40% sur votre comptabilité sans changer de comptable" is a value proposition.

**Issue #2: No CTA Above the Fold (Found in 71% of sites)**
71% of sites had no clickable call-to-action visible without scrolling. The primary action was often buried in the footer, accessible only after reading several paragraphs.

**Issue #3: No Testimonials or Reviews (Found in 67% of sites)**
Two-thirds of SMEs had no social proof whatsoever on their landing page. Many had strong client relationships and excellent results — they just hadn't asked clients to write a few words.

**Issue #4: Non-Functional Mobile Experience (Found in 58% of sites)**
More than half had significant mobile issues: text too small to read, buttons too small to tap, images overflowing their containers, or forms that were nearly impossible to complete on mobile.

**Issue #5: No Contact Path on the Homepage (Found in 52% of sites)**
More than half required visitors to navigate to a separate "Contact" page to find any way to reach the business. The phone number wasn't in the header. The email wasn't visible. You had to hunt.

**The Good News**

Of the sites scoring below 4/10 initially, those that implemented the top 3 recommendations from their report saw an average score improvement to 6.8/10 on re-audit. The problems are almost always fixable — the challenge is knowing where to look.

Run your own audit at Roast My Site and compare your score against these benchmarks.`,
      fr: `Après avoir effectué des audits IA sur plus de 100 sites de PME françaises dans des secteurs incluant le commerce de détail, les services, l'artisanat et les services professionnels, des tendances claires ont émergé. Voici ce que nous avons trouvé.

**Le Score Moyen : 4,2/10**

Le score global moyen sur notre échantillon était de 4,2 sur 10. Par dimension :
- Première Impression : 4,0/10 (le plus souvent signalé : message hero peu clair)
- Design Visuel : 5,1/10 (souvent fonctionnel, rarement optimisé)
- Copywriting : 3,8/10 (dimension la moins bien notée globalement)
- Signaux de Confiance : 3,9/10 (absents ou mal placés)
- Expérience Mobile : 4,4/10
- Navigation : 5,3/10
- Architecture de Conversion : 3,2/10 (pire dimension)

**Les 5 Principaux Problèmes**

**Problème #1 : Pas de Proposition de Valeur Claire (Présent dans 78% des sites)**
Le problème le plus courant était une section hero qui décrivait ce que l'entreprise fait sans expliquer pourquoi un visiteur devrait s'en soucier. "Nous sommes un cabinet de comptabilité à Lyon" est une description. "Économisez 40% sur votre comptabilité sans changer de comptable" est une proposition de valeur.

**Problème #2 : Pas de CTA au-dessus de la Ligne de Flottaison (71% des sites)**
71% des sites n'avaient aucun appel à l'action cliquable visible sans défilement. L'action principale était souvent enterrée dans le pied de page.

**Problème #3 : Pas de Témoignages ni d'Avis (67% des sites)**
Deux tiers des PME n'avaient aucune preuve sociale sur leur landing page. Beaucoup avaient d'excellentes relations clients — elles n'avaient simplement pas demandé à leurs clients d'écrire quelques mots.

**Problème #4 : Expérience Mobile Non Fonctionnelle (58% des sites)**
Plus de la moitié avaient des problèmes mobiles significatifs : texte trop petit, boutons trop petits, images débordant de leurs conteneurs.

**Problème #5 : Pas de Chemin de Contact sur la Page d'Accueil (52% des sites)**
Plus de la moitié obligeaient les visiteurs à naviguer vers une page "Contact" séparée pour trouver un moyen de joindre l'entreprise.

**La Bonne Nouvelle**

Des sites ayant initialement scoré sous 4/10, ceux qui ont mis en œuvre les 3 premières recommandations de leur rapport ont vu leur score moyen passer à 6,8/10 lors d'un re-audit. Les problèmes sont presque toujours réparables — le défi est de savoir où chercher.`,
    },
    related: ['7-signs-killing-conversions', 'social-proof-guide', 'cta-restaurant-case-study'],
  },

  {
    slug: 'page-speed-conversion',
    category: 'seo',
    tag: { en: 'SEO', fr: 'SEO' },
    tagColor: '#F59E0B',
    date: 'Apr 13, 2026',
    readTime: 4,
    title: {
      en: 'Page Speed vs Conversion Rate: The Hidden Link',
      fr: 'Vitesse de Page vs Taux de Conversion : Le Lien Caché',
    },
    excerpt: {
      en: 'A 1-second delay in page load time reduces conversions by up to 20%. Here\'s the data — and what to do about it.',
      fr: 'Un délai de 1 seconde dans le temps de chargement réduit les conversions jusqu\'à 20%. Voici les données — et comment agir.',
    },
    content: {
      en: `A 1-second delay in page load time reduces conversions by 7-20% depending on your industry. For an e-commerce store doing €100k/month, that's potentially €20k lost per second of load time. This isn't theoretical — it's been measured repeatedly across thousands of real businesses.

**Why Speed Kills Conversions**

The relationship isn't just about patience. Loading time affects:

**1. First impressions.** A slow site feels untrustworthy. If your product takes 6 seconds to load, visitors assume your checkout will be buggy, your support will be slow, and your company isn't serious. Speed communicates professionalism.

**2. Bounce rate.** 53% of mobile users abandon a site that takes more than 3 seconds to load. These users never see your value proposition. They never read your testimonials. They're gone before the page finishes loading.

**3. SEO rankings.** Core Web Vitals are a Google ranking factor. A slow site ranks lower in search results, meaning less organic traffic to begin with. Speed affects both the top of funnel (discovery) and bottom of funnel (conversion).

**The Numbers**

- Amazon found that every 100ms of additional load time cost them 1% in sales
- Walmart saw a 2% conversion improvement for every 1-second improvement in load time
- Mozilla reduced page load by 2.2 seconds and saw 60 million more downloads per year

**The Quick Wins**

These fixes typically deliver the biggest speed improvements for the least effort:

**Image optimization:** Convert to WebP format, compress without visible quality loss, and lazy-load images below the fold. Images are typically 70-80% of page weight. This single fix can cut load time in half.

**Remove render-blocking resources:** Defer non-critical JavaScript. Inline critical CSS. Move script tags to just before the closing body tag. These changes allow the visible content to render before the JS finishes loading.

**Use a CDN:** A Content Delivery Network serves your static assets from servers geographically close to your visitors. Critical for businesses with European and US audiences.

**Enable caching:** Set proper Cache-Control headers so repeat visitors load your site from their browser cache rather than hitting your server again.

**Measure First**

Before optimizing, measure. Use Google PageSpeed Insights (free) to get your current Core Web Vitals scores on both mobile and desktop. Fix the lowest scores first. Re-measure after each change.

Speed is infrastructure. Invest in it like you invest in your copy and design.`,
      fr: `Un délai d'une seconde dans le temps de chargement réduit les conversions de 7 à 20% selon votre secteur. Pour une boutique e-commerce faisant 100 000€/mois, c'est potentiellement 20 000€ perdus par seconde de temps de chargement. Ce n'est pas théorique — c'est mesuré répétitivement sur des milliers d'entreprises réelles.

**Pourquoi la Vitesse Tue les Conversions**

La relation n'est pas seulement une question de patience. Le temps de chargement affecte :

**1. Les premières impressions.** Un site lent semble peu fiable. Si votre produit prend 6 secondes à charger, les visiteurs supposent que votre checkout sera bugué, votre support lent, et votre entreprise peu sérieuse.

**2. Le taux de rebond.** 53% des utilisateurs mobiles abandonnent un site qui prend plus de 3 secondes à charger.

**3. Le classement SEO.** Les Core Web Vitals sont un facteur de classement Google. Un site lent se classe moins bien dans les résultats de recherche.

**Les Chiffres**

- Amazon a constaté que chaque 100ms supplémentaires leur coûtait 1% de ventes
- Walmart a vu une amélioration de 2% des conversions pour chaque seconde gagnée
- Mozilla a réduit le temps de chargement de 2,2 secondes et vu 60 millions de téléchargements supplémentaires par an

**Les Gains Rapides**

**Optimisation des images :** Convertissez en WebP, compressez, et chargez paresseusement les images sous la ligne de flottaison. Les images représentent 70 à 80% du poids des pages. Cette correction peut réduire le temps de chargement de moitié.

**Supprimez les ressources bloquant le rendu :** Différez le JavaScript non critique. Inlinez le CSS critique. Ces changements permettent au contenu visible de se rendre avant que le JS finisse de se charger.

**Utilisez un CDN :** Un réseau de distribution de contenu sert vos ressources statiques depuis des serveurs géographiquement proches de vos visiteurs.

**Mesurez d'Abord**

Avant d'optimiser, mesurez. Utilisez Google PageSpeed Insights pour obtenir vos scores Core Web Vitals actuels sur mobile et desktop. Corrigez les scores les plus bas en premier.`,
    },
    related: ['mobile-first-checklist', '7-signs-killing-conversions', 'french-sme-website-analysis'],
  },

  {
    slug: 'perfect-above-fold-formula',
    category: 'copy',
    tag: { en: 'Copywriting', fr: 'Copywriting' },
    tagColor: '#06B6D4',
    date: 'Apr 15, 2026',
    readTime: 4,
    title: {
      en: 'The Perfect Above-the-Fold Formula',
      fr: 'La Formule Parfaite pour le Au-dessus de la Ligne de Flottaison',
    },
    excerpt: {
      en: '80% of visitors never scroll past the fold. Everything that matters must fit in that first viewport.',
      fr: '80% des visiteurs ne font jamais défiler au-delà de la ligne de flottaison. Tout ce qui compte doit tenir dans cette première vue.',
    },
    content: {
      en: `80% of visitors never scroll below the fold. Your entire case for conversion must live in that first viewport — what's visible before any scrolling. Most sites waste this prime real estate. Here's the formula for using it perfectly.

**What "Above the Fold" Actually Means in 2026**

The term comes from newspaper design — the content visible before folding the paper. Digitally, it's everything visible in the browser viewport without scrolling. The challenge: there is no single "fold." Viewport sizes range from 320px on small phones to 2560px on ultrawide monitors. Design for the most common: 375px wide, 812px tall on mobile.

**The 5 Elements Every Above-the-Fold Must Have**

**1. The Navigation Bar (10% of height)**
Logo left, main links right, one primary CTA button. Nothing else. The nav bar signals what kind of company you are within 0.05 seconds of page load.

**2. The Headline (25% of height)**
One sentence. The ultimate outcome for your ideal customer. Maximum 10 words. "AI website audits in 30 seconds" is perfect. "Discover the power of our revolutionary AI-driven website analysis platform that helps businesses optimize their online presence" is a disaster.

**3. The Sub-headline (10% of height)**
Support the headline with the how and who. "Paste your URL. Get a brutally honest score with a fix plan. Free for your first audit."

**4. The Primary CTA (10% of height)**
One button. High contrast. Outcome-focused text ("Roast my site free"). Positioned immediately below or beside the headline.

**5. Social Proof Anchor (10% of height)**
Not a full testimonials section — just a hook. "★★★★★ Trusted by 2,000+ founders" or a row of 3-4 client logos. This one element alone can lift above-fold conversion by 15-25%.

**What NOT to Have Above the Fold**

- An autoplay video (delays load, distracts from copy)
- A cookie consent banner that covers 40% of the screen
- A pop-up that fires within 0s of page load
- Three competing CTAs ("Sign up" / "Learn more" / "Watch demo")
- A navigation with 8+ items

**The Formula in Practice**

The fold is the most battle-tested real estate on the internet. Every element competing for that space must justify its presence. Ask of each element: "Does this move a visitor toward taking the primary action?" If not, move it below the fold.

Test your above-fold section separately from everything else. Change one element at a time. Measure the impact on your primary CTA click rate. This is where most conversion gains live.`,
      fr: `80% des visiteurs ne font jamais défiler au-delà de la ligne de flottaison. Votre argumentaire de conversion entier doit vivre dans cette première vue — ce qui est visible avant tout défilement. Voici la formule pour utiliser cet espace parfaitement.

**Ce que "Au-dessus de la Ligne de Flottaison" Signifie Vraiment en 2026**

Le terme vient du design de journaux. Digitalement, c'est tout ce qui est visible dans le viewport du navigateur sans défilement. Le défi : il n'y a pas de "ligne" unique. Les tailles de viewport vont de 320px sur petits téléphones à 2560px sur écrans ultra-larges.

**Les 5 Éléments que Chaque Zone au-dessus de la Ligne Doit Avoir**

**1. La Barre de Navigation (10% de hauteur)**
Logo gauche, liens principaux droite, un seul bouton CTA principal. Rien d'autre.

**2. Le Titre (25% de hauteur)**
Une phrase. Le résultat ultime pour votre client idéal. Maximum 10 mots. "Audits de site IA en 30 secondes" est parfait.

**3. Le Sous-titre (10% de hauteur)**
Soutenez le titre avec le comment et le pour qui. "Collez votre URL. Obtenez un score brutal avec un plan d'action. Gratuit pour votre premier audit."

**4. Le CTA Principal (10% de hauteur)**
Un bouton. Contraste élevé. Texte axé sur le résultat. Positionné immédiatement sous ou à côté du titre.

**5. Ancre de Preuve Sociale (10% de hauteur)**
Pas une section complète de témoignages — juste un accrochage. "★★★★★ Approuvé par 2 000+ fondateurs" ou une rangée de 3 à 4 logos clients.

**Ce qu'il NE FAUT PAS Avoir au-dessus de la Ligne**

- Une vidéo en lecture automatique
- Une bannière de consentement aux cookies qui couvre 40% de l'écran
- Une pop-up qui se déclenche dans les 0 secondes du chargement
- Trois CTA concurrents
- Une navigation avec 8+ éléments

La ligne de flottaison est l'espace le plus testé sur Internet. Chaque élément qui y concourt doit justifier sa présence. Demandez de chaque élément : "Est-ce que cela rapproche un visiteur de l'action principale ?" Sinon, déplacez-le en dessous.`,
    },
    related: ['headline-that-converts', 'hero-section-losing-clients', '7-deadly-sins-landing-page-design'],
  },

  {
    slug: 'trust-signals-2026',
    category: 'cro',
    tag: { en: 'Conversion Rate', fr: 'Taux de Conversion' },
    tagColor: '#F97316',
    date: 'Apr 17, 2026',
    readTime: 4,
    title: {
      en: 'Trust Signals That Actually Work in 2026',
      fr: 'Les Signaux de Confiance qui Fonctionnent Vraiment en 2026',
    },
    excerpt: {
      en: 'The old trust badges don\'t work anymore. Here\'s what modern visitors actually look for before handing over their email or credit card.',
      fr: 'Les vieux badges de confiance ne fonctionnent plus. Voici ce que les visiteurs modernes recherchent vraiment.',
    },
    content: {
      en: `Trust is the currency of conversion. A visitor doesn't hand over their email address, credit card number, or personal information to a company they don't trust. Here's what actually signals trust to visitors in 2026 — and what doesn't anymore.

**What Doesn't Work Anymore**

**Generic security badges.** "256-bit SSL Encrypted" badges with a padlock have lost their power. Every website has HTTPS now. The padlock in the browser URL bar is sufficient. Cluttering your checkout page with meaningless security logos adds visual noise without adding trust.

**"Award-winning" claims without specifics.** "Award-Winning Service Since 2019" means nothing without naming the award. Who gave it? For what? When exactly?

**Stock photo teams.** Visitors have become expert at detecting fake team photos. If your "about us" page shows a diverse group of impossibly attractive people in a modern office, visitors know they're looking at a stock photo. This actively destroys trust.

**What Works**

**Specific numbers, not vague claims.** "247 businesses audited this week" is trustworthy. "Trusted by thousands" isn't. Specificity signals that someone actually counted — that the number is real.

**Real people with real names.** A founder's face and name converts better than a logo every time. "Enzo will personally read your message" on a contact form is worth more than "our team will respond shortly."

**Response time commitments you keep.** "We respond within 24 hours" is a trust signal only if you actually respond within 24 hours. It's a trust destroyer if you respond in 72. Underpromise and overdeliver.

**User-generated content.** A screenshot of a real tweet is more credible than a polished testimonial card. Raw and authentic beats polished and generic.

**Money-back guarantee with clear terms.** "30-day money-back guarantee, no questions asked" is one of the most powerful conversion tools available. A clear, no-hassle refund policy removes risk from the buyer's decision. Note: if your product has hard delivery costs (like AI API fees), explain why a refund isn't possible — that transparency is itself a trust signal.

**Domain age and consistency.** A company that has been at the same domain for 5 years signals stability. New domain + urgent CTAs + vague team info = low trust.

**The Trust Audit**

Evaluate every claim on your site: is it specific, verifiable, and consistent with who you actually are? Remove everything that's generic, unverifiable, or borrowed from a template. Replace it with specific, real, verifiable proof.

Trust isn't built with badges. It's built with specificity, transparency, and consistency.`,
      fr: `La confiance est la monnaie de la conversion. Un visiteur ne donne pas son adresse email, son numéro de carte bancaire, ou ses informations personnelles à une entreprise en qui il n'a pas confiance. Voici ce qui signale vraiment la confiance aux visiteurs en 2026.

**Ce qui Ne Fonctionne Plus**

**Les badges de sécurité génériques.** Les badges "Chiffrement SSL 256 bits" ont perdu leur pouvoir. Chaque site a maintenant HTTPS. Le cadenas dans la barre d'URL du navigateur est suffisant.

**Les revendications "primé" sans précisions.** "Service Primé depuis 2019" ne signifie rien sans nommer le prix. Qui l'a décerné ? Pour quoi ? Quand exactement ?

**Les photos d'équipe stock.** Les visiteurs sont devenus experts pour détecter les fausses photos d'équipe. Si votre page "à propos" montre un groupe diversifié de personnes dans un bureau moderne, les visiteurs savent qu'ils regardent une photo stock. Cela détruit activement la confiance.

**Ce qui Fonctionne**

**Des chiffres spécifiques, pas des affirmations vagues.** "247 entreprises auditées cette semaine" est crédible. "Approuvé par des milliers" ne l'est pas. La spécificité signale que quelqu'un a réellement compté.

**De vraies personnes avec de vrais noms.** Le visage et le nom d'un fondateur convertissent mieux qu'un logo à chaque fois.

**Des engagements sur les délais de réponse que vous respectez.** "Nous répondons sous 24 heures" n'est un signal de confiance que si vous répondez réellement sous 24 heures.

**Le Contenu Généré par les Utilisateurs.** Une capture d'écran d'un vrai tweet est plus crédible qu'une carte de témoignage soignée. L'authentique bat le poli.

**Garantie de remboursement avec conditions claires.** "Remboursement 30 jours, sans questions" est l'un des outils de conversion les plus puissants disponibles. Si votre produit a des coûts de livraison difficiles, expliquez pourquoi — cette transparence est elle-même un signal de confiance.

**L'Audit de Confiance**

Évaluez chaque affirmation sur votre site : est-elle spécifique, vérifiable et cohérente avec qui vous êtes réellement ? Supprimez tout ce qui est générique, invérifiable ou emprunté à un modèle. La confiance ne se construit pas avec des badges. Elle se construit avec spécificité, transparence et cohérence.`,
    },
    related: ['social-proof-guide', '7-signs-killing-conversions', 'contact-form-losing-leads'],
  },

  {
    slug: 'cta-restaurant-case-study',
    category: 'cases',
    tag: { en: 'Case Studies', fr: 'Études de Cas' },
    tagColor: '#10B981',
    date: 'Apr 19, 2026',
    readTime: 4,
    title: {
      en: 'Before & After: How One CTA Change Doubled a Restaurant\'s Online Reservations',
      fr: 'Avant & Après : Comment un Changement de CTA a Doublé les Réservations en Ligne d\'un Restaurant',
    },
    excerpt: {
      en: 'A small bistro in Bordeaux went from 12 to 26 weekly online reservations by changing one button. Here\'s the full story.',
      fr: 'Un petit bistrot à Bordeaux est passé de 12 à 26 réservations en ligne hebdomadaires en changeant un seul bouton. Voici l\'histoire complète.',
    },
    content: {
      en: `A small family-run bistro in Bordeaux was struggling with online reservations. They had a working website, a decent Google Maps presence, and strong word-of-mouth. Yet their online reservation rate was averaging 12 bookings per week — far below their capacity of 40+ covers.

**The Audit Findings**

When the owner ran the site through Roast My Site, several issues surfaced. But one stood out as the clear culprit: the reservation CTA.

The original button read: **"Reservations"**

It was placed in the middle of the page, following three paragraphs about the restaurant's history and philosophy. The button was styled in a muted green that blended into the page's olive-toned background. It opened a contact form asking for name, phone, email, party size, date, time, and "any special requests."

**Score before changes: 4/10**

**The Changes Made (All in one afternoon)**

1. **CTA text changed** from "Reservations" to **"Book a Table Tonight →"**
2. **CTA color changed** from muted green to a high-contrast warm orange (#E55A00)
3. **CTA placement moved** from mid-page to immediately below the hero photo
4. **CTA added to the navigation bar** (always visible regardless of scroll position)
5. **Form simplified**: removed phone field, removed "special requests" field, added a note ("We'll follow up by email to confirm. 2 minutes to book.")

**The Results (30-day comparison)**

- Online reservations per week: **12 → 26** (+117%)
- Form completion rate: **23% → 61%** (removed friction)
- Direct phone calls about reservations: **unchanged** (didn't cannibalize phone)
- No-show rate: actually decreased slightly, likely because email confirmations set clearer expectations

**The Lesson**

The restaurant wasn't losing reservations because of bad food or bad service. It was losing them because its website made booking feel difficult, risky, and confusing. Every friction point in the conversion path costs you customers — customers who want to give you their money, but give up before they can.

A specific, urgent CTA ("Tonight →" vs the generic "Reservations") creates a different psychological frame. It answers an implicit question the visitor has: "Can I book for right now?" rather than leaving them uncertain.

This case isn't unusual. It's representative of what we see across hundreds of SME audits. The fixes are small. The impact isn't.`,
      fr: `Un petit bistrot familial à Bordeaux avait du mal avec les réservations en ligne. Il avait un site web fonctionnel, une bonne présence Google Maps et un excellent bouche-à-oreille. Pourtant, leur taux de réservation en ligne était en moyenne de 12 réservations par semaine — bien en dessous de leur capacité de 40+ couverts.

**Les Résultats de l'Audit**

Quand le propriétaire a soumis le site à Roast My Site, plusieurs problèmes sont apparus. Mais un se distinguait clairement : le CTA de réservation.

Le bouton original était libellé : **"Réservations"**

Il était placé au milieu de la page, après trois paragraphes sur l'histoire et la philosophie du restaurant. Le bouton était stylisé dans un vert discret qui se fondait dans l'arrière-plan aux tons olive. Il ouvrait un formulaire demandant nom, téléphone, email, nombre de personnes, date, heure et "toute demande spéciale."

**Score avant les changements : 4/10**

**Les Changements Effectués (En un après-midi)**

1. **Texte CTA** de "Réservations" à **"Réserver une Table ce Soir →"**
2. **Couleur CTA** d'un vert discret à un orange chaud très contrasté
3. **Placement du CTA** déplacé du milieu de page à immédiatement sous la photo hero
4. **CTA ajouté à la barre de navigation** (toujours visible)
5. **Formulaire simplifié** : suppression du champ téléphone, suppression du champ "demandes spéciales", ajout d'une note de confirmation

**Les Résultats (comparaison 30 jours)**

- Réservations en ligne par semaine : **12 → 26** (+117%)
- Taux de complétion du formulaire : **23% → 61%**
- Appels téléphoniques concernant les réservations : **inchangés** (pas de cannibalisation)
- Taux de no-show : légèrement diminué, probablement en raison des confirmations par email

**La Leçon**

Le restaurant ne perdait pas des réservations à cause de mauvaise nourriture ou de mauvais service. Il les perdait parce que son site rendait la réservation difficile et confuse. Chaque point de friction dans le parcours de conversion vous coûte des clients — des clients qui veulent vous donner leur argent, mais qui abandonnent avant de pouvoir le faire.

Un CTA spécifique et urgent ("Ce Soir →" vs le générique "Réservations") crée un cadre psychologique différent. Il répond à une question implicite du visiteur : "Puis-je réserver pour ce soir ?"

Ce cas n'est pas inhabituel. Il est représentatif de ce que nous voyons sur des centaines d'audits de PME. Les corrections sont petites. L'impact ne l'est pas.`,
    },
    related: ['contact-form-losing-leads', 'social-proof-guide', 'french-sme-website-analysis'],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find(p => p.slug === slug);
}

export function getRelatedPosts(slugs: string[]): BlogPost[] {
  return slugs.map(s => BLOG_POSTS.find(p => p.slug === s)).filter(Boolean) as BlogPost[];
}
