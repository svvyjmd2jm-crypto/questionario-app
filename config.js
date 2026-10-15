// =====================================================================
//  IMPOSTAZIONI DELL'APP — modifica questo file, domande.js e informativa.js
//  Le voci [DA COMPILARE] vanno completate prima di avviare lo studio,
//  d'accordo con il DPO (Responsabile Protezione Dati) dell'ente.
// =====================================================================

const CONFIG = {
  // Nome mostrato in alto nell'app
  NOME_APP: "Diario dello studio",

  // 1) URL della Web App di Google Apps Script (vedi GUIDA, passo 2)
  URL_APPS_SCRIPT: "https://script.google.com/macros/s/AKfycbyeF710Ab22EpQ5Vy1PvY05ozUzVZdBsM-OV3nKeG7KmkqR_hZcNYviLOlTodW8e1e6jA/exec",

  // 2) App ID di OneSignal (vedi GUIDA, passo 4). È un identificativo pubblico.
  //    NON incollare qui la API Key: quella va solo in Code.gs.
  ONESIGNAL_APP_ID: "",

  // Promemoria solo a chi non ha appena compilato. Per farlo l'app comunica a
  // OneSignal SOLO l'orario dell'ultima compilazione (mai le risposte).
  // Metti false se preferisci non comunicare nemmeno questo: i promemoria
  // arriveranno a tutti, anche a chi ha appena compilato.
  PROMEMORIA_SOLO_A_CHI_NON_HA_COMPILATO: true,

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
