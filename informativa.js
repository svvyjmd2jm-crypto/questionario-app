// =====================================================================
//  TESTI DEL CONSENSO E DELL'INFORMATIVA PRIVACY (artt. 13 e 9 GDPR)
//  Modello da verificare con il DPO dell'ente e con il Comitato Etico.
//  I dati tra parentesi graffe ${...} vengono presi da config.js.
// =====================================================================

const TESTI = {
  // Presentazione breve dello studio (prima schermata)
  PRESENTAZIONE: (c) => `
    <p>Ti chiediamo di partecipare allo studio <b>${c.TITOLO_STUDIO}</b>, su emozioni,
    pensieri ed esperienze nella vita di tutti i giorni.</p>
    <p>Più volte al giorno l'app ti invierà un promemoria per compilare un breve
    questionario (circa 2 minuti). Rispondi pensando a come ti senti in quel momento
    e a quello che è successo dall'ultima compilazione.</p>
    <p><b>Partecipare è volontario.</b> Puoi smettere quando vuoi, senza dare spiegazioni
    e senza alcuna conseguenza. Dall'app puoi anche ritirare il consenso e far cancellare
    le tue risposte.</p>
    <p><b>Non ti chiediamo nome, email o numero di telefono.</b> Le risposte sono
    collegate solo a un codice casuale creato su questo telefono (dati pseudonimizzati).</p>
  `,

  // Caselle del consenso: tutte obbligatorie per partecipare
  CONSENSI: [
    {
      id: "informativa",
      testo: "Ho letto l'informativa sul trattamento dei dati personali e ho almeno 18 anni.",
    },
    {
      id: "partecipazione",
      testo: "Acconsento liberamente a partecipare allo studio.",
    },
    {
      id: "dati_salute",
      testo: "Acconsento esplicitamente al trattamento dei miei dati relativi alla salute " +
        "(stati emotivi, stress, sintomi) per le finalità di ricerca descritte (art. 9, par. 2, lett. a, GDPR).",
    },
  ],

  // Informativa completa ai sensi dell'art. 13 GDPR
  INFORMATIVA: (c) => `
    <h3>1. Titolare del trattamento</h3>
    <p>${c.TITOLARE}, ${c.TITOLARE_INDIRIZZO}.<br>
    Responsabile scientifico: ${c.RESPONSABILE_SCIENTIFICO}, ${c.EMAIL_STUDIO}.<br>
    Responsabile della Protezione dei Dati (DPO): ${c.DPO_CONTATTO}.</p>

    <h3>2. Finalità</h3>
    <p>I dati sono trattati esclusivamente per lo studio scientifico
    "${c.TITOLO_STUDIO}", approvato da ${c.COMITATO_ETICO}. I risultati saranno
    pubblicati solo in forma aggregata, senza alcun riferimento a singoli partecipanti.</p>

    <h3>3. Quali dati raccogliamo</h3>
    <ul>
      <li><b>Risposte ai questionari</b>: luogo in cui ti trovi (categoria generica, non la posizione GPS),
      eventi della giornata, stati emotivi, pensieri, sintomi. Alcune sono
      <b>dati relativi alla salute</b> (art. 9 GDPR).</li>
      <li><b>Dati tecnici della compilazione</b>: data e ora di inizio e invio, durata,
      se hai aperto il questionario da un promemoria, tipo di sistema (iOS/Android).</li>
      <li><b>ID partecipante</b> che crei tu (ultime due lettere del nome, ultime due del
      cognome e ultime cifre del cellulare, es. TONO740). Serve a collegare le tue
      compilazioni anche se cambi telefono o reinstalli l'app. Non contiene il tuo nome
      né il tuo numero di telefono completi.</li>
      <li><b>Codice dispositivo</b>: un codice casuale (es. K7P3-QXMA) generato sul tuo
      telefono, usato per l'invio delle risposte e per la cancellazione dei dati.</li>
      <li><b>Registro del consenso</b>: data, ora e versione dell'informativa accettata.</li>
      <li><b>Per i promemoria</b>, solo se li attivi: un identificativo tecnico del
      dispositivo per le notifiche e l'orario dell'ultima compilazione. Il servizio di notifiche
      non riceve mai le tue risposte.</li>
    </ul>
    <p>Non raccogliamo nome, email, numero di telefono né posizione GPS.
    I dati sono <b>pseudonimizzati</b>: il gruppo di ricerca non usa l'ID per risalire alla
    tua identità e non lo incrocia con altri elenchi di nomi o numeri di telefono.</p>

    <h3>4. Base giuridica</h3>
    <p>Il tuo consenso (art. 6, par. 1, lett. a GDPR) e, per i dati relativi alla salute,
    il tuo consenso esplicito (art. 9, par. 2, lett. a GDPR), nel rispetto dell'art. 110
    del D.Lgs. 196/2003 e delle Regole deontologiche per i trattamenti a fini di ricerca
    scientifica.</p>

    <h3>5. Natura del conferimento</h3>
    <p>Partecipare è facoltativo. Se non acconsenti non puoi usare l'app, senza alcuna
    conseguenza. I promemoria sono facoltativi e si possono disattivare in ogni momento.</p>

    <h3>6. Chi tratta i dati e dove</h3>
    <p>I dati sono accessibili solo al gruppo di ricerca autorizzato. Per il funzionamento
    dell'app ci avvaliamo di questi fornitori, nominati responsabili del trattamento (art. 28 GDPR):</p>
    <ul>
      <li><b>Google</b> (Google Workspace): archiviazione delle risposte in un foglio di calcolo
      ad accesso riservato;</li>
      <li><b>OneSignal Inc.</b> (USA): invio dei promemoria;</li>
      <li><b>GitHub Inc.</b> (USA): pubblicazione dei file dell'app. Come ogni sito web,
      può registrare l'indirizzo IP nei log tecnici.</li>
    </ul>
    <p>Alcuni di questi fornitori possono trattare dati negli Stati Uniti. Il trasferimento
    avviene sulla base dell'EU-US Data Privacy Framework (decisione di adeguatezza della
    Commissione europea del 10/07/2023) o delle Clausole Contrattuali Standard (art. 46 GDPR).</p>

    <h3>7. Conservazione</h3>
    <p>${c.CONSERVAZIONE}. I dati per i promemoria vengono cancellati alla fine della
    raccolta dati. Le risposte non ancora inviate restano sul tuo telefono solo fino
    all'invio.</p>

    <h3>8. I tuoi diritti</h3>
    <p>Puoi chiedere l'accesso ai tuoi dati, la rettifica, la cancellazione, la limitazione
    del trattamento, la portabilità e opporti al trattamento (artt. 15-22 GDPR). Puoi
    <b>revocare il consenso</b> in qualsiasi momento, senza pregiudicare la liceità del
    trattamento svolto prima della revoca.</p>
    <p><b>Come fare:</b> dalla sezione <i>Privacy e dati</i> dell'app puoi ritirare il consenso
    e cancellare subito tutte le tue risposte. Per gli altri diritti scrivi a ${c.EMAIL_STUDIO}
    indicando il tuo ID partecipante, che trovi nell'app. Possiamo cancellare o fornirti i dati
    collegati al codice ${c.TERMINE_REVOCA}. Dopo questa data i dati potrebbero
    essere già stati resi anonimi o inclusi in analisi aggregate (art. 17, par. 3, lett. d GDPR).</p>
    <p>Hai inoltre diritto di proporre reclamo al Garante per la protezione dei dati personali
    (www.garanteprivacy.it).</p>

    <h3>9. Sicurezza e dati sul telefono</h3>
    <p>I dati viaggiano su connessione cifrata (HTTPS). L'app non usa cookie. Sul telefono
    conserva solo l'ID e il codice dispositivo, la data del consenso e le risposte in attesa di
    invio. Se ritiri il consenso, l'app cancella anche questi dati dal telefono.</p>

    <h3>10. Processi decisionali automatizzati</h3>
    <p>Non viene effettuata alcuna profilazione né decisione automatizzata nei tuoi confronti.</p>

    <p class="piccolo">Versione dell'informativa: ${c.VERSIONE_INFORMATIVA}</p>
  `,
};
