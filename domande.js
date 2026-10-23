// =====================================================================
//  DOMANDE DEL QUESTIONARIO (italiano e inglese)
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
    testo: { it: "Dove ti trovi in questo momento?", en: "Where are you right now?", el: "Πού βρίσκεσαι αυτή τη στιγμή;" },
    opzioni: [
      // 6 categorie che coprono ogni situazione, senza sovrapposizioni
      { codice: 1, it: "A casa mia",                                                     en: "At my home", el: "Στο σπίτι μου" },
      { codice: 2, it: "A casa di altri (amici, parenti, partner)",                      en: "At someone else's home (friends, relatives, partner)", el: "Στο σπίτι άλλων (φίλων, συγγενών, συντρόφου)" },
      { codice: 3, it: "Al lavoro, a scuola o in università",                            en: "At work, school or university", el: "Στη δουλειά, στο σχολείο ή στο πανεπιστήμιο" },
      { codice: 4, it: "In spostamento (autobus, treno, metro, auto, a piedi)",           en: "On the move (bus, train, underground, car, on foot)", el: "Σε μετακίνηση (λεωφορείο, τρένο, μετρό, αυτοκίνητο, με τα πόδια)" },
      { codice: 5, it: "In un locale o edificio pubblico (negozio, bar, palestra, ospedale…)", en: "In a public venue or building (shop, café, gym, hospital…)", el: "Σε δημόσιο χώρο ή κτίριο (κατάστημα, καφετέρια, γυμναστήριο, νοσοκομείο…)" },
      { codice: 6, it: "All'aperto (parco, piazza, mare, montagna…)",                     en: "Outdoors (park, square, seaside, mountains…)", el: "Σε εξωτερικό χώρο (πάρκο, πλατεία, θάλασσα, βουνό…)" },
    ],
  },
  {
    id: "q02_eventi_stressanti",
    sezione: "Contesto",
    tipo: "percentuale",
    premessa: { it: "Dall'ultima valutazione…", en: "", el: "" },
    testo: { it: "Ci sono stati eventi e situazioni stressanti?", en: "Since the last prompt, how much did you experience stressful events and situations?", el: "Από την τελευταία αξιολόγηση, υπήρξαν στρεσογόνα γεγονότα ή καταστάσεις;" },
  },
  {
    id: "q03_eventi_positivi",
    sezione: "Contesto",
    tipo: "percentuale",
    premessa: { it: "Dall'ultima valutazione…", en: "", el: "" },
    testo: { it: "Ci sono stati eventi e situazioni positivi?", en: "Since the last prompt, how much did you experience positive events and situations?", el: "Από την τελευταία αξιολόγηση, υπήρξαν θετικά γεγονότα ή καταστάσεις;" },
  },
  {
    id: "q04_solitudine",
    sezione: "Contesto",
    tipo: "percentuale",
    premessa: { it: "In questo momento…", en: "", el: "" },
    testo: { it: "Quanto ti senti solo/a?", en: "Right now, how lonely do you feel?", el: "Αυτή τη στιγμή, πόσο μόνος/η νιώθεις;" },
  },
  {
    id: "q05_connessione",
    sezione: "Contesto",
    tipo: "percentuale",
    premessa: { it: "In questo momento…", en: "", el: "" },
    testo: { it: "Quanto ti senti connesso/a alle altre persone?", en: "Right now, how connected do you feel to other people?", el: "Αυτή τη στιγμή, πόσο συνδεδεμένος/η νιώθεις με άλλους ανθρώπους;" },
  },

  // ---------- Processes of change ----------
  {
    id: "q06_pensieri_ostacolo",
    sezione: "Processes of change",
    tipo: "percentuale",
    premessa: { it: "Dall'ultima valutazione…", en: "Since the last prompt…", el: "Από την τελευταία αξιολόγηση…" },
    testo: { it: "I miei pensieri hanno ostacolato il mio impegno in cose per me importanti.",
             en: "My thinking got in the way of things that were important to me", el: "Η σκέψη μου μπήκε εμπόδιο στα πράγματα που είναι σημαντικά για εμένα" },
  },
  {
    id: "q07_incapace_cambiare",
    sezione: "Processes of change",
    tipo: "percentuale",
    premessa: { it: "Dall'ultima valutazione…", en: "Since the last prompt…", el: "Από την τελευταία αξιολόγηση…" },
    testo: { it: "Sono stato/a incapace di cambiare i miei comportamenti non efficaci.",
             en: "I was unable to change my ineffective behavior", el: "Δεν ήμουν ικανός/ή να αλλάξω την αναποτελεσματική συμπεριφορά μου" },
  },
  {
    id: "q08_cose_importanti",
    sezione: "Processes of change",
    tipo: "percentuale",
    premessa: { it: "Dall'ultima valutazione…", en: "Since the last prompt…", el: "Από την τελευταία αξιολόγηση…" },
    testo: { it: "Ho scelto di fare cose che erano realmente importanti per me.",
             en: "I chose to do things that were personally important to me", el: "Επέλεξα να κάνω πράγματα τα οποία ήταν σημαντικά για εμένα προσωπικά" },
  },
  {
    id: "q09_esprimere_emozioni",
    sezione: "Processes of change",
    tipo: "percentuale",
    premessa: { it: "Dall'ultima valutazione…", en: "Since the last prompt…", el: "Από την τελευταία αξιολόγηση…" },
    testo: { it: "Non ho trovato un modo appropriato per esprimere le mie emozioni.",
             en: "I did not find an appropriate outlet for my emotions", el: "Δεν βρήκα έναν κατάλληλο τρόπο για να εκτονώσω τα συναισθήματά μου" },
  },
  {
    id: "q10_distinguere_pensieri",
    sezione: "Processes of change",
    tipo: "percentuale",
    premessa: { it: "Dall'ultima valutazione…", en: "Since the last prompt…", el: "Από την τελευταία αξιολόγηση…" },
    testo: { it: "Sono stato/a in grado di distinguere me stesso/a dai miei pensieri e dai miei sentimenti.",
             en: "I am able to separate myself from my thoughts and feelings", el: "Ήμουν ικανός/ή να ξεχωρίσω τον εαυτό μου από τις σκέψεις και τα συναισθήματά μου" },
  },

  // ---------- Affective states ----------
  {
    id: "q11_felice", sezione: "Affective states", tipo: "percentuale",
    premessa: { it: "In questo momento…", en: "", el: "" },
    testo: { it: "Quanto ti senti felice?", en: "Right now, how happy do you feel?", el: "Πόσο χαρούμενος/η νιώθεις τώρα;" },
  },
  {
    id: "q12_nervoso", sezione: "Affective states", tipo: "percentuale",
    premessa: { it: "In questo momento…", en: "", el: "" },
    testo: { it: "Quanto ti senti nervoso/a?", en: "Right now, how nervous do you feel?", el: "Πόσο νευρικός/ή νιώθεις τώρα;" },
  },
  {
    id: "q13_triste", sezione: "Affective states", tipo: "percentuale",
    premessa: { it: "In questo momento…", en: "", el: "" },
    testo: { it: "Quanto ti senti triste?", en: "Right now, how sad do you feel?", el: "Πόσο λυπημένος/η νιώθεις τώρα;" },
  },
  {
    id: "q14_arrabbiato", sezione: "Affective states", tipo: "percentuale",
    premessa: { it: "In questo momento…", en: "", el: "" },
    testo: { it: "Quanto ti senti arrabbiato/a?", en: "Right now, how angry do you feel?", el: "Πόσο θυμωμένος/η νιώθεις τώρα;" },
  },
  {
    id: "q15_annoiato", sezione: "Affective states", tipo: "percentuale",
    premessa: { it: "In questo momento…", en: "", el: "" },
    testo: { it: "Quanto ti senti annoiato/a?", en: "Right now, how bored do you feel?", el: "Πόσο βαριεμένος/η νιώθεις τώρα;" },
  },

  // ---------- Symptom-related distress ----------
  {
    id: "q16_sofferenza_sintomi", sezione: "Symptom-related distress", tipo: "percentuale",
    premessa: { it: "Dall'ultima valutazione…", en: "", el: "" },
    testo: { it: "Quanto hai sofferto a causa dei tuoi sintomi?", en: "Since the last prompt, how much did you suffer because of your symptoms?", el: "Από την τελευταία αξιολόγηση, πόσο υπέφερες εξαιτίας των συμπτωμάτων σου;" },
  },
];
