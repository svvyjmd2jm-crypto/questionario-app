// =====================================================================
//  LOGICA DELL'APP — di norma non serve modificare questo file
// =====================================================================

(function () {
  "use strict";

  const app = document.getElementById("app");
  const BASE_PATH = location.pathname.replace(/[^/]*$/, ""); // es. "/questionario-app/"

  // ---------- memoria locale del telefono (sicura anche se bloccata) ----------
  const mem = {
    get(k, d) {
      try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); }
      catch (e) { return d; }
    },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
    svuota() { try { localStorage.clear(); } catch (e) {} },
  };

  // ---------- codice partecipante (pseudonimo casuale) ----------
  function nuovoCodice() {
    const alfabeto = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // niente 0/O, 1/I
    const rnd = new Uint8Array(8);
    crypto.getRandomValues(rnd);
    const c = Array.from(rnd, (n) => alfabeto[n % alfabeto.length]).join("");
    return c.slice(0, 4) + "-" + c.slice(4);
  }
  function codicePartecipante() {
    let c = mem.get("codice");
    if (!c) { c = nuovoCodice(); mem.set("codice", c); }
    return c;
  }

  // ---------- dispositivo ----------
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isInstallata = window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;
  const sistema = () => isIOS ? "iOS" : (/Android/i.test(navigator.userAgent) ? "Android" : "Altro");

  // ---------- OneSignal (notifiche) ----------
  // Privacy by default: il servizio di notifiche viene caricato SOLO dopo il consenso.
  let OS = null;
  let osCaricato = false;
  function caricaOneSignal() {
    if (osCaricato || !CONFIG.ONESIGNAL_APP_ID) return;
    osCaricato = true;
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    OneSignalDeferred.push(async function (OneSignal) {
      try {
        await OneSignal.init({
          appId: CONFIG.ONESIGNAL_APP_ID,
          serviceWorkerPath: BASE_PATH.slice(1) + "OneSignalSDKWorker.js",
          serviceWorkerParam: { scope: BASE_PATH },
          allowLocalhostAsSecureOrigin: true,
        });
        OS = OneSignal;
        OneSignal.Notifications.addEventListener("permissionChange", () => render());
        render();
      } catch (e) {
        console.warn("OneSignal non inizializzato:", e);
      }
    });
    const s = document.createElement("script");
    s.src = "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js";
    s.defer = true;
    document.head.appendChild(s);
  }

  function notificheAttive() {
    return !!(OS && OS.Notifications.permission && OS.User.PushSubscription.optedIn !== false);
  }

  async function attivaNotifiche() {
    if (!OS) return;
    try {
      await OS.Notifications.requestPermission();
      if (OS.Notifications.permission) {
        await OS.User.PushSubscription.optIn();
        aggiornaTagCompilazione();
      }
    } catch (e) { console.warn(e); }
    render();
  }

  async function disattivaNotifiche() {
    if (!OS) return;
    try { await OS.User.PushSubscription.optOut(); } catch (e) {}
    render();
  }

  // Comunica a OneSignal SOLO l'orario dell'ultima compilazione (mai le risposte),
  // così i promemoria arrivano solo a chi non ha ancora compilato.
  function aggiornaTagCompilazione() {
    if (!OS || !CONFIG.PROMEMORIA_SOLO_A_CHI_NON_HA_COMPILATO) return;
    const ultima = mem.get("ultima_compilazione");
    try {
      OS.User.addTag("ultima_compilazione", String(ultima ? Math.floor(ultima / 1000) : 0));
    } catch (e) {}
  }

  // ---------- invio dati (con coda se offline) ----------
  async function inviaCoda() {
    const coda = mem.get("coda", []);
    if (!coda.length || !CONFIG.URL_APPS_SCRIPT) return;
    const rimaste = [];
    for (const r of coda) {
      try {
        await fetch(CONFIG.URL_APPS_SCRIPT, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(r),
        });
      } catch (e) {
        rimaste.push(r);
      }
    }
    mem.set("coda", rimaste);
  }
  function accoda(record) {
    mem.set("coda", mem.get("coda", []).concat(record));
  }

  // Richiesta di cancellazione: qui serve sapere se è andata a buon fine
  async function inviaCancellazione(record) {
    if (!CONFIG.URL_APPS_SCRIPT) return false;
    try {
      const r = await fetch(CONFIG.URL_APPS_SCRIPT, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(record),
      });
      const t = await r.text();
      return t.indexOf("ok") === 0;
    } catch (e) {
      return false;
    }
  }

  window.addEventListener("online", () => { inviaCoda(); riprovaCancellazione(); });

  // ---------- utilità ----------
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function formattaData(ms) {
    return new Date(ms).toLocaleString("it-IT", {
      weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit",
    });
  }

  // ---------- stato ----------
  let schermata = mem.get("revocato") ? "revocato"
    : !mem.get("consenso") ? "consenso"
    : !mem.get("id_partecipante") ? "id"
    : "home";
  let indietroDa = "consenso"; // dove torna l'informativa
  let passo = 0;
  let risposte = {};
  let inizio = null;          // quando è iniziata la compilazione
  let daNotifica = false;     // aperta toccando un promemoria?
  let spunte = {};            // caselle del consenso spuntate
  let consensoIl = null;      // momento in cui sono state spuntate le caselle

  if (new URLSearchParams(location.search).get("da") === "notifica" && schermata === "home") { // (solo se l'ID c'è già)
    schermata = "questionario";
    daNotifica = true;
    inizio = Date.now();
  }

  // ---------- schermate ----------
  const SCHERMATE = {
    consenso: vConsenso, informativa: vInformativa, home: vHome, questionario: vQuestionario,
    grazie: vGrazie, privacy: vPrivacy, conferma: vConferma, revocato: vRevocato, id: vId,
  };
  function vai(s) { schermata = s; render(); }
  function render() {
    document.getElementById("nome-app").textContent = CONFIG.NOME_APP;
    document.title = CONFIG.NOME_APP;
    SCHERMATE[schermata]();
    window.scrollTo(0, 0);
  }

  function vConsenso() {
    const tutte = TESTI.CONSENSI.every((c) => spunte[c.id]);
    app.innerHTML = `
      <section class="scheda">
        <h1>Benvenuto/a</h1>
        <div class="informativa">${TESTI.PRESENTAZIONE(CONFIG)}</div>
        <button class="link" id="leggi">Leggi l'informativa privacy completa</button>
      </section>
      <section class="scheda">
        <h2>Consenso informato</h2>
        <div class="consensi">
          ${TESTI.CONSENSI.map((c) => `
            <label class="spunta">
              <input type="checkbox" id="c-${esc(c.id)}" data-id="${esc(c.id)}" ${spunte[c.id] ? "checked" : ""}>
              <span>${esc(c.testo)}</span>
            </label>`).join("")}
        </div>
        <button class="btn primario" id="avanti" ${tutte ? "" : "disabled"}>Acconsento e inizio</button>
        <p class="piccolo">Per partecipare servono tutte e tre le conferme. Puoi revocare il consenso
          in qualsiasi momento dalla sezione <i>Privacy e dati</i>.</p>
      </section>`;
    app.querySelector("#leggi").addEventListener("click", () => { indietroDa = "consenso"; vai("informativa"); });
    const btn = app.querySelector("#avanti");
    app.querySelectorAll(".consensi input").forEach((i) => i.addEventListener("change", () => {
      spunte[i.dataset.id] = i.checked;
      btn.disabled = !TESTI.CONSENSI.every((c) => spunte[c.id]);
    }));
    btn.addEventListener("click", () => { consensoIl = Date.now(); vai("id"); });
  }

  // ---------- ID partecipante (es. TONO740) ----------
  const soloLettere = (t) => String(t || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toUpperCase().replace(/[^A-Z]/g, "");
  const soloCifre = (t) => String(t || "").replace(/\D/g, "");

  function vId() {
    const nCifre = CONFIG.ID_CIFRE_TELEFONO || 3;
    const primoAccesso = !mem.get("consenso");
    app.innerHTML = `
      <section class="scheda">
        <h1>Il tuo ID partecipante</h1>
        <p>Crea il tuo ID così: ti servirà per collegare le tue risposte anche se cambi telefono.</p>
        <div class="campi-id">
          <label for="id-nome"><span>Ultime 2 lettere del tuo <b>nome</b></span>
            <input id="id-nome" maxlength="2" autocapitalize="characters" autocomplete="off" spellcheck="false" placeholder="es. IO">
          </label>
          <label for="id-cognome"><span>Ultime 2 lettere del tuo <b>cognome</b></span>
            <input id="id-cognome" maxlength="2" autocapitalize="characters" autocomplete="off" spellcheck="false" placeholder="es. HI">
          </label>
          <label for="id-tel"><span>Ultime ${nCifre} cifre del tuo <b>cellulare</b></span>
            <input id="id-tel" maxlength="${nCifre}" inputmode="numeric" autocomplete="off" placeholder="${"0".repeat(nCifre)}">
          </label>
        </div>
        <p class="anteprima-id">Il tuo ID: <output id="id-anteprima">—</output></p>
        <p class="piccolo">Esempio: Mario Bianchi, cellulare che finisce con …740 → <b>IOHI740</b>.
          Usa sempre lo stesso ID.</p>
        <p class="errore" id="errore" hidden></p>
        <div class="navigazione">
          ${primoAccesso ? `<button class="btn" id="indietro">Indietro</button>` : ""}
          <button class="btn primario" id="salva" disabled>Conferma</button>
        </div>
      </section>`;
    const nome = app.querySelector("#id-nome");
    const cog = app.querySelector("#id-cognome");
    const tel = app.querySelector("#id-tel");
    const btn = app.querySelector("#salva");
    const anteprima = app.querySelector("#id-anteprima");
    const aggiorna = (e) => {
      nome.value = soloLettere(nome.value); cog.value = soloLettere(cog.value); tel.value = soloCifre(tel.value);
      const ok = nome.value.length === 2 && cog.value.length === 2 && tel.value.length === nCifre;
      anteprima.textContent = ok ? nome.value + cog.value + tel.value : "—";
      btn.disabled = !ok;
      // passa da solo al campo successivo quando uno è completo
      if (e && e.target === nome && nome.value.length === 2) cog.focus();
      if (e && e.target === cog && cog.value.length === 2) tel.focus();
    };
    [nome, cog, tel].forEach((i) => i.addEventListener("input", aggiorna));
    const ind = app.querySelector("#indietro");
    if (ind) ind.addEventListener("click", () => vai("consenso"));
    btn.addEventListener("click", () => {
      const id = nome.value + cog.value + tel.value;
      if (!/^[A-Z]{4}[0-9]+$/.test(id)) return;
      mem.set("id_partecipante", id);
      if (!mem.get("consenso")) {
        const ora = consensoIl || Date.now();
        mem.set("consenso", { il: ora, versione: CONFIG.VERSIONE_INFORMATIVA });
        accoda({
          tipo: "consenso",
          codice: codicePartecipante(),
          id_partecipante: id,
          consenso_il: new Date(ora).toISOString(),
          versione_informativa: CONFIG.VERSIONE_INFORMATIVA,
          consensi_espressi: TESTI.CONSENSI.map((c) => c.id).join("; "),
        });
        inviaCoda();
      }
      caricaOneSignal();
      vai("home");
    });
    nome.focus();
  }

  function vInformativa() {
    app.innerHTML = `
      <section class="scheda testo-lungo">
        <h1>Informativa sul trattamento dei dati personali</h1>
        <p class="piccolo">Artt. 13 e 9 del Regolamento (UE) 2016/679 (GDPR)</p>
        ${TESTI.INFORMATIVA(CONFIG)}
      </section>
      <button class="btn primario larga" id="chiudi">Torna indietro</button>`;
    app.querySelector("#chiudi").addEventListener("click", () => vai(indietroDa));
  }

  function bloccoNotifiche() {
    if (!CONFIG.ONESIGNAL_APP_ID) {
      return `<div class="avviso">Notifiche non ancora configurate (manca l'App ID di OneSignal in <code>config.js</code>).</div>`;
    }
    if (isIOS && !isInstallata) {
      return `
        <div class="avviso">
          <b>Per ricevere i promemoria su iPhone</b>, aggiungi l'app alla schermata Home:
          <ol>
            <li>Tocca il pulsante <b>Condividi</b> <span aria-hidden="true">⬆︎</span> in basso in Safari</li>
            <li>Scegli <b>Aggiungi alla schermata Home</b></li>
            <li>Apri l'app dall'icona appena creata</li>
          </ol>
        </div>`;
    }
    if (!OS) return `<div class="avviso tenue">Caricamento notifiche…</div>`;
    if (notificheAttive()) {
      return `<div class="ok-box">🔔 Promemoria attivi. Ti avviseremo quando è il momento di compilare.</div>`;
    }
    if (typeof Notification !== "undefined" && Notification.permission === "denied") {
      return `<div class="avviso">Hai bloccato le notifiche. Puoi riattivarle dalle impostazioni del telefono per questa app.</div>`;
    }
    return `
      <div class="avviso">
        <p>Attiva i promemoria per sapere quando compilare. Sono facoltativi e puoi
        disattivarli quando vuoi.</p>
        <button class="btn secondario" id="notifiche">Attiva promemoria</button>
      </div>`;
  }

  function vHome() {
    const ultima = mem.get("ultima_compilazione");
    const n = mem.get("conteggio", 0);
    const inCoda = mem.get("coda", []).filter((r) => r.tipo === "risposta").length;
    app.innerHTML = `
      <section class="scheda">
        <h1>Ciao!</h1>
        <p>${ultima
          ? `Ultima compilazione: <b>${esc(formattaData(ultima))}</b><br>Compilazioni totali: <b>${n}</b>`
          : "Non hai ancora compilato il questionario."}</p>
        <button class="btn primario grande" id="inizia">Compila il questionario</button>
        ${inCoda ? `<p class="piccolo">${inCoda} compilazione/i in attesa di invio (verranno inviate appena c'è connessione).</p>` : ""}
      </section>
      ${bloccoNotifiche()}
      <div class="piede">
        <span>Il tuo ID: <b>${esc(mem.get("id_partecipante") || "")}</b></span>
        <button class="link" id="privacy">Privacy e dati</button>
      </div>`;
    app.querySelector("#inizia").addEventListener("click", () => {
      passo = 0; risposte = {}; inizio = Date.now(); vai("questionario");
    });
    const bn = app.querySelector("#notifiche");
    if (bn) bn.addEventListener("click", attivaNotifiche);
    app.querySelector("#privacy").addEventListener("click", () => vai("privacy"));
  }

  function vPrivacy() {
    const cons = mem.get("consenso") || {};
    app.innerHTML = `
      <section class="scheda">
        <h1>Privacy e dati</h1>
        <dl class="dati">
          <dt>Il tuo ID partecipante</dt><dd><b>${esc(mem.get("id_partecipante") || "—")}</b></dd>
          <dt>Codice dispositivo</dt><dd>${esc(codicePartecipante())}</dd>
          <dt>Consenso dato il</dt><dd>${cons.il ? esc(new Date(cons.il).toLocaleString("it-IT", { dateStyle: "short", timeStyle: "short" })) : "—"}</dd>
          <dt>Versione informativa</dt><dd>${esc(cons.versione || "—")}</dd>
        </dl>
        <p class="piccolo">Per esercitare i tuoi diritti (accesso, rettifica, portabilità)
        scrivi a ${esc(CONFIG.EMAIL_STUDIO)} indicando il tuo ID partecipante.</p>
        <button class="link" id="leggi">Leggi l'informativa privacy completa</button>
      </section>

      ${notificheAttive() ? `
      <section class="scheda">
        <h2>Promemoria</h2>
        <p>Puoi smettere di ricevere promemoria e continuare comunque a partecipare.</p>
        <button class="btn" id="stop-notifiche">Disattiva promemoria</button>
      </section>` : ""}

      <section class="scheda pericolo">
        <h2>Ritira il consenso</h2>
        <p>Smetterai di partecipare e <b>tutte le tue risposte verranno cancellate</b>
        dall'archivio dello studio. Verranno cancellati anche i dati per i promemoria e quelli
        salvati su questo telefono.</p>
        <button class="btn rosso" id="revoca">Ritira il consenso e cancella i miei dati</button>
      </section>

      <button class="btn larga" id="home">Torna alla home</button>`;
    app.querySelector("#leggi").addEventListener("click", () => { indietroDa = "privacy"; vai("informativa"); });
    const sn = app.querySelector("#stop-notifiche");
    if (sn) sn.addEventListener("click", disattivaNotifiche);
    app.querySelector("#revoca").addEventListener("click", () => vai("conferma"));
    app.querySelector("#home").addEventListener("click", () => vai("home"));
  }

  function vConferma() {
    app.innerHTML = `
      <section class="scheda pericolo">
        <h1>Sei sicuro/a?</h1>
        <p>Le tue risposte (ID <b>${esc(mem.get("id_partecipante") || codicePartecipante())}</b>) verranno cancellate
        definitivamente e non potranno essere recuperate.</p>
        <div class="navigazione">
          <button class="btn" id="annulla">Annulla</button>
          <button class="btn rosso" id="conferma">Sì, cancella</button>
        </div>
      </section>`;
    app.querySelector("#annulla").addEventListener("click", () => vai("privacy"));
    app.querySelector("#conferma").addEventListener("click", revoca);
  }

  async function revoca() {
    const btn = app.querySelector("#conferma");
    btn.disabled = true;
    btn.textContent = "Cancellazione…";
    const codice = codicePartecipante();
    let osId = "";
    try { osId = (OS && OS.User && OS.User.onesignalId) || ""; } catch (e) {}
    const richiesta = {
      tipo: "cancellazione",
      codice: codice,
      id_partecipante: mem.get("id_partecipante") || "",
      onesignal_id: osId,
      richiesta_il: new Date().toISOString(),
    };
    // Le risposte non ancora inviate non partono più
    mem.set("coda", []);
    const ok = await inviaCancellazione(richiesta);
    if (OS) { try { await OS.User.PushSubscription.optOut(); } catch (e) {} }
    // Cancella tutto dal telefono; se l'invio non è riuscito conserva solo la richiesta
    mem.svuota();
    mem.set("revocato", { il: Date.now(), codice: richiesta.id_partecipante || codice, confermata: ok });
    if (!ok) mem.set("cancellazione_in_sospeso", richiesta);
    vai("revocato");
  }

  async function riprovaCancellazione() {
    const r = mem.get("cancellazione_in_sospeso");
    if (!r) return;
    if (await inviaCancellazione(r)) {
      mem.set("cancellazione_in_sospeso", null);
      try { localStorage.removeItem("cancellazione_in_sospeso"); } catch (e) {}
      const rev = mem.get("revocato");
      if (rev) { rev.confermata = true; mem.set("revocato", rev); }
      if (schermata === "revocato") render();
    }
  }

  function vRevocato() {
    const rev = mem.get("revocato") || {};
    app.innerHTML = `
      <section class="scheda centro">
        <div class="grande-icona" aria-hidden="true">✓</div>
        <h1>Consenso ritirato</h1>
        ${rev.confermata
          ? `<p>Le tue risposte sono state cancellate dall'archivio dello studio e dal telefono.
             Non riceverai altri promemoria.</p>`
          : `<p>Hai ritirato il consenso e i dati sono stati cancellati da questo telefono.
             Non siamo riusciti a contattare l'archivio dello studio: riproveremo appena c'è
             connessione, finché tieni l'app installata.</p>
             <p>Per sicurezza puoi anche scrivere a <b>${esc(CONFIG.EMAIL_STUDIO)}</b> indicando l'ID
             <b>${esc(rev.codice || "")}</b>.</p>`}
        <p>Grazie per il tempo che ci hai dedicato. Ora puoi disinstallare l'app.</p>
        <button class="link" id="ricomincia">Voglio partecipare di nuovo</button>
      </section>`;
    app.querySelector("#ricomincia").addEventListener("click", () => {
      if (mem.get("cancellazione_in_sospeso")) {
        app.querySelector("#ricomincia").insertAdjacentHTML("afterend",
          `<p class="errore">Attendi che la cancellazione sia completata (serve connessione) prima di ripartecipare.</p>`);
        return;
      }
      mem.svuota(); spunte = {}; consensoIl = null; vai("consenso");
    });
  }

  function campoDomanda(d) {
    const v = risposte[d.id];
    switch (d.tipo) {
      case "scala": {
        const n = d.max - d.min + 1;
        const colonne = n <= 7 ? n : Math.ceil(n / 2);
        let html = `<div class="scala" role="radiogroup" style="grid-template-columns:repeat(${colonne},1fr)">`;
        for (let i = d.min; i <= d.max; i++) {
          html += `<button type="button" class="tasto ${v === i ? "scelto" : ""}" data-v="${i}"
                    role="radio" aria-checked="${v === i}">${i}</button>`;
        }
        html += `</div>`;
        if (d.etichette) {
          html += `<div class="etichette"><span>${esc(d.etichette[0])}</span><span>${esc(d.etichette[1])}</span></div>`;
        }
        return html;
      }
      case "percentuale": {
        const min = d.min ?? 0, max = d.max ?? 100;
        const toccato = typeof v === "number";
        const et = d.etichette || ["Per nulla", "Moltissimo"];
        return `
          <div class="cursore ${toccato ? "" : "vuoto"}">
            <output id="valore" class="valore">${toccato ? v + "%" : "Tocca o trascina sulla barra"}</output>
            <input type="range" id="campo-range" min="${min}" max="${max}" step="1"
              value="${toccato ? v : Math.round((min + max) / 2)}"
              aria-label="${esc(d.testo)}" aria-valuetext="${toccato ? v + "%" : "nessuna risposta"}">
            <div class="etichette"><span>${min}% · ${esc(et[0])}</span><span>${max}% · ${esc(et[1])}</span></div>
          </div>`;
      }
      case "scelta":
        return `<div class="opzioni">${d.opzioni.map((o) =>
          `<button type="button" class="opzione ${v === o ? "scelto" : ""}" data-v="${esc(o)}">${esc(o)}</button>`
        ).join("")}</div>`;
      case "scelta_multipla": {
        const sel = Array.isArray(v) ? v : [];
        return `<div class="opzioni">${d.opzioni.map((o) =>
          `<button type="button" class="opzione multi ${sel.includes(o) ? "scelto" : ""}" data-v="${esc(o)}">${esc(o)}</button>`
        ).join("")}</div>`;
      }
      case "numero":
        return `<div class="numero"><input type="number" inputmode="decimal" id="campo"
          ${d.min != null ? `min="${d.min}"` : ""} ${d.max != null ? `max="${d.max}"` : ""}
          value="${v != null ? esc(v) : ""}">${d.unita ? `<span>${esc(d.unita)}</span>` : ""}</div>`;
      case "testo":
        return `<textarea id="campo" rows="4" placeholder="Scrivi qui…">${v != null ? esc(v) : ""}</textarea>`;
    }
    return "";
  }

  function rispostaValida(d) {
    const v = risposte[d.id];
    if (d.obbligatoria === false) return true;
    if (d.tipo === "scelta_multipla") return Array.isArray(v) && v.length > 0;
    if (d.tipo === "percentuale") return typeof v === "number";
    if (d.tipo === "numero") {
      if (v === "" || v == null || isNaN(Number(v))) return false;
      const n = Number(v);
      return (d.min == null || n >= d.min) && (d.max == null || n <= d.max);
    }
    return v !== undefined && v !== "";
  }

  function vQuestionario() {
    const d = DOMANDE[passo];
    const ultimo = passo === DOMANDE.length - 1;
    const perc = Math.round((passo / DOMANDE.length) * 100);
    app.innerHTML = `
      <div class="progresso" aria-label="Domanda ${passo + 1} di ${DOMANDE.length}">
        <div style="width:${perc}%"></div>
      </div>
      <p class="piccolo">Domanda ${passo + 1} di ${DOMANDE.length}</p>
      <section class="scheda">
        ${d.premessa ? `<p class="premessa">${esc(d.premessa)}</p>` : ""}
        <h2>${esc(d.testo)}</h2>
        ${campoDomanda(d)}
        <p class="errore" id="errore" hidden></p>
      </section>
      <div class="navigazione">
        <button class="btn" id="indietro">${passo === 0 ? "Annulla" : "Indietro"}</button>
        <button class="btn primario" id="avanti">${ultimo ? "Invia" : "Avanti"}</button>
      </div>`;

    app.querySelectorAll(".tasto").forEach((b) => b.addEventListener("click", () => {
      risposte[d.id] = Number(b.dataset.v); render();
    }));
    app.querySelectorAll(".opzione:not(.multi)").forEach((b) => b.addEventListener("click", () => {
      risposte[d.id] = b.dataset.v; render();
    }));
    app.querySelectorAll(".opzione.multi").forEach((b) => b.addEventListener("click", () => {
      const sel = Array.isArray(risposte[d.id]) ? risposte[d.id] : [];
      const v = b.dataset.v;
      risposte[d.id] = sel.includes(v) ? sel.filter((x) => x !== v) : sel.concat(v);
      b.classList.toggle("scelto");
    }));
    const range = app.querySelector("#campo-range");
    if (range) {
      const segna = () => {
        const n = Number(range.value);
        risposte[d.id] = n;
        range.closest(".cursore").classList.remove("vuoto");
        app.querySelector("#valore").textContent = n + "%";
        range.setAttribute("aria-valuetext", n + "%");
        app.querySelector("#errore").hidden = true;
      };
      ["input", "change", "click"].forEach((ev) => range.addEventListener(ev, segna));
    }
    const campo = app.querySelector("#campo");
    if (campo) campo.addEventListener("input", () => (risposte[d.id] = campo.value));

    app.querySelector("#indietro").addEventListener("click", () => {
      if (passo === 0) { schermata = "home"; } else { passo--; }
      render();
    });
    app.querySelector("#avanti").addEventListener("click", () => {
      if (!rispostaValida(d)) {
        const e = app.querySelector("#errore");
        e.textContent = d.tipo === "numero" && risposte[d.id] !== undefined && risposte[d.id] !== ""
          ? `Inserisci un numero${d.min != null ? " da " + d.min : ""}${d.max != null ? " a " + d.max : ""}.`
          : (d.tipo === "percentuale" ? "Sposta il cursore per rispondere." : "Rispondi per continuare.");
        e.hidden = false;
        return;
      }
      if (ultimo) { concludi(); } else { passo++; render(); }
    });
  }

  async function concludi() {
    const ora = Date.now();
    const record = {
      tipo: "risposta",
      id_partecipante: mem.get("id_partecipante") || "",
      codice: codicePartecipante(),
      iniziato_il: new Date(inizio || ora).toISOString(),
      inviato_il: new Date(ora).toISOString(),
      durata_secondi: Math.round((ora - (inizio || ora)) / 1000),
      da_notifica: daNotifica ? "si" : "no",
      sistema: sistema(),
    };
    DOMANDE.forEach((d) => {
      const v = risposte[d.id];
      record[d.id] = Array.isArray(v) ? v.join("; ") : (v ?? "");
    });
    accoda(record);
    risposte = {}; // non tenere le risposte in memoria oltre il necessario
    mem.set("ultima_compilazione", ora);
    mem.set("conteggio", mem.get("conteggio", 0) + 1);
    aggiornaTagCompilazione();
    daNotifica = false;
    vai("grazie");
    await inviaCoda();
  }

  function vGrazie() {
    app.innerHTML = `
      <section class="scheda centro">
        <div class="grande-icona" aria-hidden="true">✓</div>
        <h1>Grazie!</h1>
        <p>Le tue risposte sono state registrate.</p>
        <button class="btn primario" id="home">Torna alla home</button>
      </section>`;
    app.querySelector("#home").addEventListener("click", () => {
      try { history.replaceState(null, "", BASE_PATH); } catch (e) {}
      vai("home");
    });
  }

  // ---------- avvio ----------
  if (mem.get("consenso") && !mem.get("revocato")) caricaOneSignal();
  render();
  inviaCoda();
  riprovaCancellazione();
})();
