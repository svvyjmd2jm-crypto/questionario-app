// =====================================================================
//  DOMANDE DEL QUESTIONARIO (italiano, inglese, greco e tedesco)
//  "id" = nome della colonna nel foglio Google.
//
//  Tipi:  "percentuale" (slider 0-100), "scelta" (una risposta),
//         "scelta_multipla", "scala", "numero", "testo".
//  Per le "scelta" ogni opzione ha un codice numerico: nel foglio arriva
//  il codice (uguale in tutte le lingue) e, in una colonna a parte,
//  l'etichetta italiana. Così i dati restano confrontabili tra le lingue.
//
//  Le versioni inglesi degli item 2-16 sono quelle UFFICIALI dello strumento:
//  non modificarle. In inglese "Since the last prompt" / "Right now" fanno parte
//  della domanda; per gli item 6-10 compare come intestazione sopra l'affermazione.
// =====================================================================

const DOMANDE = [
  // ---------- Contesto ----------
  {
    id: "q01_luogo",
    sezione: "Contesto",
    tipo: "scelta",
    testo: { it: "Dove ti trovi in questo momento?", en: "Where are you right now?", el: "Πού βρίσκεσαι αυτή τη στιγμή;", de: "Wo befindest du dich gerade?" },
    opzioni: [
      // 6 categorie che coprono ogni situazione, senza sovrapposizioni
      { codice: 1, it: "A casa mia",                                                     en: "At my home", el: "Στο σπίτι μου", de: "Zu Hause" },
      { codice: 2, it: "A casa di altri (amici, parenti, partner)",                      en: "At someone else's home (friends, relatives, partner)", el: "Στο σπίτι άλλων (φίλων, συγγενών, συντρόφου)", de: "Bei anderen zu Hause (bei Freunden, Verwandten oder dem Partner / der Partnerin)" },
      { codice: 3, it: "Al lavoro, a scuola o in università",                            en: "At work, school or university", el: "Στη δουλειά, στο σχολείο ή στο πανεπιστήμιο", de: "Bei der Arbeit, in der Schule oder an der Universität" },
      { codice: 4, it: "In spostamento (autobus, treno, metro, auto, a piedi)",           en: "On the move (bus, train, underground, car, on foot)", el: "Σε μετακίνηση (λεωφορείο, τρένο, μετρό, αυτοκίνητο, με τα πόδια)", de: "Unterwegs (im Bus, Zug, in der U-Bahn, im Auto oder zu Fuß)" },
      { codice: 5, it: "In un locale o edificio pubblico (negozio, bar, palestra, ospedale…)", en: "In a public venue or building (shop, café, gym, hospital…)", el: "Σε δημόσιο χώρο ή κτίριο (κατάστημα, καφετέρια, γυμναστήριο, νοσοκομείο…)", de: "An einem öffentlichen Ort oder in einem öffentlichen Gebäude (z. B. in einem Geschäft, Café, Fitnessstudio oder Krankenhaus)" },
      { codice: 6, it: "All'aperto (parco, piazza, mare, montagna…)",                     en: "Outdoors (park, square, seaside, mountains…)", el: "Σε εξωτερικό χώρο (πάρκο, πλατεία, θάλασσα, βουνό…)", de: "Im Freien (z. B. in einem Park, auf einem Platz, am Meer oder in den Bergen)" },
    ],
  },
  {
    id: "q02_eventi_stressanti",
    sezione: "Contesto",
    tipo: "percentuale",
    premessa: { it: "Dall'ultima valutazione…", en: "", el: "", de: "" },
    testo: { it: "Ci sono stati eventi e situazioni stressanti?", en: "Since the last prompt, how much did you experience stressful events and situations?", el: "Από την τελευταία αξιολόγηση, υπήρξαν στρεσογόνα γεγονότα ή καταστάσεις;", de: "Gab es seit der letzten Befragung belastende Ereignisse oder Situationen?" },
  },
  {
    id: "q03_eventi_positivi",
    sezione: "Contesto",
    tipo: "percentuale",
    premessa: { it: "Dall'ultima valutazione…", en: "", el: "", de: "" },
    testo: { it: "Ci sono stati eventi e situazioni positivi?", en: "Since the last prompt, how much did you experience positive events and situations?", el: "Από την τελευταία αξιολόγηση, υπήρξαν θετικά γεγονότα ή καταστάσεις;", de: "Gab es seit der letzten Befragung positive Ereignisse oder Situationen?" },
  },
  {
    id: "q04_solitudine",
    sezione: "Contesto",
    tipo: "percentuale",
    premessa: { it: "In questo momento…", en: "", el: "", de: "" },
    testo: { it: "Quanto ti senti solo/a?", en: "Right now, how lonely do you feel?", el: "Αυτή τη στιγμή, πόσο μόνος/η νιώθεις;", de: "Wie einsam fühlst du dich in diesem Moment?" },
  },
  {
    id: "q05_connessione",
    sezione: "Contesto",
    tipo: "percentuale",
    premessa: { it: "In questo momento…", en: "", el: "", de: "" },
    testo: { it: "Quanto ti senti connesso/a alle altre persone?", en: "Right now, how connected do you feel to other people?", el: "Αυτή τη στιγμή, πόσο συνδεδεμένος/η νιώθεις με άλλους ανθρώπους;", de: "Wie sehr fühlst du dich in diesem Moment mit anderen Menschen verbunden?" },
  },

  // ---------- Processes of change ----------
  {
    id: "q06_pensieri_ostacolo",
    sezione: "Processes of change",
    tipo: "percentuale",
    premessa: { it: "Dall'ultima valutazione…", en: "Since the last prompt…", el: "Από την τελευταία αξιολόγηση…", de: "" },
    testo: { it: "I miei pensieri hanno ostacolato il mio impegno in cose per me importanti.",
             en: "My thinking got in the way of things that were important to me", el: "Η σκέψη μου μπήκε εμπόδιο στα πράγματα που είναι σημαντικά για εμένα", de: "Mein Denken steht Dingen im Weg, die mir wichtig sind" },
  },
  {
    id: "q07_incapace_cambiare",
    sezione: "Processes of change",
    tipo: "percentuale",
    premessa: { it: "Dall'ultima valutazione…", en: "Since the last prompt…", el: "Από την τελευταία αξιολόγηση…", de: "" },
    testo: { it: "Sono stato/a incapace di cambiare i miei comportamenti non efficaci.",
             en: "I was unable to change my ineffective behavior", el: "Δεν ήμουν ικανός/ή να αλλάξω την αναποτελεσματική συμπεριφορά μου", de: "Ich war nicht in der Lage, mein ineffektives Verhalten zu ändern." },
  },
  {
    id: "q08_cose_importanti",
    sezione: "Processes of change",
    tipo: "percentuale",
    premessa: { it: "Dall'ultima valutazione…", en: "Since the last prompt…", el: "Από την τελευταία αξιολόγηση…", de: "" },
    testo: { it: "Ho scelto di fare cose che erano realmente importanti per me.",
             en: "I chose to do things that were personally important to me", el: "Επέλεξα να κάνω πράγματα τα οποία ήταν σημαντικά για εμένα προσωπικά", de: "Ich entscheide mich dafür, Dinge zu tun, die mir persönlich wichtig sind" },
  },
  {
    id: "q09_esprimere_emozioni",
    sezione: "Processes of change",
    tipo: "percentuale",
    premessa: { it: "Dall'ultima valutazione…", en: "Since the last prompt…", el: "Από την τελευταία αξιολόγηση…", de: "" },
    testo: { it: "Non ho trovato un modo appropriato per esprimere le mie emozioni.",
             en: "I did not find an appropriate outlet for my emotions", el: "Δεν βρήκα έναν κατάλληλο τρόπο για να εκτονώσω τα συναισθήματά μου", de: "Ich finde kein geeignetes Ventil für meine Emotionen" },
  },
  {
    id: "q10_distinguere_pensieri",
    sezione: "Processes of change",
    tipo: "percentuale",
    premessa: { it: "Dall'ultima valutazione…", en: "Since the last prompt…", el: "Από την τελευταία αξιολόγηση…", de: "" },
    testo: { it: "Sono stato/a in grado di distinguere me stesso/a dai miei pensieri e dai miei sentimenti.",
             en: "I am able to separate myself from my thoughts and feelings", el: "Ήμουν ικανός/ή να ξεχωρίσω τον εαυτό μου από τις σκέψεις και τα συναισθήματά μου", de: "Ich war in der Lage, meine Gedanken und Gefühle wahrzunehmen, ohne mich mit ihnen zu identifizieren" },
  },

  // ---------- Affective states ----------
  {
    id: "q11_felice", sezione: "Affective states", tipo: "percentuale",
    premessa: { it: "In questo momento…", en: "", el: "", de: "In diesem Moment …" },
    testo: { it: "Quanto ti senti felice?", en: "Right now, how happy do you feel?", el: "Πόσο χαρούμενος/η νιώθεις τώρα;", de: "Wie glücklich fühlst du dich?" },
  },
  {
    id: "q12_nervoso", sezione: "Affective states", tipo: "percentuale",
    premessa: { it: "In questo momento…", en: "", el: "", de: "In diesem Moment …" },
    testo: { it: "Quanto ti senti nervoso/a?", en: "Right now, how nervous do you feel?", el: "Πόσο νευρικός/ή νιώθεις τώρα;", de: "Wie nervös fühlst du dich?" },
  },
  {
    id: "q13_triste", sezione: "Affective states", tipo: "percentuale",
    premessa: { it: "In questo momento…", en: "", el: "", de: "In diesem Moment …" },
    testo: { it: "Quanto ti senti triste?", en: "Right now, how sad do you feel?", el: "Πόσο λυπημένος/η νιώθεις τώρα;", de: "Wie traurig fühlst du dich?" },
  },
  {
    id: "q14_arrabbiato", sezione: "Affective states", tipo: "percentuale",
    premessa: { it: "In questo momento…", en: "", el: "", de: "In diesem Moment …" },
    testo: { it: "Quanto ti senti arrabbiato/a?", en: "Right now, how angry do you feel?", el: "Πόσο θυμωμένος/η νιώθεις τώρα;", de: "Wie wütend fühlst du dich?" },
  },
  {
    id: "q15_annoiato", sezione: "Affective states", tipo: "percentuale",
    premessa: { it: "In questo momento…", en: "", el: "", de: "In diesem Moment …" },
    testo: { it: "Quanto ti senti annoiato/a?", en: "Right now, how bored do you feel?", el: "Πόσο βαριεμένος/η νιώθεις τώρα;", de: "Wie gelangweilt fühlst du dich?" },
  },

  // ---------- Symptom-related distress ----------
  {
    id: "q16_sofferenza_sintomi", sezione: "Symptom-related distress", tipo: "percentuale",
    premessa: { it: "Dall'ultima valutazione…", en: "", el: "", de: "" },
    testo: { it: "Quanto hai sofferto a causa dei tuoi sintomi?", en: "Since the last prompt, how much did you suffer because of your symptoms?", el: "Από την τελευταία αξιολόγηση, πόσο υπέφερες εξαιτίας των συμπτωμάτων σου;", de: "Wie sehr hast du seit der letzten Befragung unter deinen Symptomen gelitten?" },
  },
];
