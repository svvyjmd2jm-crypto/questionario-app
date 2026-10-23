// =====================================================================
//  IMPOSTAZIONI DELL'APP — modifica questo file, domande.js e informativa.js
//  Le voci [DA COMPILARE] vanno completate prima di avviare lo studio,
//  d'accordo con il DPO (Responsabile Protezione Dati) dell'ente.
// =====================================================================

const CONFIG = {
  // Nome mostrato in alto nell'app (le traduzioni dell'interfaccia sono in lingue.js)
  NOME_APP: "Emotio",

  // I testi per l'informativa qui sotto possono essere scritti in due lingue così:
  //   TITOLO_STUDIO: { it: "Titolo in italiano", en: "Title in English" },

  // 1) URL della Web App di Google Apps Script (vedi GUIDA, passo 2)
  URL_APPS_SCRIPT: "https://script.google.com/macros/s/AKfycbyeF710Ab22EpQ5Vy1PvY05ozUzVZdBsM-OV3nKeG7KmkqR_hZcNYviLOlTodW8e1e6jA/exec",

  // 2) App ID di OneSignal (vedi GUIDA, passo 4). È un identificativo pubblico.
  //    NON incollare qui la API Key: quella va solo in Code.gs.
  ONESIGNAL_APP_ID: "9bb6410e-cf49-4731-b9e8-29d550cedf81",

  // Promemoria solo a chi non ha appena compilato. Per farlo l'app comunica a
  // OneSignal SOLO l'orario dell'ultima compilazione (mai le risposte).
  // Metti false se preferisci non comunicare nemmeno questo: i promemoria
  // arriveranno a tutti, anche a chi ha appena compilato.
  PROMEMORIA_SOLO_A_CHI_NON_HA_COMPILATO: false,

  // ID partecipante: ultime 2 lettere del nome + ultime 2 del cognome
  // + ultime N cifre del cellulare (es. TONO740). 3 cifre bastano.
  ID_CIFRE_TELEFONO: 3,

  // Fasce orarie (ora italiana) in cui si può compilare: al massimo una
  // compilazione per fascia. DEVONO essere uguali a FASCE_ORARIE nello script Google.
  FASCE_ORARIE: [
    ["09:00", "11:00"],
    ["13:00", "15:00"],
    ["17:00", "19:00"],
    ["21:00", "23:00"],
  ],

  // ---------------- DATI PER L'INFORMATIVA PRIVACY ----------------
  // Cambia la versione ogni volta che modifichi l'informativa: viene
  // registrata insieme a ogni consenso.
  VERSIONE_INFORMATIVA: "1.0 del 15/10/2026",

  TITOLO_STUDIO: "[DA COMPILARE: titolo dello studio]",
  TITOLARE: "[DA COMPILARE: ente titolare del trattamento, es. Università di ..., Dipartimento di ...]",
  TITOLARE_INDIRIZZO: "[DA COMPILARE: indirizzo / PEC del titolare]",
  RESPONSABILE_SCIENTIFICO: "[DA COMPILARE: Nome Cognome del responsabile scientifico]",
  EMAIL_STUDIO: "[DA COMPILARE: email dello studio]",
  DPO_CONTATTO: "[DA COMPILARE: email del Responsabile Protezione Dati (DPO) dell'ente]",
  COMITATO_ETICO: "[DA COMPILARE: Comitato Etico, n. e data del parere]",

  // Fino a quando si possono revocare consenso e chiedere la cancellazione
  // (di solito fino all'analisi o alla pubblicazione dei risultati)
  TERMINE_REVOCA: "[DA COMPILARE: es. fino al 31/12/2027, prima dell'analisi dei dati]",
  // Per quanto tempo vengono conservati i dati pseudonimizzati
  CONSERVAZIONE: "[DA COMPILARE: es. 5 anni dalla pubblicazione dei risultati, poi cancellati o resi anonimi]",
};
