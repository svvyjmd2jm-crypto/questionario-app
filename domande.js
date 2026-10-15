// =====================================================================
//  DOMANDE DEL QUESTIONARIO
//  Ogni domanda ha un "id" (diventa il nome della colonna nel foglio
//  Google: usa lettere minuscole, numeri e _ , senza spazi).
//
//  Tipi disponibili:
//   - "percentuale"     -> cursore da 0% a 100% (scala visuo-analogica)
//   - "scala"           -> numeri da min a max (es. Likert 1-7)
//   - "scelta"          -> una sola risposta tra le "opzioni"
//   - "scelta_multipla" -> più risposte tra le "opzioni"
//   - "numero"          -> campo numerico (min/max facoltativi)
//   - "testo"           -> risposta libera
//
//  "premessa" = frase mostrata sopra la domanda (es. "Dall'ultima valutazione…")
//  "sezione"  = nome del blocco (non viene mostrato, serve solo a te)
//  "obbligatoria: false" rende la domanda saltabile.
// =====================================================================

// Etichette degli estremi, riutilizzate sotto
const PER_NULLA = ["Per nulla", "Moltissimo"];
const ACCORDO = ["Fortemente in disaccordo", "Fortemente d'accordo"];

const DOMANDE = [
  // ---------- Contesto ----------
  {
    id: "q01_luogo",
    sezione: "Contesto",
    tipo: "scelta",
    testo: "Dove ti trovi in questo momento?",
    opzioni: [
      "A casa",
      "In un luogo privato (ad es. a casa di amici)",
      "Al lavoro / A scuola / In università",
      "In un luogo pubblico",
      "In mezzo alla natura",
      "Altro",
    ],
  },
  {
    id: "q02_eventi_stressanti",
    sezione: "Contesto",
    tipo: "percentuale",
    premessa: "Dall'ultima valutazione…",
    testo: "Ci sono stati eventi e situazioni stressanti?",
    etichette: PER_NULLA,
  },
  {
    id: "q03_eventi_positivi",
    sezione: "Contesto",
    tipo: "percentuale",
    premessa: "Dall'ultima valutazione…",
    testo: "Ci sono stati eventi e situazioni positivi?",
    etichette: PER_NULLA,
  },
  {
    id: "q04_solitudine",
    sezione: "Contesto",
    tipo: "percentuale",
    premessa: "In questo momento…",
    testo: "Quanto ti senti solo/a?",
    etichette: PER_NULLA,
  },
  {
    id: "q05_connessione",
    sezione: "Contesto",
    tipo: "percentuale",
    premessa: "In questo momento…",
    testo: "Quanto ti senti connesso/a alle altre persone?",
    etichette: PER_NULLA,
  },

  // ---------- Processes of change ----------
  {
    id: "q06_pensieri_ostacolo",
    sezione: "Processes of change",
    tipo: "percentuale",
    premessa: "Dall'ultima valutazione…",
    testo: "I miei pensieri hanno ostacolato il mio impegno in cose per me importanti.",
    etichette: ACCORDO,
  },
  {
    id: "q07_incapace_cambiare",
    sezione: "Processes of change",
    tipo: "percentuale",
    premessa: "Dall'ultima valutazione…",
    testo: "Sono stato/a incapace di cambiare i miei comportamenti non efficaci.",
    etichette: ACCORDO,
  },
  {
    id: "q08_cose_importanti",
    sezione: "Processes of change",
    tipo: "percentuale",
    premessa: "Dall'ultima valutazione…",
    testo: "Ho scelto di fare cose che erano realmente importanti per me.",
    etichette: ACCORDO,
  },
  {
    id: "q09_esprimere_emozioni",
    sezione: "Processes of change",
    tipo: "percentuale",
    premessa: "Dall'ultima valutazione…",
    testo: "Non ho trovato un modo appropriato per esprimere le mie emozioni.",
    etichette: ACCORDO,
  },
  {
    id: "q10_distinguere_pensieri",
    sezione: "Processes of change",
    tipo: "percentuale",
    premessa: "Dall'ultima valutazione…",
    testo: "Sono stato/a in grado di distinguere me stesso/a dai miei pensieri e dai miei sentimenti.",
    etichette: ACCORDO,
  },

  // ---------- Affective states ----------
  {
    id: "q11_felice",
    sezione: "Affective states",
    tipo: "percentuale",
    premessa: "In questo momento…",
    testo: "Quanto ti senti felice?",
    etichette: PER_NULLA,
  },
  {
    id: "q12_nervoso",
    sezione: "Affective states",
    tipo: "percentuale",
    premessa: "In questo momento…",
    testo: "Quanto ti senti nervoso/a?",
    etichette: PER_NULLA,
  },
  {
    id: "q13_triste",
    sezione: "Affective states",
    tipo: "percentuale",
    premessa: "In questo momento…",
    testo: "Quanto ti senti triste?",
    etichette: PER_NULLA,
  },
  {
    id: "q14_arrabbiato",
    sezione: "Affective states",
    tipo: "percentuale",
    premessa: "In questo momento…",
    testo: "Quanto ti senti arrabbiato/a?",
    etichette: PER_NULLA,
  },
  {
    id: "q15_annoiato",
    sezione: "Affective states",
    tipo: "percentuale",
    premessa: "In questo momento…",
    testo: "Quanto ti senti annoiato/a?",
    etichette: PER_NULLA,
  },

  // ---------- Symptom-related distress ----------
  {
    id: "q16_sofferenza_sintomi",
    sezione: "Symptom-related distress",
    tipo: "percentuale",
    premessa: "Dall'ultima valutazione…",
    testo: "Quanto hai sofferto a causa dei tuoi sintomi?",
    etichette: PER_NULLA,
  },
];
