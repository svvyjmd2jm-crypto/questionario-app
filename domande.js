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
//  ATTENZIONE: le versioni inglesi degli item di strumenti validati
//  vanno sostituite con la formulazione ORIGINALE dello strumento.
// =====================================================================

const DOMANDE = [
  // ---------- Contesto ----------
  {
    id: "q01_luogo",
    sezione: "Contesto",
    tipo: "scelta",
    testo: { it: "Dove ti trovi in questo momento?", en: "Where are you right now?" },
    opzioni: [
      // 6 categorie che coprono ogni situazione, senza sovrapposizioni
      { codice: 1, it: "A casa mia",                                                     en: "At my home" },
      { codice: 2, it: "A casa di altri (amici, parenti, partner)",                      en: "At someone else's home (friends, relatives, partner)" },
      { codice: 3, it: "Al lavoro, a scuola o in università",                            en: "At work, school or university" },
      { codice: 4, it: "In spostamento (autobus, treno, metro, auto, a piedi)",           en: "On the move (bus, train, underground, car, on foot)" },
      { codice: 5, it: "In un locale o edificio pubblico (negozio, bar, palestra, ospedale…)", en: "In a public venue or building (shop, café, gym, hospital…)" },
      { codice: 6, it: "All'aperto (parco, piazza, mare, montagna…)",                     en: "Outdoors (park, square, seaside, mountains…)" },
    ],
  },
  {
    id: "q02_eventi_stressanti",
    sezione: "Contesto",
    tipo: "percentuale",
    premessa: { it: "Dall'ultima valutazione…", en: "Since the last assessment…" },
    testo: { it: "Ci sono stati eventi e situazioni stressanti?", en: "Have there been stressful events or situations?" },
  },
  {
    id: "q03_eventi_positivi",
    sezione: "Contesto",
    tipo: "percentuale",
    premessa: { it: "Dall'ultima valutazione…", en: "Since the last assessment…" },
    testo: { it: "Ci sono stati eventi e situazioni positivi?", en: "Have there been positive events or situations?" },
  },
  {
    id: "q04_solitudine",
    sezione: "Contesto",
    tipo: "percentuale",
    premessa: { it: "In questo momento…", en: "Right now…" },
    testo: { it: "Quanto ti senti solo/a?", en: "How lonely do you feel?" },
  },
  {
    id: "q05_connessione",
    sezione: "Contesto",
    tipo: "percentuale",
    premessa: { it: "In questo momento…", en: "Right now…" },
    testo: { it: "Quanto ti senti connesso/a alle altre persone?", en: "How connected do you feel to other people?" },
  },

  // ---------- Processes of change ----------
  {
    id: "q06_pensieri_ostacolo",
    sezione: "Processes of change",
    tipo: "percentuale",
    premessa: { it: "Dall'ultima valutazione…", en: "Since the last assessment…" },
    testo: { it: "I miei pensieri hanno ostacolato il mio impegno in cose per me importanti.",
             en: "My thoughts got in the way of my doing things that were important to me." },
  },
  {
    id: "q07_incapace_cambiare",
    sezione: "Processes of change",
    tipo: "percentuale",
    premessa: { it: "Dall'ultima valutazione…", en: "Since the last assessment…" },
    testo: { it: "Sono stato/a incapace di cambiare i miei comportamenti non efficaci.",
             en: "I was unable to change my ineffective behaviours." },
  },
  {
    id: "q08_cose_importanti",
    sezione: "Processes of change",
    tipo: "percentuale",
    premessa: { it: "Dall'ultima valutazione…", en: "Since the last assessment…" },
    testo: { it: "Ho scelto di fare cose che erano realmente importanti per me.",
             en: "I chose to do things that were truly important to me." },
  },
  {
    id: "q09_esprimere_emozioni",
    sezione: "Processes of change",
    tipo: "percentuale",
    premessa: { it: "Dall'ultima valutazione…", en: "Since the last assessment…" },
    testo: { it: "Non ho trovato un modo appropriato per esprimere le mie emozioni.",
             en: "I did not find an appropriate way to express my emotions." },
  },
  {
    id: "q10_distinguere_pensieri",
    sezione: "Processes of change",
    tipo: "percentuale",
    premessa: { it: "Dall'ultima valutazione…", en: "Since the last assessment…" },
    testo: { it: "Sono stato/a in grado di distinguere me stesso/a dai miei pensieri e dai miei sentimenti.",
             en: "I was able to distinguish myself from my thoughts and feelings." },
  },

  // ---------- Affective states ----------
  {
    id: "q11_felice", sezione: "Affective states", tipo: "percentuale",
    premessa: { it: "In questo momento…", en: "Right now…" },
    testo: { it: "Quanto ti senti felice?", en: "How happy do you feel?" },
  },
  {
    id: "q12_nervoso", sezione: "Affective states", tipo: "percentuale",
    premessa: { it: "In questo momento…", en: "Right now…" },
    testo: { it: "Quanto ti senti nervoso/a?", en: "How nervous do you feel?" },
  },
  {
    id: "q13_triste", sezione: "Affective states", tipo: "percentuale",
    premessa: { it: "In questo momento…", en: "Right now…" },
    testo: { it: "Quanto ti senti triste?", en: "How sad do you feel?" },
  },
  {
    id: "q14_arrabbiato", sezione: "Affective states", tipo: "percentuale",
    premessa: { it: "In questo momento…", en: "Right now…" },
    testo: { it: "Quanto ti senti arrabbiato/a?", en: "How angry do you feel?" },
  },
  {
    id: "q15_annoiato", sezione: "Affective states", tipo: "percentuale",
    premessa: { it: "In questo momento…", en: "Right now…" },
    testo: { it: "Quanto ti senti annoiato/a?", en: "How bored do you feel?" },
  },

  // ---------- Symptom-related distress ----------
  {
    id: "q16_sofferenza_sintomi", sezione: "Symptom-related distress", tipo: "percentuale",
    premessa: { it: "Dall'ultima valutazione…", en: "Since the last assessment…" },
    testo: { it: "Quanto hai sofferto a causa dei tuoi sintomi?", en: "How much have you suffered because of your symptoms?" },
  },
];
