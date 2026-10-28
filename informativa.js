// =====================================================================
//  TESTI DEL CONSENSO E DELL'INFORMATIVA PRIVACY (artt. 13 e 9 GDPR)
//  in italiano (TESTI.it) e in inglese (TESTI.en).
//  Modello da verificare con il DPO dell'ente e con il Comitato Etico.
//  I dati tra parentesi graffe ${...} vengono presi da config.js.
//  Gli "id" dei consensi devono restare uguali nelle due lingue.
// =====================================================================

const TESTI = {};

TESTI.it = {
  // Presentazione breve dello studio (prima schermata)
  PRESENTAZIONE: (c) => `
    <p>Ti chiediamo di partecipare allo studio <b>${c.TITOLO_STUDIO}</b>, su emozioni,
    pensieri ed esperienze nella vita di tutti i giorni.</p>
    <p>Quattro volte al giorno l'app ti invierà una notifica per compilare un breve
    questionario (circa 2 minuti). La notifica arriva in un momento casuale e da quel
    momento hai <b>60 minuti</b> per rispondere. Se non riesci, nessun problema: aspetta la notifica
    successiva. Rispondi pensando a come ti senti in quel momento e a quello che è
    successo dall'ultima compilazione.</p>
    <p><b>Partecipare è volontario.</b> Puoi smettere quando vuoi, senza dare spiegazioni
    e senza alcuna conseguenza. Dall'app puoi anche ritirare il consenso e far cancellare
    le tue risposte.</p>
    <p><b>Non ti chiediamo nome, email o numero di telefono.</b> Le risposte sono
    collegate solo a un ID che crei tu e a un codice casuale creato su questo telefono
    (dati pseudonimizzati).</p>
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
      tempo passato su ogni domanda e movimenti dello slider, se hai aperto il questionario
      da un promemoria, tipo di sistema (iOS/Android), lingua usata.</li>
      <li><b>ID partecipante</b> che crei tu (ultime due lettere del nome, ultime due del
      cognome e ultime cifre del cellulare, es. TONO740). Serve a collegare le tue
      compilazioni anche se cambi telefono o reinstalli l'app. Non contiene il tuo nome
      né il tuo numero di telefono completi.</li>
      <li><b>Codice dispositivo</b>: un codice casuale (es. K7P3-QXMA) generato sul tuo
      telefono, usato per l'invio delle risposte e per la cancellazione dei dati.</li>
      <li><b>Registro del consenso</b>: data, ora, lingua e versione dell'informativa accettata.</li>
      <li><b>Per i promemoria</b>, solo se li attivi: un identificativo tecnico del
      dispositivo per le notifiche e la lingua dell'app. Il servizio di notifiche
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
    conserva solo l'ID e il codice dispositivo, la lingua, la data del consenso e le risposte in attesa di
    invio. Se ritiri il consenso, l'app cancella anche questi dati dal telefono.</p>

    <h3>10. Processi decisionali automatizzati</h3>
    <p>Non viene effettuata alcuna profilazione né decisione automatizzata nei tuoi confronti.</p>

    <p class="piccolo">Versione dell'informativa: ${c.VERSIONE_INFORMATIVA}</p>
  `,
};

TESTI.en = {
  // Short presentation of the study (first screen)
  PRESENTAZIONE: (c) => `
    <p>We are asking you to take part in the study <b>${c.TITOLO_STUDIO}</b>, about emotions,
    thoughts and experiences in everyday life.</p>
    <p>Four times a day the app will send you a notification to answer a short
    questionnaire (about 2 minutes). The notification arrives at a random moment and from
    that moment you have <b>60 minutes</b> to answer. If you cannot, that is fine: just wait for the next
    notification. Answer thinking about how you feel at that moment and about what has
    happened since the last questionnaire.</p>
    <p><b>Taking part is voluntary.</b> You can stop whenever you want, without giving any
    reason and without any consequence. From the app you can also withdraw your consent and
    have your answers deleted.</p>
    <p><b>We do not ask for your name, email or phone number.</b> Your answers are linked
    only to an ID you create and to a random code generated on this phone (pseudonymised data).</p>
  `,

  // Consent boxes: all required to take part (same ids as the Italian version)
  CONSENSI: [
    {
      id: "informativa",
      testo: "I have read the privacy notice and I am at least 18 years old.",
    },
    {
      id: "partecipazione",
      testo: "I freely agree to take part in the study.",
    },
    {
      id: "dati_salute",
      testo: "I explicitly consent to the processing of my health-related data " +
        "(emotional states, stress, symptoms) for the research purposes described (Art. 9(2)(a) GDPR).",
    },
  ],

  // Full privacy notice under Art. 13 GDPR
  INFORMATIVA: (c) => `
    <h3>1. Data controller</h3>
    <p>${c.TITOLARE}, ${c.TITOLARE_INDIRIZZO}.<br>
    Principal investigator: ${c.RESPONSABILE_SCIENTIFICO}, ${c.EMAIL_STUDIO}.<br>
    Data Protection Officer (DPO): ${c.DPO_CONTATTO}.</p>

    <h3>2. Purpose</h3>
    <p>Your data are processed exclusively for the scientific study
    "${c.TITOLO_STUDIO}", approved by ${c.COMITATO_ETICO}. Results will be published
    only in aggregate form, without any reference to individual participants.</p>

    <h3>3. What data we collect</h3>
    <ul>
      <li><b>Questionnaire answers</b>: the place you are in (a general category, not your GPS
      position), events of the day, emotional states, thoughts, symptoms. Some of these are
      <b>health-related data</b> (Art. 9 GDPR).</li>
      <li><b>Technical data about each questionnaire</b>: start and submission date and time,
      duration, time spent on each question and slider movements, whether you opened the
      questionnaire from a reminder, operating system (iOS/Android), language used.</li>
      <li><b>Participant ID</b> that you create (last two letters of your first name, last two of
      your surname and last digits of your mobile number, e.g. TONO740). It links your
      questionnaires even if you change phone or reinstall the app. It does not contain your
      full name or full phone number.</li>
      <li><b>Device code</b>: a random code (e.g. K7P3-QXMA) generated on your phone, used to
      send your answers and to delete your data.</li>
      <li><b>Consent record</b>: date, time, language and version of the notice you accepted.</li>
      <li><b>For reminders</b>, only if you turn them on: a technical device identifier for
      notifications and the language of the app. The notification service never receives
      your answers.</li>
    </ul>
    <p>We do not collect your name, email, phone number or GPS position.
    The data are <b>pseudonymised</b>: the research team does not use the ID to identify you
    and does not match it with any list of names or phone numbers.</p>

    <h3>4. Legal basis</h3>
    <p>Your consent (Art. 6(1)(a) GDPR) and, for health-related data, your explicit consent
    (Art. 9(2)(a) GDPR), in compliance with Art. 110 of Italian Legislative Decree 196/2003
    and the Italian ethical rules for processing for scientific research purposes.</p>

    <h3>5. Voluntary nature</h3>
    <p>Taking part is optional. If you do not consent you cannot use the app, without any
    consequence. Reminders are optional and can be turned off at any time.</p>

    <h3>6. Who processes the data and where</h3>
    <p>The data are accessible only to the authorised research team. To run the app we use
    the following providers, appointed as data processors (Art. 28 GDPR):</p>
    <ul>
      <li><b>Google</b> (Google Workspace): storage of answers in a restricted-access spreadsheet;</li>
      <li><b>OneSignal Inc.</b> (USA): sending reminders;</li>
      <li><b>GitHub Inc.</b> (USA): hosting the app files. Like any website, it may record the IP
      address in technical logs.</li>
    </ul>
    <p>Some of these providers may process data in the United States. Transfers are based on
    the EU-US Data Privacy Framework (European Commission adequacy decision of 10 July 2023)
    or on Standard Contractual Clauses (Art. 46 GDPR).</p>

    <h3>7. Retention</h3>
    <p>${c.CONSERVAZIONE}. Reminder data are deleted at the end of data collection. Answers
    not yet sent remain on your phone only until they are sent.</p>

    <h3>8. Your rights</h3>
    <p>You can request access to your data, rectification, erasure, restriction of processing
    and data portability, and you can object to processing (Arts. 15-22 GDPR). You can
    <b>withdraw your consent</b> at any time, without affecting the lawfulness of processing
    carried out before the withdrawal.</p>
    <p><b>How:</b> in the <i>Privacy and data</i> section of the app you can withdraw your consent
    and immediately delete all your answers. For the other rights, write to ${c.EMAIL_STUDIO}
    stating your participant ID, which you can find in the app. We can delete or provide the
    data linked to your ID ${c.TERMINE_REVOCA}. After that date the data may already have been
    anonymised or included in aggregate analyses (Art. 17(3)(d) GDPR).</p>
    <p>You also have the right to lodge a complaint with the Italian Data Protection Authority
    (Garante per la protezione dei dati personali, www.garanteprivacy.it).</p>

    <h3>9. Security and data on your phone</h3>
    <p>Data are sent over an encrypted connection (HTTPS). The app does not use cookies. On your
    phone it stores only your ID and device code, your language, the consent date and any
    answers waiting to be sent. If you withdraw your consent, the app also deletes these data
    from your phone.</p>

    <h3>10. Automated decision-making</h3>
    <p>No profiling or automated decision-making is carried out about you.</p>

    <p class="piccolo">Notice version: ${c.VERSIONE_INFORMATIVA}</p>
  `,
};

TESTI.el = {
  // Σύντομη παρουσίαση της μελέτης (πρώτη οθόνη)
  PRESENTAZIONE: (c) => `
    <p>Σου ζητάμε να συμμετάσχεις στη μελέτη <b>${c.TITOLO_STUDIO}</b>, σχετικά με τα συναισθήματα,
    τις σκέψεις και τις εμπειρίες της καθημερινής ζωής.</p>
    <p>Τέσσερις φορές την ημέρα η εφαρμογή θα σου στέλνει μια ειδοποίηση για να συμπληρώσεις ένα σύντομο
    ερωτηματολόγιο (περίπου 2 λεπτά). Η ειδοποίηση έρχεται σε μια τυχαία στιγμή και από
    εκείνη τη στιγμή έχεις <b>60 λεπτά</b> για να απαντήσεις. Αν δεν μπορείς, δεν πειράζει: περίμενε την επόμενη
    ειδοποίηση. Απάντησε σκεπτόμενος/η πώς νιώθεις εκείνη τη στιγμή
    και τι έχει συμβεί από την τελευταία συμπλήρωση.</p>
    <p><b>Η συμμετοχή είναι εθελοντική.</b> Μπορείς να σταματήσεις όποτε θέλεις, χωρίς να δώσεις
    εξηγήσεις και χωρίς καμία συνέπεια. Από την εφαρμογή μπορείς επίσης να ανακαλέσεις τη συναίνεσή σου
    και να ζητήσεις τη διαγραφή των απαντήσεών σου.</p>
    <p><b>Δεν σου ζητάμε όνομα, email ή αριθμό τηλεφώνου.</b> Οι απαντήσεις σου συνδέονται μόνο
    με έναν κωδικό που δημιουργείς εσύ και με έναν τυχαίο κωδικό που δημιουργείται σε αυτό το κινητό
    (ψευδωνυμοποιημένα δεδομένα).</p>
  `,

  // Πεδία συναίνεσης: όλα υποχρεωτικά (ίδια id με την ιταλική έκδοση)
  CONSENSI: [
    {
      id: "informativa",
      testo: "Διάβασα την ενημέρωση για την επεξεργασία των προσωπικών δεδομένων και είμαι τουλάχιστον 18 ετών.",
    },
    {
      id: "partecipazione",
      testo: "Συναινώ ελεύθερα να συμμετάσχω στη μελέτη.",
    },
    {
      id: "dati_salute",
      testo: "Συναινώ ρητά στην επεξεργασία των δεδομένων υγείας μου " +
        "(συναισθηματικές καταστάσεις, στρες, συμπτώματα) για τους ερευνητικούς σκοπούς που περιγράφονται (άρθρο 9 παρ. 2 στοιχ. α ΓΚΠΔ).",
    },
  ],

  // Πλήρης ενημέρωση σύμφωνα με το άρθρο 13 ΓΚΠΔ
  INFORMATIVA: (c) => `
    <h3>1. Υπεύθυνος επεξεργασίας</h3>
    <p>${c.TITOLARE}, ${c.TITOLARE_INDIRIZZO}.<br>
    Επιστημονικά υπεύθυνος: ${c.RESPONSABILE_SCIENTIFICO}, ${c.EMAIL_STUDIO}.<br>
    Υπεύθυνος Προστασίας Δεδομένων (DPO): ${c.DPO_CONTATTO}.</p>

    <h3>2. Σκοπός</h3>
    <p>Τα δεδομένα υποβάλλονται σε επεξεργασία αποκλειστικά για την επιστημονική μελέτη
    «${c.TITOLO_STUDIO}», που εγκρίθηκε από ${c.COMITATO_ETICO}. Τα αποτελέσματα θα δημοσιευθούν
    μόνο σε συγκεντρωτική μορφή, χωρίς καμία αναφορά σε μεμονωμένους συμμετέχοντες.</p>

    <h3>3. Ποια δεδομένα συλλέγουμε</h3>
    <ul>
      <li><b>Απαντήσεις στα ερωτηματολόγια</b>: ο χώρος όπου βρίσκεσαι (γενική κατηγορία, όχι η θέση GPS),
      γεγονότα της ημέρας, συναισθηματικές καταστάσεις, σκέψεις, συμπτώματα. Ορισμένα από αυτά είναι
      <b>δεδομένα υγείας</b> (άρθρο 9 ΓΚΠΔ).</li>
      <li><b>Τεχνικά δεδομένα της συμπλήρωσης</b>: ημερομηνία και ώρα έναρξης και αποστολής, διάρκεια,
      χρόνος σε κάθε ερώτηση και κινήσεις του δείκτη, αν άνοιξες το ερωτηματολόγιο από υπενθύμιση,
      λειτουργικό σύστημα (iOS/Android), γλώσσα.</li>
      <li><b>Κωδικός συμμετέχοντα</b> που δημιουργείς εσύ (τα δύο τελευταία γράμματα του ονόματος, τα δύο
      τελευταία του επωνύμου και τα τελευταία ψηφία του κινητού, π.χ. TONO740). Συνδέει τις συμπληρώσεις σου
      ακόμη κι αν αλλάξεις κινητό ή εγκαταστήσεις ξανά την εφαρμογή. Δεν περιέχει ολόκληρο το όνομά σου
      ούτε ολόκληρο τον αριθμό τηλεφώνου σου.</li>
      <li><b>Κωδικός συσκευής</b>: ένας τυχαίος κωδικός (π.χ. K7P3-QXMA) που δημιουργείται στο κινητό σου και
      χρησιμοποιείται για την αποστολή των απαντήσεων και για τη διαγραφή των δεδομένων.</li>
      <li><b>Καταγραφή της συναίνεσης</b>: ημερομηνία, ώρα, γλώσσα και έκδοση της ενημέρωσης που αποδέχτηκες.</li>
      <li><b>Για τις υπενθυμίσεις</b>, μόνο αν τις ενεργοποιήσεις: ένα τεχνικό αναγνωριστικό της συσκευής
      για τις ειδοποιήσεις και η γλώσσα της εφαρμογής. Η υπηρεσία ειδοποιήσεων δεν λαμβάνει ποτέ
      τις απαντήσεις σου.</li>
    </ul>
    <p>Δεν συλλέγουμε όνομα, email, αριθμό τηλεφώνου ούτε θέση GPS. Τα δεδομένα είναι
    <b>ψευδωνυμοποιημένα</b>: η ερευνητική ομάδα δεν χρησιμοποιεί τον κωδικό για να σε ταυτοποιήσει
    και δεν τον διασταυρώνει με λίστες ονομάτων ή αριθμών τηλεφώνου.</p>

    <h3>4. Νομική βάση</h3>
    <p>Η συναίνεσή σου (άρθρο 6 παρ. 1 στοιχ. α ΓΚΠΔ) και, για τα δεδομένα υγείας, η ρητή συναίνεσή σου
    (άρθρο 9 παρ. 2 στοιχ. α ΓΚΠΔ), σύμφωνα με το άρθρο 110 του ιταλικού Νομοθετικού Διατάγματος 196/2003
    και τους ιταλικούς κανόνες δεοντολογίας για την επεξεργασία για σκοπούς επιστημονικής έρευνας.</p>

    <h3>5. Προαιρετικός χαρακτήρας</h3>
    <p>Η συμμετοχή είναι προαιρετική. Αν δεν συναινέσεις, δεν μπορείς να χρησιμοποιήσεις την εφαρμογή,
    χωρίς καμία συνέπεια. Οι υπενθυμίσεις είναι προαιρετικές και μπορούν να απενεργοποιηθούν οποιαδήποτε στιγμή.</p>

    <h3>6. Ποιος επεξεργάζεται τα δεδομένα και πού</h3>
    <p>Τα δεδομένα είναι προσβάσιμα μόνο στην εξουσιοδοτημένη ερευνητική ομάδα. Για τη λειτουργία της
    εφαρμογής χρησιμοποιούμε τους εξής παρόχους, που έχουν οριστεί εκτελούντες την επεξεργασία (άρθρο 28 ΓΚΠΔ):</p>
    <ul>
      <li><b>Google</b> (Google Workspace): αποθήκευση των απαντήσεων σε υπολογιστικό φύλλο περιορισμένης πρόσβασης·</li>
      <li><b>OneSignal Inc.</b> (ΗΠΑ): αποστολή των υπενθυμίσεων·</li>
      <li><b>GitHub Inc.</b> (ΗΠΑ): φιλοξενία των αρχείων της εφαρμογής. Όπως κάθε ιστότοπος, μπορεί να
      καταγράφει τη διεύθυνση IP στα τεχνικά αρχεία καταγραφής.</li>
    </ul>
    <p>Ορισμένοι από αυτούς τους παρόχους μπορεί να επεξεργάζονται δεδομένα στις Ηνωμένες Πολιτείες.
    Η διαβίβαση βασίζεται στο Πλαίσιο Προστασίας Δεδομένων ΕΕ-ΗΠΑ (απόφαση επάρκειας της Ευρωπαϊκής
    Επιτροπής της 10ης Ιουλίου 2023) ή στις Τυποποιημένες Συμβατικές Ρήτρες (άρθρο 46 ΓΚΠΔ).</p>

    <h3>7. Διατήρηση</h3>
    <p>${c.CONSERVAZIONE}. Τα δεδομένα των υπενθυμίσεων διαγράφονται στο τέλος της συλλογής δεδομένων.
    Οι απαντήσεις που δεν έχουν σταλεί ακόμη παραμένουν στο κινητό σου μόνο μέχρι την αποστολή τους.</p>

    <h3>8. Τα δικαιώματά σου</h3>
    <p>Μπορείς να ζητήσεις πρόσβαση στα δεδομένα σου, διόρθωση, διαγραφή, περιορισμό της επεξεργασίας
    και φορητότητα, καθώς και να αντιταχθείς στην επεξεργασία (άρθρα 15-22 ΓΚΠΔ). Μπορείς να
    <b>ανακαλέσεις τη συναίνεσή σου</b> οποιαδήποτε στιγμή, χωρίς να θίγεται η νομιμότητα της επεξεργασίας
    που έγινε πριν από την ανάκληση.</p>
    <p><b>Πώς:</b> από την ενότητα <i>Απόρρητο και δεδομένα</i> της εφαρμογής μπορείς να ανακαλέσεις τη
    συναίνεσή σου και να διαγράψεις αμέσως όλες τις απαντήσεις σου. Για τα υπόλοιπα δικαιώματα γράψε στο
    ${c.EMAIL_STUDIO} αναφέροντας τον κωδικό συμμετέχοντα, που θα βρεις στην εφαρμογή. Μπορούμε να
    διαγράψουμε ή να σου παράσχουμε τα δεδομένα που συνδέονται με τον κωδικό σου ${c.TERMINE_REVOCA}.
    Μετά από αυτή την ημερομηνία τα δεδομένα ενδέχεται να έχουν ήδη ανωνυμοποιηθεί ή να έχουν συμπεριληφθεί
    σε συγκεντρωτικές αναλύσεις (άρθρο 17 παρ. 3 στοιχ. δ ΓΚΠΔ).</p>
    <p>Έχεις επίσης δικαίωμα να υποβάλεις καταγγελία στην ιταλική Αρχή Προστασίας Δεδομένων
    (Garante per la protezione dei dati personali, www.garanteprivacy.it).</p>

    <h3>9. Ασφάλεια και δεδομένα στο κινητό</h3>
    <p>Τα δεδομένα αποστέλλονται μέσω κρυπτογραφημένης σύνδεσης (HTTPS). Η εφαρμογή δεν χρησιμοποιεί cookies.
    Στο κινητό αποθηκεύει μόνο τον κωδικό συμμετέχοντα και τον κωδικό συσκευής, τη γλώσσα, την ημερομηνία
    της συναίνεσης και τις απαντήσεις που περιμένουν να σταλούν. Αν ανακαλέσεις τη συναίνεσή σου, η εφαρμογή
    διαγράφει και αυτά τα δεδομένα από το κινητό.</p>

    <h3>10. Αυτοματοποιημένη λήψη αποφάσεων</h3>
    <p>Δεν πραγματοποιείται καμία κατάρτιση προφίλ ούτε αυτοματοποιημένη λήψη αποφάσεων για εσένα.</p>

    <p class="piccolo">Έκδοση ενημέρωσης: ${c.VERSIONE_INFORMATIVA}</p>
  `,
};

TESTI.de = {
  // Kurze Vorstellung der Studie (erster Bildschirm)
  PRESENTAZIONE: (c) => `
    <p>Wir bitten dich, an der Studie <b>${c.TITOLO_STUDIO}</b> über Gefühle, Gedanken und
    Erfahrungen im Alltag teilzunehmen.</p>
    <p>Viermal am Tag sendet dir die App eine Benachrichtigung, um einen kurzen Fragebogen
    auszufüllen (etwa 2 Minuten). Die Benachrichtigung kommt zu einem zufälligen Zeitpunkt, und
    ab diesem Moment hast du <b>60 Minuten</b> Zeit zum Antworten. Wenn es nicht klappt, ist das
    kein Problem: Warte einfach auf die nächste Benachrichtigung. Antworte so, wie du dich in
    diesem Moment fühlst, und denke an das, was seit dem letzten Fragebogen passiert ist.</p>
    <p><b>Die Teilnahme ist freiwillig.</b> Du kannst jederzeit aufhören, ohne Angabe von Gründen
    und ohne jede Folge. In der App kannst du außerdem deine Einwilligung widerrufen und deine
    Antworten löschen lassen.</p>
    <p><b>Wir fragen nicht nach deinem Namen, deiner E-Mail-Adresse oder deiner Telefonnummer.</b>
    Deine Antworten sind nur mit einer ID verknüpft, die du selbst erstellst, und mit einem
    zufälligen Code, der auf diesem Handy erzeugt wird (pseudonymisierte Daten).</p>
  `,

  // Einwilligungen: alle erforderlich (gleiche ids wie in der italienischen Version)
  CONSENSI: [
    {
      id: "informativa",
      testo: "Ich habe die Datenschutzinformation gelesen und bin mindestens 18 Jahre alt.",
    },
    {
      id: "partecipazione",
      testo: "Ich nehme freiwillig an der Studie teil.",
    },
    {
      id: "dati_salute",
      testo: "Ich willige ausdrücklich in die Verarbeitung meiner Gesundheitsdaten " +
        "(Gefühlszustände, Stress, Symptome) für die beschriebenen Forschungszwecke ein (Art. 9 Abs. 2 lit. a DSGVO).",
    },
  ],

  // Vollständige Datenschutzinformation nach Art. 13 DSGVO
  INFORMATIVA: (c) => `
    <h3>1. Verantwortlicher</h3>
    <p>${c.TITOLARE}, ${c.TITOLARE_INDIRIZZO}.<br>
    Wissenschaftliche Leitung: ${c.RESPONSABILE_SCIENTIFICO}, ${c.EMAIL_STUDIO}.<br>
    Datenschutzbeauftragte/r: ${c.DPO_CONTATTO}.</p>

    <h3>2. Zweck</h3>
    <p>Deine Daten werden ausschließlich für die wissenschaftliche Studie
    „${c.TITOLO_STUDIO}“ verarbeitet, die von ${c.COMITATO_ETICO} genehmigt wurde. Die Ergebnisse
    werden nur in zusammengefasster Form veröffentlicht, ohne Bezug auf einzelne Teilnehmende.</p>

    <h3>3. Welche Daten wir erheben</h3>
    <ul>
      <li><b>Antworten im Fragebogen</b>: der Ort, an dem du dich befindest (eine allgemeine
      Kategorie, nicht deine GPS-Position), Ereignisse des Tages, Gefühlszustände, Gedanken,
      Symptome. Einige davon sind <b>Gesundheitsdaten</b> (Art. 9 DSGVO).</li>
      <li><b>Technische Daten zu jedem Fragebogen</b>: Datum und Uhrzeit von Beginn und Absenden,
      Dauer, Zeit pro Frage und Bewegungen des Reglers, ob du den Fragebogen über eine Erinnerung
      geöffnet hast, Betriebssystem (iOS/Android), verwendete Sprache.</li>
      <li><b>Teilnehmer-ID</b>, die du selbst erstellst (die letzten zwei Buchstaben deines
      Vornamens, die letzten zwei deines Nachnamens und die letzten Ziffern deiner Handynummer,
      z. B. TONO740). Sie verknüpft deine Fragebögen, auch wenn du das Handy wechselst oder die
      App neu installierst. Sie enthält weder deinen vollständigen Namen noch deine vollständige
      Telefonnummer.</li>
      <li><b>Gerätecode</b>: ein zufälliger Code (z. B. K7P3-QXMA), der auf deinem Handy erzeugt
      wird und zum Senden deiner Antworten und zum Löschen deiner Daten dient.</li>
      <li><b>Nachweis der Einwilligung</b>: Datum, Uhrzeit, Sprache und Version der
      Datenschutzinformation, die du akzeptiert hast.</li>
      <li><b>Für die Erinnerungen</b>, nur wenn du sie aktivierst: eine technische Gerätekennung
      für Benachrichtigungen und die Sprache der App. Der Benachrichtigungsdienst erhält niemals
      deine Antworten.</li>
    </ul>
    <p>Wir erheben weder deinen Namen noch deine E-Mail-Adresse, Telefonnummer oder GPS-Position.
    Die Daten sind <b>pseudonymisiert</b>: Das Forschungsteam verwendet die ID nicht, um dich zu
    identifizieren, und gleicht sie mit keiner Liste von Namen oder Telefonnummern ab.</p>

    <h3>4. Rechtsgrundlage</h3>
    <p>Deine Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) und, für Gesundheitsdaten, deine
    ausdrückliche Einwilligung (Art. 9 Abs. 2 lit. a DSGVO), unter Beachtung von Art. 110 des
    italienischen Gesetzesdekrets 196/2003 und der italienischen Verhaltensregeln für die
    Verarbeitung zu wissenschaftlichen Forschungszwecken.</p>

    <h3>5. Freiwilligkeit</h3>
    <p>Die Teilnahme ist freiwillig. Ohne Einwilligung kannst du die App nicht nutzen, ohne dass
    dir daraus irgendeine Folge entsteht. Die Erinnerungen sind freiwillig und können jederzeit
    ausgeschaltet werden.</p>

    <h3>6. Wer die Daten verarbeitet und wo</h3>
    <p>Zugang zu den Daten hat nur das berechtigte Forschungsteam. Für den Betrieb der App nutzen
    wir folgende Dienstleister, die als Auftragsverarbeiter (Art. 28 DSGVO) bestellt sind:</p>
    <ul>
      <li><b>Google</b> (Google Workspace): Speicherung der Antworten in einer Tabelle mit
      beschränktem Zugriff;</li>
      <li><b>OneSignal Inc.</b> (USA): Versand der Erinnerungen;</li>
      <li><b>GitHub Inc.</b> (USA): Bereitstellung der App-Dateien. Wie jede Website kann GitHub
      die IP-Adresse in technischen Protokollen speichern.</li>
    </ul>
    <p>Einige dieser Dienstleister können Daten in den USA verarbeiten. Die Übermittlung stützt
    sich auf das EU-US Data Privacy Framework (Angemessenheitsbeschluss der Europäischen
    Kommission vom 10. Juli 2023) oder auf Standardvertragsklauseln (Art. 46 DSGVO).</p>

    <h3>7. Speicherdauer</h3>
    <p>${c.CONSERVAZIONE}. Die Daten für die Erinnerungen werden am Ende der Datenerhebung
    gelöscht. Noch nicht gesendete Antworten bleiben nur so lange auf deinem Handy, bis sie
    gesendet werden.</p>

    <h3>8. Deine Rechte</h3>
    <p>Du kannst Auskunft über deine Daten, ihre Berichtigung, Löschung, die Einschränkung der
    Verarbeitung und die Datenübertragbarkeit verlangen und der Verarbeitung widersprechen
    (Art. 15–22 DSGVO). Du kannst deine <b>Einwilligung</b> jederzeit <b>widerrufen</b>, ohne dass
    die Rechtmäßigkeit der bis zum Widerruf erfolgten Verarbeitung berührt wird.</p>
    <p><b>So geht's:</b> Im Bereich <i>Datenschutz und Daten</i> der App kannst du deine
    Einwilligung widerrufen und sofort alle deine Antworten löschen. Für die anderen Rechte
    schreibe an ${c.EMAIL_STUDIO} und gib deine Teilnehmer-ID an, die du in der App findest. Wir
    können die mit deiner ID verknüpften Daten ${c.TERMINE_REVOCA} löschen oder herausgeben.
    Danach können die Daten bereits anonymisiert oder in zusammengefasste Auswertungen
    eingeflossen sein (Art. 17 Abs. 3 lit. d DSGVO).</p>
    <p>Du hast außerdem das Recht, dich bei der italienischen Datenschutzbehörde (Garante per la
    protezione dei dati personali, www.garanteprivacy.it) oder bei der Datenschutzbehörde des
    Landes, in dem du lebst, zu beschweren (Art. 77 DSGVO).</p>

    <h3>9. Sicherheit und Daten auf deinem Handy</h3>
    <p>Die Daten werden über eine verschlüsselte Verbindung (HTTPS) gesendet. Die App verwendet
    keine Cookies. Auf deinem Handy speichert sie nur deine ID und den Gerätecode, deine Sprache,
    das Datum der Einwilligung und eventuell noch nicht gesendete Antworten. Wenn du deine
    Einwilligung widerrufst, löscht die App auch diese Daten von deinem Handy.</p>

    <h3>10. Automatisierte Entscheidungen</h3>
    <p>Es findet weder ein Profiling noch eine automatisierte Entscheidungsfindung über dich statt.</p>

    <p class="piccolo">Version der Datenschutzinformation: ${c.VERSIONE_INFORMATIVA}</p>
  `,
};
