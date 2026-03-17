import type { DogProfile, Lifestage, Activity, HealthConcern } from "@/types";

export interface PersonalizedTip {
  en: string;
  it: string;
}

// =====================================================================
//  TIPS ORGANIZED BY CONTEXT
// =====================================================================

// ── Lifestage tips ──────────────────────────────────────────────────

const lifestageTips: Record<Lifestage, PersonalizedTip[]> = {
  Junior: [
    {
      en: "Puppies need up to twice the calories per kilogram of body weight compared to adult dogs.",
      it: "I cuccioli necessitano fino al doppio delle calorie per kg di peso corporeo rispetto ai cani adulti.",
    },
    {
      en: "DHA, an omega-3 fatty acid, supports brain and vision development in puppies.",
      it: "Il DHA, un acido grasso omega-3, favorisce lo sviluppo cerebrale e visivo nei cuccioli.",
    },
    {
      en: "Small breed puppies reach adult size by 10-12 months -- proper nutrition during growth is critical.",
      it: "I cuccioli di piccola taglia raggiungono le dimensioni adulte in 10-12 mesi -- una nutrizione adeguata durante la crescita e fondamentale.",
    },
    {
      en: "Calcium and phosphorus in the right ratio help puppies build strong bones and teeth.",
      it: "Calcio e fosforo nel giusto rapporto aiutano i cuccioli a sviluppare ossa e denti forti.",
    },
    {
      en: "Puppies' immune systems are still developing -- antioxidants like vitamins E and C provide essential support.",
      it: "Il sistema immunitario dei cuccioli e ancora in sviluppo -- antiossidanti come le vitamine E e C forniscono un supporto essenziale.",
    },
    {
      en: "Small breed puppies should eat 3-4 small meals a day to sustain their fast metabolism.",
      it: "I cuccioli di piccola taglia dovrebbero fare 3-4 piccoli pasti al giorno per sostenere il loro metabolismo veloce.",
    },
  ],
  Adult: [
    {
      en: "Adult small dogs have faster metabolisms and need nutrient-dense food to stay energized.",
      it: "I cani adulti di piccola taglia hanno un metabolismo piu veloce e necessitano di cibo ricco di nutrienti per restare energici.",
    },
    {
      en: "High-quality animal protein as the first ingredient helps maintain lean muscle mass.",
      it: "Proteine animali di alta qualita come primo ingrediente aiutano a mantenere la massa muscolare magra.",
    },
    {
      en: "Small breed adults benefit from smaller kibble size, making it easier to chew and digest.",
      it: "Gli adulti di piccola taglia traggono vantaggio da crocchette piu piccole, piu facili da masticare e digerire.",
    },
    {
      en: "A balanced diet with natural prebiotics supports a healthy digestive system in adult dogs.",
      it: "Una dieta bilanciata con prebiotici naturali supporta un sistema digestivo sano nei cani adulti.",
    },
    {
      en: "Adult small dogs can live 12-16 years -- investing in quality nutrition today pays off in healthier senior years.",
      it: "I cani adulti di piccola taglia possono vivere 12-16 anni -- investire in una nutrizione di qualita oggi ripaga in anni senior piu sani.",
    },
    {
      en: "Consistent feeding times help regulate your adult dog's metabolism and digestive health.",
      it: "Orari di alimentazione regolari aiutano a regolare il metabolismo e la salute digestiva del tuo cane adulto.",
    },
  ],
  Senior: [
    {
      en: "Senior dogs benefit from antioxidant-rich formulas that support cellular health and vitality.",
      it: "I cani senior beneficiano di formule ricche di antiossidanti che supportano la salute cellulare e la vitalita.",
    },
    {
      en: "Joint-supporting nutrients like glucosamine become more important as dogs age.",
      it: "Nutrienti per le articolazioni come la glucosamina diventano piu importanti con l'avanzare dell'eta.",
    },
    {
      en: "Senior small dogs may need fewer calories but the same or more vitamins and minerals.",
      it: "I cani senior di piccola taglia possono necessitare di meno calorie ma delle stesse o piu vitamine e minerali.",
    },
    {
      en: "Highly digestible proteins help senior dogs absorb nutrients more efficiently.",
      it: "Proteine altamente digeribili aiutano i cani senior ad assorbire i nutrienti in modo piu efficiente.",
    },
    {
      en: "MCTs (medium-chain triglycerides) can support cognitive function in aging dogs.",
      it: "Gli MCT (trigliceridi a catena media) possono supportare la funzione cognitiva nei cani anziani.",
    },
    {
      en: "Senior dogs benefit from added fiber to support regular digestion and bowel health.",
      it: "I cani senior beneficiano di fibre aggiunte per supportare una digestione regolare e la salute intestinale.",
    },
  ],
};

// ── Activity tips ───────────────────────────────────────────────────

const activityTips: Record<Activity, PersonalizedTip[]> = {
  Sedentario: [
    {
      en: "Even sedentary dogs benefit from daily mental stimulation -- puzzle feeders make mealtime enriching.",
      it: "Anche i cani sedentari traggono beneficio dalla stimolazione mentale quotidiana -- le ciotole puzzle rendono il pasto un'esperienza arricchente.",
    },
    {
      en: "Indoor dogs may need portion control to prevent weight gain -- quality nutrition matters more than quantity.",
      it: "I cani da interno possono necessitare di un controllo delle porzioni per prevenire l'aumento di peso -- la qualita della nutrizione conta piu della quantita.",
    },
    {
      en: "Low-activity dogs benefit from formulas with L-carnitine to help maintain a healthy body composition.",
      it: "I cani poco attivi beneficiano di formule con L-carnitina per aiutare a mantenere una composizione corporea sana.",
    },
  ],
  Normale: [
    {
      en: "Regular daily walks help maintain healthy digestion and a balanced appetite.",
      it: "Le passeggiate quotidiane regolari aiutano a mantenere una digestione sana e un appetito equilibrato.",
    },
    {
      en: "A balanced activity level pairs perfectly with a complete, well-portioned diet for optimal health.",
      it: "Un livello di attivita equilibrato si abbina perfettamente a una dieta completa e ben dosata per una salute ottimale.",
    },
    {
      en: "Dogs with moderate activity benefit from a balanced protein-to-fat ratio that sustains energy throughout the day.",
      it: "I cani con attivita moderata beneficiano di un rapporto equilibrato proteine-grassi che sostiene l'energia durante tutta la giornata.",
    },
  ],
  Attivo: [
    {
      en: "Active dogs burn 20-40% more calories -- they need energy-dense formulas to fuel their lifestyle.",
      it: "I cani attivi bruciano il 20-40% in piu di calorie -- necessitano di formule energetiche per alimentare il loro stile di vita.",
    },
    {
      en: "High-quality proteins and fats help active dogs recover faster after exercise sessions.",
      it: "Proteine e grassi di alta qualita aiutano i cani attivi a recuperare piu velocemente dopo le sessioni di esercizio.",
    },
    {
      en: "Active small dogs need more B vitamins and iron to support efficient oxygen transport during exercise.",
      it: "I cani piccoli attivi necessitano di piu vitamine del gruppo B e ferro per supportare un trasporto efficiente di ossigeno durante l'esercizio.",
    },
  ],
  "Molto Attivo": [
    {
      en: "Very active and working dogs may need up to 50% more calories than average -- proper fueling is essential.",
      it: "I cani molto attivi e da lavoro possono necessitare fino al 50% in piu di calorie rispetto alla media -- un'alimentazione adeguata e essenziale.",
    },
    {
      en: "Sustained energy from complex carbohydrates and quality fats keeps athletic dogs performing at their best.",
      it: "L'energia sostenuta da carboidrati complessi e grassi di qualita mantiene i cani atletici al massimo delle prestazioni.",
    },
    {
      en: "Athletic dogs have higher antioxidant needs because intense exercise generates more free radicals.",
      it: "I cani atletici hanno un maggiore fabbisogno di antiossidanti perche l'esercizio intenso genera piu radicali liberi.",
    },
  ],
};

// ── Health concern tips ─────────────────────────────────────────────

const healthTips: Record<HealthConcern, PersonalizedTip[]> = {
  Nessuno: [
    {
      en: "Preventive nutrition is the foundation of long-term health -- keep up the great care!",
      it: "La nutrizione preventiva e la base della salute a lungo termine -- continua cosi con le ottime cure!",
    },
    {
      en: "Dogs in good health still benefit from antioxidants that strengthen natural immune defenses.",
      it: "I cani in buona salute beneficiano comunque degli antiossidanti che rafforzano le difese immunitarie naturali.",
    },
    {
      en: "A complete and balanced diet is the best way to keep your healthy dog thriving for years to come.",
      it: "Una dieta completa e bilanciata e il modo migliore per mantenere il tuo cane sano e in forma per gli anni a venire.",
    },
  ],
  "Digestione sensibile": [
    {
      en: "Easily digestible proteins like chicken or turkey are gentler on sensitive stomachs.",
      it: "Proteine facilmente digeribili come pollo o tacchino sono piu delicate sugli stomaci sensibili.",
    },
    {
      en: "Natural prebiotics (like chicory root) support beneficial gut bacteria for smoother digestion.",
      it: "I prebiotici naturali (come la radice di cicoria) supportano i batteri intestinali benefici per una digestione piu regolare.",
    },
    {
      en: "Gradual food transition over 7 days is especially important for dogs with sensitive digestion.",
      it: "La transizione graduale del cibo in 7 giorni e particolarmente importante per i cani con digestione sensibile.",
    },
    {
      en: "Rice is one of the most digestible carbohydrate sources for dogs with sensitive stomachs.",
      it: "Il riso e una delle fonti di carboidrati piu digeribili per i cani con stomaco sensibile.",
    },
  ],
  "Pelle & Pelo": [
    {
      en: "Omega-3 and omega-6 fatty acids nourish skin from within, promoting a glossy, healthy coat.",
      it: "Gli acidi grassi omega-3 e omega-6 nutrono la pelle dall'interno, promuovendo un pelo lucido e sano.",
    },
    {
      en: "Zinc and biotin are key nutrients that support skin cell renewal and coat quality.",
      it: "Zinco e biotina sono nutrienti chiave che supportano il rinnovamento cellulare della pelle e la qualita del pelo.",
    },
    {
      en: "A dull coat or excessive shedding can often be improved with the right nutritional support.",
      it: "Un pelo opaco o una muta eccessiva possono spesso essere migliorati con il giusto supporto nutrizionale.",
    },
    {
      en: "Vitamin E acts as a natural antioxidant that protects skin cells from environmental damage.",
      it: "La vitamina E agisce come antiossidante naturale che protegge le cellule della pelle dai danni ambientali.",
    },
  ],
  "Controllo del peso": [
    {
      en: "Formulas with adjusted fat content and added fiber help neutered dogs maintain a healthy weight.",
      it: "Formule con contenuto di grassi regolato e fibre aggiunte aiutano i cani sterilizzati a mantenere un peso sano.",
    },
    {
      en: "L-carnitine helps convert fat into energy, supporting healthy weight management naturally.",
      it: "La L-carnitina aiuta a convertire i grassi in energia, supportando la gestione del peso in modo naturale.",
    },
    {
      en: "Splitting daily food into 2-3 smaller meals helps regulate metabolism and prevent overeating.",
      it: "Dividere il cibo giornaliero in 2-3 pasti piu piccoli aiuta a regolare il metabolismo e prevenire la sovralimentazione.",
    },
    {
      en: "Even 10% excess body weight can stress joints and reduce lifespan -- precise portions matter.",
      it: "Anche il 10% di peso in eccesso puo stressare le articolazioni e ridurre la durata della vita -- le porzioni precise contano.",
    },
  ],
  "Appetito difficile": [
    {
      en: "Smaller kibble with enhanced aroma and flavor can encourage even the pickiest eaters.",
      it: "Crocchette piu piccole con aroma e gusto intensificati possono incoraggiare anche i palati piu difficili.",
    },
    {
      en: "Mix feeding -- combining dry food with wet food -- can make meals more appealing for fussy eaters.",
      it: "L'alimentazione mista -- combinare cibo secco e umido -- puo rendere i pasti piu appetitosi per i palati difficili.",
    },
    {
      en: "Warming wet food slightly can release aromas that stimulate appetite in picky dogs.",
      it: "Scaldare leggermente il cibo umido puo rilasciare aromi che stimolano l'appetito nei cani schizzinosi.",
    },
    {
      en: "Establishing consistent feeding routines helps picky eaters develop more regular appetite patterns.",
      it: "Stabilire routine di alimentazione regolari aiuta i palati difficili a sviluppare schemi di appetito piu regolari.",
    },
  ],
  Intolleranze: [
    {
      en: "Monoprotein formulas use a single animal protein source, reducing the risk of adverse food reactions.",
      it: "Le formule monoprotein utilizzano un'unica fonte proteica animale, riducendo il rischio di reazioni alimentari avverse.",
    },
    {
      en: "Turkey is one of the most tolerated protein sources for dogs with food sensitivities.",
      it: "Il tacchino e una delle fonti proteiche piu tollerate per i cani con sensibilita alimentari.",
    },
    {
      en: "Grain-free or limited-ingredient diets can help identify and avoid trigger ingredients.",
      it: "Diete senza cereali o con ingredienti limitati possono aiutare a identificare ed evitare gli ingredienti scatenanti.",
    },
    {
      en: "Novel protein sources (like salmon or lamb) are less likely to trigger reactions in sensitive dogs.",
      it: "Fonti proteiche insolite (come salmone o agnello) hanno meno probabilita di scatenare reazioni nei cani sensibili.",
    },
  ],
};

// ── Weight-specific tips ────────────────────────────────────────────

const weightTips: PersonalizedTip[] = [
  {
    en: "Mixed feeding (dry + wet) increases hydration by up to 50%, which is especially beneficial for small dogs.",
    it: "L'alimentazione mista (secco + umido) aumenta l'idratazione fino al 50%, particolarmente benefica per i cani di piccola taglia.",
  },
  {
    en: "Accurate weight measurement ensures the right portion size -- even 0.5 kg makes a difference for mini breeds.",
    it: "Una misurazione accurata del peso garantisce la giusta porzione -- anche 0.5 kg fanno la differenza per le razze mini.",
  },
  {
    en: "Small dogs under 5 kg typically need 40-60 grams of dry food per day, depending on activity level.",
    it: "I cani sotto i 5 kg necessitano tipicamente di 40-60 grammi di cibo secco al giorno, a seconda del livello di attivita.",
  },
  {
    en: "Body condition scoring is more reliable than weight alone -- your vet can show you how to check at home.",
    it: "Il punteggio della condizione corporea e piu affidabile del solo peso -- il tuo veterinario puo mostrarti come controllare a casa.",
  },
];

// ── Weight range tips ───────────────────────────────────────────────

const lightWeightTips: PersonalizedTip[] = [
  {
    en: "Very small dogs (under 3 kg) have the fastest metabolisms -- they need the most calorie-dense formulas per gram.",
    it: "I cani molto piccoli (sotto i 3 kg) hanno il metabolismo piu veloce -- necessitano delle formule piu caloriche per grammo.",
  },
  {
    en: "Tiny dogs are more prone to hypoglycemia -- regular small meals throughout the day help maintain stable blood sugar.",
    it: "I cani minuscoli sono piu soggetti a ipoglicemia -- piccoli pasti regolari durante il giorno aiutano a mantenere stabile la glicemia.",
  },
];

const mediumWeightTips: PersonalizedTip[] = [
  {
    en: "Dogs in the 4-7 kg range are the sweet spot for mini breed formulas -- perfectly calibrated nutrition for their size.",
    it: "I cani nella fascia 4-7 kg sono ideali per le formule mini breed -- nutrizione perfettamente calibrata per la loro taglia.",
  },
  {
    en: "Mid-range small dogs benefit from a balance of protein for muscle and fiber for satiety.",
    it: "I cani piccoli di taglia media beneficiano di un equilibrio tra proteine per i muscoli e fibre per la sazieta.",
  },
];

const heavyWeightTips: PersonalizedTip[] = [
  {
    en: "Larger small dogs (8-10 kg) have slightly lower metabolic rates per kg -- careful portioning prevents excess weight.",
    it: "I cani piccoli piu grandi (8-10 kg) hanno un tasso metabolico leggermente inferiore per kg -- un dosaggio attento previene il peso in eccesso.",
  },
  {
    en: "Dogs closer to 10 kg may benefit from a formula that bridges mini and medium breed nutritional needs.",
    it: "I cani vicini ai 10 kg possono beneficiare di una formula che colma le esigenze nutrizionali tra taglie mini e medie.",
  },
];

// ── Combination tips (lifestage + health / activity) ────────────────

interface ComboKey {
  lifestage?: Lifestage;
  activity?: Activity;
  health?: HealthConcern;
}

interface ComboTip {
  match: ComboKey;
  tip: PersonalizedTip;
}

const combinationTips: ComboTip[] = [
  // Senior + joints (common combination)
  {
    match: { lifestage: "Senior", health: "Pelle & Pelo" },
    tip: {
      en: "Aging skin produces less natural oils -- senior formulas enriched with omega fatty acids help maintain coat luster.",
      it: "La pelle che invecchia produce meno oli naturali -- le formule senior arricchite con acidi grassi omega aiutano a mantenere la lucentezza del pelo.",
    },
  },
  {
    match: { lifestage: "Senior", health: "Controllo del peso" },
    tip: {
      en: "Senior dogs are more prone to weight gain due to reduced activity -- adjusted calorie formulas help them stay lean.",
      it: "I cani senior sono piu inclini all'aumento di peso a causa della ridotta attivita -- formule con calorie ridotte li aiutano a restare in forma.",
    },
  },
  {
    match: { lifestage: "Senior", health: "Digestione sensibile" },
    tip: {
      en: "Aging digestive systems become less efficient -- highly digestible ingredients and prebiotics are especially helpful for senior dogs.",
      it: "Il sistema digestivo che invecchia diventa meno efficiente -- ingredienti altamente digeribili e prebiotici sono particolarmente utili per i cani senior.",
    },
  },

  // Puppy + activity
  {
    match: { lifestage: "Junior", activity: "Attivo" },
    tip: {
      en: "Active puppies burn through energy rapidly -- they need calorie-rich formulas with high-quality proteins to fuel growth and play.",
      it: "I cuccioli attivi consumano energia rapidamente -- necessitano di formule ricche di calorie con proteine di alta qualita per sostenere crescita e gioco.",
    },
  },
  {
    match: { lifestage: "Junior", activity: "Molto Attivo" },
    tip: {
      en: "Very active puppies need extra care with bone development -- controlled calcium levels support growth without excess strain.",
      it: "I cuccioli molto attivi necessitano di attenzione extra per lo sviluppo osseo -- livelli controllati di calcio supportano la crescita senza stress eccessivo.",
    },
  },
  {
    match: { lifestage: "Junior", health: "Digestione sensibile" },
    tip: {
      en: "Puppies with sensitive digestion benefit from single-protein formulas that are gentle on developing digestive systems.",
      it: "I cuccioli con digestione sensibile beneficiano di formule monoprotein delicate sul sistema digestivo in sviluppo.",
    },
  },

  // Adult + weight concerns
  {
    match: { lifestage: "Adult", health: "Controllo del peso" },
    tip: {
      en: "Neutered adult dogs can need up to 30% fewer calories -- weight management formulas make portion control easier.",
      it: "I cani adulti sterilizzati possono necessitare fino al 30% in meno di calorie -- le formule per il controllo del peso rendono piu facile il dosaggio.",
    },
  },
  {
    match: { lifestage: "Adult", activity: "Sedentario" },
    tip: {
      en: "Sedentary adult dogs need fewer calories but still require complete nutrition -- look for light formulas with full nutrient profiles.",
      it: "I cani adulti sedentari necessitano di meno calorie ma richiedono comunque una nutrizione completa -- cerca formule light con profili nutrizionali completi.",
    },
  },
  {
    match: { lifestage: "Adult", health: "Pelle & Pelo" },
    tip: {
      en: "Adult dogs with coat issues often see visible improvement within 4-6 weeks of switching to an omega-enriched formula.",
      it: "I cani adulti con problemi di pelo spesso mostrano un miglioramento visibile entro 4-6 settimane dal passaggio a una formula arricchita con omega.",
    },
  },
  {
    match: { lifestage: "Adult", activity: "Molto Attivo" },
    tip: {
      en: "Very active adult dogs need higher protein (28%+) and fat (18%+) levels to sustain their demanding energy requirements.",
      it: "I cani adulti molto attivi necessitano di livelli piu alti di proteine (28%+) e grassi (18%+) per sostenere il loro fabbisogno energetico.",
    },
  },

  // Senior + activity
  {
    match: { lifestage: "Senior", activity: "Sedentario" },
    tip: {
      en: "Sedentary senior dogs are at highest risk for obesity-related issues -- precise portions and regular vet check-ups are key.",
      it: "I cani senior sedentari sono a piu alto rischio di problemi legati all'obesita -- porzioni precise e controlli veterinari regolari sono fondamentali.",
    },
  },
  {
    match: { lifestage: "Senior", activity: "Attivo" },
    tip: {
      en: "Active senior dogs defy age expectations! Support their joints with glucosamine-enriched formulas to keep them moving.",
      it: "I cani senior attivi sfidano le aspettative dell'eta! Supporta le loro articolazioni con formule arricchite di glucosamina per mantenerli in movimento.",
    },
  },

  // Activity + health combos
  {
    match: { activity: "Sedentario", health: "Controllo del peso" },
    tip: {
      en: "A sedentary lifestyle combined with weight concerns calls for a light formula with increased fiber for satiety.",
      it: "Uno stile di vita sedentario combinato con problemi di peso richiede una formula light con fibre aumentate per la sazieta.",
    },
  },
  {
    match: { activity: "Attivo", health: "Digestione sensibile" },
    tip: {
      en: "Active dogs with sensitive digestion need easily absorbable energy sources -- rice and chicken are an ideal combination.",
      it: "I cani attivi con digestione sensibile necessitano di fonti energetiche facilmente assorbibili -- riso e pollo sono una combinazione ideale.",
    },
  },
  {
    match: { activity: "Molto Attivo", health: "Pelle & Pelo" },
    tip: {
      en: "Intense exercise can stress the coat -- omega-3 supplementation through food helps very active dogs maintain coat health.",
      it: "L'esercizio intenso puo stressare il pelo -- l'integrazione di omega-3 attraverso il cibo aiuta i cani molto attivi a mantenere la salute del pelo.",
    },
  },

  // Intolerance combos
  {
    match: { lifestage: "Junior", health: "Intolleranze" },
    tip: {
      en: "Early identification of food intolerances in puppies helps prevent chronic issues -- a monoprotein puppy formula is a smart starting point.",
      it: "L'identificazione precoce delle intolleranze alimentari nei cuccioli aiuta a prevenire problemi cronici -- una formula puppy monoprotein e un ottimo punto di partenza.",
    },
  },
  {
    match: { lifestage: "Senior", health: "Intolleranze" },
    tip: {
      en: "Senior dogs can develop new sensitivities over time -- limited-ingredient formulas minimize the risk of adverse reactions.",
      it: "I cani senior possono sviluppare nuove sensibilita nel tempo -- formule con ingredienti limitati riducono il rischio di reazioni avverse.",
    },
  },

  // Fussy eater combos
  {
    match: { lifestage: "Junior", health: "Appetito difficile" },
    tip: {
      en: "Picky puppies need extra-appetizing food to ensure they get enough nutrients during their critical growth period.",
      it: "I cuccioli schizzinosi necessitano di cibo extra-appetitoso per assicurarsi di ricevere abbastanza nutrienti durante il periodo critico di crescita.",
    },
  },
  {
    match: { lifestage: "Senior", health: "Appetito difficile" },
    tip: {
      en: "Senior dogs with reduced appetite benefit from smaller, more frequent meals with enhanced palatability.",
      it: "I cani senior con appetito ridotto beneficiano di pasti piu piccoli e frequenti con palatabilita migliorata.",
    },
  },
];

// =====================================================================
//  TIP SELECTION LOGIC
// =====================================================================

/**
 * Get a personalized tip based on current questionnaire step and profile state.
 * Prioritizes combination tips for maximum personalization, then falls
 * back to category-specific tips.
 */
export function getPersonalizedTip(
  step: number,
  profile: DogProfile,
  locale: "en" | "it"
): string {
  let pool: PersonalizedTip[] = [];

  // ── Try combination tips first (most personalized) ──────────────
  if (step >= 2) {
    const combos = findMatchingCombos(profile);
    if (combos.length > 0) {
      // Pick from combo tips
      const seed = step + (profile.name?.length || 0) + (profile.weight || 0);
      const idx = Math.abs(Math.floor(seed)) % combos.length;
      const tip = combos[idx];
      return locale === "it" ? tip.it : tip.en;
    }
  }

  // ── Fall back to category-specific tips ─────────────────────────
  switch (step) {
    case 1:
      if (profile.lifestage) {
        pool = lifestageTips[profile.lifestage];
      }
      break;
    case 2:
      if (profile.activity) {
        pool = activityTips[profile.activity];
      }
      break;
    case 3:
      if (profile.health.length > 0) {
        const concern =
          profile.health.find((h) => h !== "Nessuno") || profile.health[0];
        pool = healthTips[concern];
      }
      break;
    case 4:
      // Use weight-range-specific tips based on weight
      pool = getWeightRangeTips(profile.weight);
      break;
  }

  // Fallback to generic tips if pool is empty
  if (pool.length === 0) {
    pool = lifestageTips.Adult;
  }

  // Use a deterministic but varied index based on step + profile state
  const seed = step + (profile.name?.length || 0) + (profile.weight || 0);
  const index = Math.abs(Math.floor(seed)) % pool.length;
  const tip = pool[index];

  return locale === "it" ? tip.it : tip.en;
}

/**
 * Find combination tips that match the current profile state.
 */
function findMatchingCombos(profile: DogProfile): PersonalizedTip[] {
  return combinationTips
    .filter(({ match }) => {
      if (match.lifestage && profile.lifestage !== match.lifestage) return false;
      if (match.activity && profile.activity !== match.activity) return false;
      if (match.health && !profile.health.includes(match.health)) return false;
      return true;
    })
    .map(({ tip }) => tip);
}

/**
 * Get weight-range-specific tips based on the dog's weight.
 */
function getWeightRangeTips(weight: number): PersonalizedTip[] {
  if (weight <= 3) {
    return [...lightWeightTips, ...weightTips];
  } else if (weight <= 7) {
    return [...mediumWeightTips, ...weightTips];
  } else {
    return [...heavyWeightTips, ...weightTips];
  }
}
