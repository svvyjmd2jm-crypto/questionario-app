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

  // ---------- lingua ----------
  let lingua = mem.get("lingua") || null;
  const L = () => (lingua && UI[lingua]) ? lingua : "it";
  // testo dell'interfaccia nella lingua scelta (le voci-funzione ricevono parametri)
  function t(chiave, ...args) {
    const v = (UI[L()] && UI[L()][chiave] !== undefined) ? UI[L()][chiave] : UI.it[chiave];
    return typeof v === "function" ? v(...args) : v;
  }
  // testo bilingue {it, en} (o testo semplice) nella lingua scelta
  const tx = (x) => (x && typeof x === "object") ? (x[L()] ?? x.it ?? "") : (x ?? "");
  // config.js con i valori eventualmente scritti come {it, en}
  function cfg() {
    const c = {};
    Object.keys(CONFIG).forEach((k) => {
      const v = CONFIG[k];
      c[k] = (v && typeof v === "object" && !Array.isArray(v) && ("it" in v || "en" in v)) ? tx(v) : v;
    });
    return c;
  }
  const testi = () => TESTI[L()] || TESTI.it;

  // ---------- dispositivo ----------
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isInstallata = window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;
  // Nuova icona: l'iPhone non aggiorna da solo l'icona di un'app già aggiunta alla Home.
  // Chi l'aveva installata prima (dati già presenti al primo avvio di questa versione) vede un avviso.
  // Quando si cambia icona basta aggiornare ICONA_ATTUALE: chi ha un'icona precedente vedrà di nuovo l'avviso.
  const ICONA_ATTUALE = "moodnow";
  if (!mem.get("icona")) mem.set("icona", (isIOS && isInstallata && mem.get("consenso")) ? "vecchia" : ICONA_ATTUALE);
  const mostraAvvisoIcona = () => isIOS && isInstallata && mem.get("icona") !== ICONA_ATTUALE
    && mem.get("icona_avviso_chiuso") !== ICONA_ATTUALE;
  const sistema = () => isIOS ? "iOS" : (/Android/i.test(navigator.userAgent) ? "Android" : "Altro");

  // ---------- OneSignal (notifiche) ----------
  // Privacy by default: il servizio di notifiche viene caricato SOLO dopo il consenso.
  let OS = null;
  let osCaricato = false;
  let osErrore = null; // motivo per cui le notifiche non si sono avviate
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
        impostaLinguaNotifiche();
        OneSignal.Notifications.addEventListener("permissionChange", () => render());
        render();
      } catch (e) {
        console.warn("OneSignal non inizializzato:", e);
        osErrore = (e && e.message) ? e.message : String(e);
        render();
      }
    });
    const s = document.createElement("script");
    s.src = "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js";
    s.defer = true;
    s.onerror = () => {
      osErrore = "§err_scaricare";
      render();
    };
    document.head.appendChild(s);
    setTimeout(() => {
      if (!OS && !osErrore) { osErrore = "§err_timeout"; render(); }
    }, 20000);
  }

  // le notifiche arrivano nella lingua scelta nell'app
  function impostaLinguaNotifiche() {
    try { if (OS && OS.User && OS.User.setLanguage) OS.User.setLanguage(L()); } catch (e) {}
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
    return new Date(ms).toLocaleString(({ it: "it-IT", en: "en-GB", el: "el-GR" })[L()] || "it-IT", {
      weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit",
    });
  }

  // ---------- stato ----------
  let schermata = mem.get("revocato") ? "revocato"
    : !lingua ? "lingua"
    : !mem.get("consenso") ? "consenso"
    : !mem.get("id_partecipante") ? "id"
    : "home";
  let indietroDa = "consenso"; // dove torna l'informativa
  let dopoLingua = null;       // dove tornare dopo aver cambiato lingua
  let passo = 0;
  let risposte = {};
  let inizio = null;          // quando è iniziata la compilazione
  let daNotifica = false;     // aperta toccando un promemoria?
  let spunte = {};            // caselle del consenso spuntate
  let consensoIl = null;      // momento in cui sono state spuntate le caselle
  let notificaInviata = null; // quando è partita la notifica che ha aperto l'app
  let tempi = {};             // millisecondi passati su ogni domanda
  let dettagli = {};          // per ogni domanda: comparsa, primo tocco, valori, risposta definitiva
  let ultimoPassoMostrato = -1; // per contare quante volte si torna su una domanda
  const VERSIONE_APP = "18";
  let movimenti = [];         // ogni singolo evento sullo slider (tocco, spostamento, rilascio, conferma)
  let tDomanda = null;        // quando è comparsa la domanda corrente

  // Cronometro per domanda: somma il tempo passato sulla domanda corrente
  function fermaCronometro() {
    if (tDomanda !== null && DOMANDE[passo]) {
      const id = DOMANDE[passo].id;
      tempi[id] = (tempi[id] || 0) + (performance.now() - tDomanda);
    }
    tDomanda = performance.now();
  }
  function iniziaQuestionario() {
    passo = 0; risposte = {}; tempi = {}; dettagli = {}; ultimoPassoMostrato = -1; movimenti = [];
    inizio = Date.now(); tDomanda = performance.now();
  }

  const qp = new URLSearchParams(location.search);
  let aperturaDaNotifica = false;
  if (qp.get("da") === "notifica" && schermata === "home") { // (solo se l'ID c'è già)
    aperturaDaNotifica = true;
    const t = Number(qp.get("t"));
    notificaInviata = t > 0 ? t : null;
  }
  // la notifica toccata sblocca il questionario della sua fascia
  const tNotificaUrl = Number(qp.get("t"));

  // ---------- fasce orarie (ora italiana) ----------
  // Ritorna data e minuti di adesso nel fuso Europe/Rome, qualunque sia il fuso del telefono
  function adessoRoma(ms) {
    const parti = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Rome", year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", hourCycle: "h23",
    }).formatToParts(new Date(ms || Date.now()));
    const g = (t) => parti.find((x) => x.type === t).value;
    return { data: `${g("year")}-${g("month")}-${g("day")}`, minuti: Number(g("hour")) * 60 + Number(g("minute")) };
  }
  // "2026-10-22 14:43:05.123" in ora italiana (più leggibile nel foglio)
  function oraRoma(ms) {
    if (!ms) return "";
    const parti = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Rome", year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
    }).formatToParts(new Date(ms));
    const g = (t) => parti.find((x) => x.type === t).value;
    return `${g("year")}-${g("month")}-${g("day")} ${g("hour")}:${g("minute")}:${g("second")}.${String(ms % 1000).padStart(3, "0")}`;
  }
  const inMinuti = (hhmm) => { const [h, m] = String(hhmm).split(":"); return Number(h) * 60 + Number(m || 0); };
  const FASCE = (CONFIG.FASCE_ORARIE || []).map((f, i) => ({
    numero: i + 1, da: f[0], a: f[1], etichetta: f[0] + "-" + f[1], inizio: inMinuti(f[0]), fine: inMinuti(f[1]),
  }));
  // Fascia in corso adesso (o null)
  function fasciaCorrente(ms) {
    const r = adessoRoma(ms);
    const f = FASCE.find((x) => r.minuti >= x.inizio && r.minuti < x.fine);
    return f ? Object.assign({ data: r.data }, f) : null;
  }
  function prossimaFascia() {
    const r = adessoRoma();
    return FASCE.find((x) => x.inizio > r.minuti) || FASCE[0] || null;
  }
  const chiaveFascia = (f) => f.data + "|" + f.etichetta;

  // ---------- notifiche già partite ----------
  // Servono solo per registrare nel foglio a che ora è partita la notifica della fascia,
  // anche quando la persona apre l'app dall'icona. NON bloccano la compilazione.
  // Vengono da: notifica toccata (parametro t), oppure dallo script Google,
  // che comunica solo quelle già partite oggi (mai quelle future).
  function notificheNote() { return mem.get("notifiche_note", {}); }
  function annotaNotifica(ms) {
    const f = fasciaCorrente(ms);
    if (!f) return;
    const n = notificheNote();
    const k = chiaveFascia(f);
    if (!n[k] || ms > n[k]) n[k] = ms;          // vale l'ultima notifica della fascia
    // tiene solo gli ultimi giorni
    const chiavi = Object.keys(n).sort().slice(-40);
    const pulite = {}; chiavi.forEach((c) => { pulite[c] = n[c]; });
    mem.set("notifiche_note", pulite);
  }
  const notificaDellaFascia = (f) => (f ? notificheNote()[chiaveFascia(f)] || null : null);

  let ultimoControllo = 0;
  async function controllaNotificheServer(forza) {
    if (!CONFIG.URL_APPS_SCRIPT || !FASCE.length) return;
    const f = fasciaCorrente();
    if (!f || (!forza && notificaDellaFascia(f))) return;
    if (!forza && Date.now() - ultimoControllo < 45000) return;
    ultimoControllo = Date.now();
    try {
      const r = await fetch(CONFIG.URL_APPS_SCRIPT + "?azione=notifiche", { cache: "no-store" });
      const j = await r.json();
      let nuove = false;
      (j.inviate || []).forEach((x) => {
        const ms = Number(x.inviata_il);
        if (ms > 0 && ms <= Date.now() + 60000) {
          const prima = notificaDellaFascia(fasciaCorrente(ms));
          annotaNotifica(ms);
          if (prima !== notificaDellaFascia(fasciaCorrente(ms))) nuove = true;
        }
      });
      if (nuove && schermata === "home") render();
    } catch (e) { /* offline: si riprova più tardi */ }
  }

  // compilazioni fatte: al massimo una per fascia
  function fasciaGiaCompilata(f) {
    return !!f && mem.get("fasce_compilate", []).includes(chiaveFascia(f));
  }
  function segnaFasciaCompilata(f) {
    const l = mem.get("fasce_compilate", []).concat(chiaveFascia(f));
    mem.set("fasce_compilate", l.slice(-80));
  }
  // Si può compilare adesso? Bloccato SOLO fuori fascia o se in questa fascia si è già compilato.
  function statoCompilazione() {
    if (!FASCE.length) return { ok: true, fascia: null };
    const f = fasciaCorrente();
    if (!f) return { ok: false, motivo: "fuori", prossima: prossimaFascia() };
    if (fasciaGiaCompilata(f)) return { ok: false, motivo: "fatta", fascia: f, prossima: prossimaFascia() };
    return { ok: true, fascia: f, notifica: notificaDellaFascia(f) };
  }
  let fasciaQuestionario = null; // fascia in cui è iniziata la compilazione in corso

  // ---------- schermate ----------
  const SCHERMATE = {
    consenso: vConsenso, informativa: vInformativa, home: vHome, questionario: vQuestionario,
    grazie: vGrazie, privacy: vPrivacy, conferma: vConferma, revocato: vRevocato, id: vId,
    lingua: vLingua,
  };
  function vai(s) { schermata = s; render(); }
  function render() {
    document.documentElement.lang = L();
    document.getElementById("nome-app").textContent = t("nome_app");
    document.title = t("nome_app");
    const piede = document.querySelector(".copyright");
    if (piede) piede.innerHTML = `<span>${t("copyright_1")}</span><span>${t("copyright_2")}</span>`;
    // pulsante lingua in alto: nascosto durante il questionario e nella scelta lingua
    const bl = document.getElementById("cambia-lingua");
    if (bl) {
      bl.hidden = !lingua || schermata === "questionario" || schermata === "lingua";
      bl.textContent = "🌐 " + L().toUpperCase();
      bl.setAttribute("aria-label", t("cambia_lingua"));
    }
    SCHERMATE[schermata]();
    window.scrollTo(0, 0);
  }

  function scegliLingua(codice) {
    lingua = codice;
    mem.set("lingua", codice);
    impostaLinguaNotifiche();
  }

  function vLingua() {
    app.innerHTML = `
      <section class="scheda centro">
        <h1>Scegli la lingua<br><span class="sottotitolo-lingua">Choose your language · Επίλεξε γλώσσα</span></h1>
        <div class="scelta-lingua">
          ${LINGUE_DISPONIBILI.map((l) => `
            <button class="btn ${lingua === l.codice ? "primario" : "secondario"} grande" data-lingua="${l.codice}">${l.nome}</button>`).join("")}
        </div>
      </section>`;
    app.querySelectorAll("[data-lingua]").forEach((b) => b.addEventListener("click", () => {
      scegliLingua(b.dataset.lingua);
      const dest = dopoLingua || (mem.get("consenso") ? (mem.get("id_partecipante") ? "home" : "id") : "consenso");
      dopoLingua = null;
      vai(dest);
    }));
  }

  function vConsenso() {
    const tutte = testi().CONSENSI.every((c) => spunte[c.id]);
    app.innerHTML = `
      <section class="scheda">
        <h1>${t("benvenuto")}</h1>
        <p class="crediti">${t("crediti")}</p>
        <div class="informativa">${testi().PRESENTAZIONE(cfg())}</div>
        <button class="link" id="leggi">${t("leggi_informativa")}</button>
      </section>
      <section class="scheda">
        <h2>${t("consenso_titolo")}</h2>
        <div class="consensi">
          ${testi().CONSENSI.map((c) => `
            <label class="spunta">
              <input type="checkbox" id="c-${esc(c.id)}" data-id="${esc(c.id)}" ${spunte[c.id] ? "checked" : ""}>
              <span>${esc(c.testo)}</span>
            </label>`).join("")}
        </div>
        <button class="btn primario" id="avanti" ${tutte ? "" : "disabled"}>${t("acconsento")}</button>
        <p class="piccolo">${t("consenso_nota")}</p>
      </section>`;
    app.querySelector("#leggi").addEventListener("click", () => { indietroDa = "consenso"; vai("informativa"); });
    const btn = app.querySelector("#avanti");
    app.querySelectorAll(".consensi input").forEach((i) => i.addEventListener("change", () => {
      spunte[i.dataset.id] = i.checked;
      btn.disabled = !testi().CONSENSI.every((c) => spunte[c.id]);
    }));
    btn.addEventListener("click", () => { consensoIl = Date.now(); vai("id"); });
  }

  // ---------- ID partecipante (es. TONO740) ----------
  // lettere greche -> lettere latine (una per una), così l'ID resta sempre A-Z
  const GRECO = { "Α":"A","Β":"V","Γ":"G","Δ":"D","Ε":"E","Ζ":"Z","Η":"I","Θ":"T","Ι":"I","Κ":"K","Λ":"L","Μ":"M",
    "Ν":"N","Ξ":"X","Ο":"O","Π":"P","Ρ":"R","Σ":"S","Τ":"T","Υ":"Y","Φ":"F","Χ":"H","Ψ":"P","Ω":"O" };
  const soloLettere = (t) => String(t || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toUpperCase().replace(/[Α-Ω]/g, (c) => GRECO[c] || "").replace(/[^A-Z]/g, "");
  const soloCifre = (t) => String(t || "").replace(/\D/g, "");

  function vId() {
    const nCifre = CONFIG.ID_CIFRE_TELEFONO || 3;
    const primoAccesso = !mem.get("consenso");
    app.innerHTML = `
      <section class="scheda">
        <h1>${t("id_titolo")}</h1>
        <p>${t("id_spiegazione")}</p>
        <div class="campi-id">
          <label for="id-nome"><span>${t("id_nome")}</span>
            <input id="id-nome" maxlength="2" autocapitalize="characters" autocomplete="off" spellcheck="false" placeholder="${t("id_es_nome")}">
          </label>
          <label for="id-cognome"><span>${t("id_cognome")}</span>
            <input id="id-cognome" maxlength="2" autocapitalize="characters" autocomplete="off" spellcheck="false" placeholder="${t("id_es_cognome")}">
          </label>
          <label for="id-tel"><span>${t("id_tel", nCifre)}</span>
            <input id="id-tel" maxlength="${nCifre}" inputmode="numeric" autocomplete="off" placeholder="${"0".repeat(nCifre)}">
          </label>
        </div>
        <p class="anteprima-id">${t("il_tuo_id")}: <output id="id-anteprima">—</output></p>
        <p class="piccolo">${t("id_esempio")}</p>
        <p class="errore" id="errore" hidden></p>
        <div class="navigazione">
          ${primoAccesso ? `<button class="btn" id="indietro">${t("indietro")}</button>` : ""}
          <button class="btn primario" id="salva" disabled>${t("conferma")}</button>
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
          lingua_consenso: L(),
          versione_informativa: CONFIG.VERSIONE_INFORMATIVA,
          consensi_espressi: testi().CONSENSI.map((c) => c.id).join("; "),
        });
        inviaCoda();
      }
      caricaOneSignal();
      vai("home");
    });
    nome.focus();
  }

  function avviaQuestionario(dallaNotifica) {
    const st = statoCompilazione();
    if (!st.ok) { vai("home"); return; }
    fasciaQuestionario = st.fascia;
    iniziaQuestionario();
    daNotifica = !!dallaNotifica;
    // orario della notifica che ha sbloccato questa compilazione (anche se aperta dall'icona)
    notificaInviata = st.notifica || notificaInviata || null;
    vai("questionario");
  }

  function vInformativa() {
    app.innerHTML = `
      <section class="scheda testo-lungo">
        <h1>${t("informativa_titolo")}</h1>
        <p class="piccolo">${t("informativa_sotto")}</p>
        ${testi().INFORMATIVA(cfg())}
      </section>
      <button class="btn primario larga" id="chiudi">${t("torna_indietro")}</button>`;
    app.querySelector("#chiudi").addEventListener("click", () => vai(indietroDa));
  }

  function bloccoNotifiche() {
    if (!CONFIG.ONESIGNAL_APP_ID) {
      return `<div class="avviso">${t("notifiche_non_config")}</div>`;
    }
    if (isIOS && !isInstallata) {
      return `
        <div class="avviso">
          <b>${t("ios_titolo")}</b>, ${t("ios_testo")}
          <ol>
            <li>${t("ios_1")}</li>
            <li>${t("ios_2")}</li>
            <li>${t("ios_3")}</li>
          </ol>
        </div>`;
    }
    if (osErrore) {
      return `
        <div class="avviso">
          <p><b>${t("notifiche_errore")}</b></p>
          <p class="piccolo">${t("motivo")}: ${esc(osErrore.charAt(0) === "§" ? t(osErrore.slice(1)) : osErrore)}</p>
          <button class="btn secondario" id="riprova">${t("riprova")}</button>
        </div>`;
    }
    if (!OS) return `<div class="avviso tenue">${t("caricamento_notifiche")}</div>`;
    if (notificheAttive()) {
      return `<div class="ok-box">${t("promemoria_attivi")}</div>`;
    }
    if (typeof Notification !== "undefined" && Notification.permission === "denied") {
      return `<div class="avviso">${t("notifiche_bloccate")}</div>`;
    }
    return `
      <div class="avviso">
        <p>${t("attiva_testo")}</p>
        <button class="btn secondario" id="notifiche">${t("attiva_promemoria")}</button>
      </div>`;
  }

  function bloccoCompilazione(st) {
    if (st.ok) return `<button class="btn primario grande" id="inizia">${t("compila")}</button>`;
    if (st.motivo === "fatta") {
      return `<div class="ok-box"><b>${t("grazie")}</b> ${t("gia_compilato")}</div>`;
    }
    return `<div class="ok-box"><b>${t("grazie")}</b> ${t("aspetta_notifica")}</div>`;
  }

  function vHome() {
    const ultima = mem.get("ultima_compilazione");
    const n = mem.get("conteggio", 0);
    const inCoda = mem.get("coda", []).filter((r) => r.tipo === "risposta").length;
    const st = statoCompilazione();
    app.innerHTML = `
      <section class="scheda">
        <h1>${t("ciao")}</h1>
        <p>${ultima
          ? `${t("ultima_compilazione")}: <b>${esc(formattaData(ultima))}</b><br>${t("compilazioni_totali")}: <b>${n}</b>`
          : t("mai_compilato")}</p>
        ${bloccoCompilazione(st)}
        ${inCoda ? `<p class="piccolo">${t("in_attesa", inCoda)}</p>` : ""}
      </section>
      ${mostraAvvisoIcona() ? `
      <section class="scheda avviso-icona">
        <div class="avviso-icona-testa"><img src="icons/moodnow-180.png" alt="" width="52" height="52"><h2>${t("icona_titolo")}</h2></div>
        <p>${t("icona_testo")}</p>
        <ol>${t("icona_passi").map((x) => `<li>${esc(x)}</li>`).join("")}</ol>
        <p class="piccolo">${t("icona_nota")}</p>
        <button class="btn secondario" id="icona-ok">${t("icona_ok")}</button>
      </section>` : ""}
      ${bloccoNotifiche()}
      <div class="piede">
        <span>${t("il_tuo_id")}: <b>${esc(mem.get("id_partecipante") || "")}</b></span>
        <button class="link" id="privacy">${t("privacy_dati")}</button>
      </div>`;
    const bi = app.querySelector("#inizia");
    if (bi) bi.addEventListener("click", () => avviaQuestionario(false));
    const bn = app.querySelector("#notifiche");
    if (bn) bn.addEventListener("click", attivaNotifiche);
    const br = app.querySelector("#riprova");
    if (br) br.addEventListener("click", () => location.reload());
    const bo = app.querySelector("#icona-ok");
    if (bo) bo.addEventListener("click", () => { mem.set("icona_avviso_chiuso", ICONA_ATTUALE); vHome(); });
    app.querySelector("#privacy").addEventListener("click", () => vai("privacy"));
  }

  function vPrivacy() {
    const cons = mem.get("consenso") || {};
    app.innerHTML = `
      <section class="scheda">
        <h1>${t("privacy_dati")}</h1>
        <dl class="dati">
          <dt>${t("tuo_id_partecipante")}</dt><dd><b>${esc(mem.get("id_partecipante") || "—")}</b></dd>
          <dt>${t("codice_dispositivo")}</dt><dd>${esc(codicePartecipante())}</dd>
          <dt>${t("consenso_dato")}</dt><dd>${cons.il ? esc(new Date(cons.il).toLocaleString(({ it: "it-IT", en: "en-GB", el: "el-GR" })[L()] || "it-IT", { dateStyle: "short", timeStyle: "short" })) : "—"}</dd>
          <dt>${t("versione_informativa")}</dt><dd>${esc(cons.versione || "—")}</dd>
          <dt>${t("lingua")}</dt><dd>${esc((LINGUE_DISPONIBILI.find((x) => x.codice === L()) || {}).nome || "")}</dd>
        </dl>
        <p class="piccolo">${t("diritti", esc(cfg().EMAIL_STUDIO))}</p>
        <button class="link" id="leggi">${t("leggi_informativa")}</button>
      </section>

      ${notificheAttive() ? `
      <section class="scheda">
        <h2>${t("promemoria")}</h2>
        <p>${t("stop_testo")}</p>
        <button class="btn" id="stop-notifiche">${t("disattiva_promemoria")}</button>
      </section>` : ""}

      <section class="scheda pericolo">
        <h2>${t("ritira_titolo")}</h2>
        <p>${t("ritira_testo")}</p>
        <button class="btn rosso" id="revoca">${t("ritira_btn")}</button>
      </section>

      <button class="btn larga" id="home">${t("torna_home")}</button>`;
    app.querySelector("#leggi").addEventListener("click", () => { indietroDa = "privacy"; vai("informativa"); });
    const sn = app.querySelector("#stop-notifiche");
    if (sn) sn.addEventListener("click", disattivaNotifiche);
    app.querySelector("#revoca").addEventListener("click", () => vai("conferma"));
    app.querySelector("#home").addEventListener("click", () => vai("home"));
  }

  function vConferma() {
    app.innerHTML = `
      <section class="scheda pericolo">
        <h1>${t("sei_sicuro")}</h1>
        <p>${t("sicuro_testo", esc(mem.get("id_partecipante") || codicePartecipante()))}</p>
        <div class="navigazione">
          <button class="btn" id="annulla">${t("annulla")}</button>
          <button class="btn rosso" id="conferma">${t("si_cancella")}</button>
        </div>
      </section>`;
    app.querySelector("#annulla").addEventListener("click", () => vai("privacy"));
    app.querySelector("#conferma").addEventListener("click", revoca);
  }

  async function revoca() {
    const btn = app.querySelector("#conferma");
    btn.disabled = true;
    btn.textContent = t("cancellazione");
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
    mem.set("lingua", L());
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
        <h1>${t("revocato_titolo")}</h1>
        ${rev.confermata
          ? `<p>${t("revocato_ok")}</p>`
          : `<p>${t("revocato_ko")}</p>
             <p>${t("revocato_email", esc(cfg().EMAIL_STUDIO), esc(rev.codice || ""))}</p>`}
        <p>${t("revocato_fine")}</p>
        <button class="link" id="ricomincia">${t("partecipa_ancora")}</button>
      </section>`;
    app.querySelector("#ricomincia").addEventListener("click", () => {
      if (mem.get("cancellazione_in_sospeso")) {
        app.querySelector("#ricomincia").insertAdjacentHTML("afterend",
          `<p class="errore">${t("attendi_cancellazione")}</p>`);
        return;
      }
      mem.svuota(); mem.set("lingua", L()); spunte = {}; consensoIl = null; vai("consenso");
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
        // Scala visuo-analogica: solo 0 e 100 agli estremi, il valore scelto non si vede
        void et;
        return `
          <div class="cursore ${toccato ? "" : "vuoto"}">
            <p id="valore" class="istruzione">${toccato ? "" : t("tocca_barra")}</p>
            <div class="riga-vas">
              <span class="ancora" aria-hidden="true">${min}</span>
              <input type="range" id="campo-range" min="${min}" max="${max}" step="1"
                value="${toccato ? v : partenzaSlider(d)}"
                aria-label="${esc(tx(d.testo))}" aria-valuetext="${toccato ? t("posizione_scelta") : t("nessuna_risposta")}">
              <span class="ancora" aria-hidden="true">${max}</span>
            </div>
          </div>`;
      }
      case "scelta":
        return `<div class="opzioni">${d.opzioni.map((o) =>
          `<button type="button" class="opzione ${v === codiceOpzione(o) ? "scelto" : ""}" data-v="${esc(codiceOpzione(o))}">${esc(etichettaOpzione(o))}</button>`
        ).join("")}</div>`;
      case "scelta_multipla": {
        const sel = Array.isArray(v) ? v : [];
        return `<div class="opzioni">${d.opzioni.map((o) =>
          `<button type="button" class="opzione multi ${sel.includes(codiceOpzione(o)) ? "scelto" : ""}" data-v="${esc(codiceOpzione(o))}">${esc(etichettaOpzione(o))}</button>`
        ).join("")}</div>`;
      }
      case "numero":
        return `<div class="numero"><input type="number" inputmode="decimal" id="campo"
          ${d.min != null ? `min="${d.min}"` : ""} ${d.max != null ? `max="${d.max}"` : ""}
          value="${v != null ? esc(v) : ""}">${d.unita ? `<span>${esc(d.unita)}</span>` : ""}</div>`;
      case "testo":
        return `<textarea id="campo" rows="4" placeholder="${t("scrivi_qui")}">${v != null ? esc(v) : ""}</textarea>`;
    }
    return "";
  }

  // opzioni: {codice, it, en} oppure testo semplice
  const codiceOpzione = (o) => (o && typeof o === "object") ? o.codice : o;
  const etichettaOpzione = (o) => (o && typeof o === "object") ? tx(o) : o;
  const etichettaItaliana = (d, codice) => {
    const o = (d.opzioni || []).find((x) => codiceOpzione(x) === codice);
    return o ? ((typeof o === "object") ? (o.it ?? "") : o) : "";
  };

  // posizione (invisibile) da cui parte il cursore
  const partenzaSlider = (d) => Math.round(((d.min ?? 0) + (d.max ?? 100)) / 2);

  // registra un evento dello slider (una riga nella linguetta "Movimenti slider")
  function annotaMovimento(d, evento, valore) {
    const x = dettagli[d.id];
    if (!x || movimenti.length >= 4000) return;
    const t = Date.now();
    movimenti.push({
      numero_domanda: DOMANDE.indexOf(d) + 1,
      domanda: d.id,
      evento: evento,
      ora: oraRoma(t),
      secondi_dalla_comparsa: Math.round((t - x.comparsa) / 10) / 100,
      secondi_dal_primo_tocco: x.primoTocco ? Math.round((t - x.primoTocco) / 10) / 100 : "",
      valore: valore === null || valore === undefined ? "" : valore,
    });
  }

  // registra il primo tocco e ogni modifica di una risposta
  function annotaTocco(d, valore, conta) {
    const x = dettagli[d.id];
    if (!x) return;
    if (!x.primoTocco) { x.primoTocco = Date.now(); x.valoreIniziale = valore; }
    if (conta) {
      x.modifiche += 1;
      // traccia di ogni modifica: secondi dalla comparsa della domanda e valore scelto
      if (x.traccia.length < 100) x.traccia.push(((Date.now() - x.comparsa) / 1000).toFixed(1) + "s=" + valore);
    }
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
    if (!dettagli[d.id]) {
      dettagli[d.id] = {
        comparsa: Date.now(), primoTocco: null, risposta: null, modifiche: 0, visite: 0, traccia: [],
        tocchi: 0, msTrascinamento: 0, giu: null, ultimoValore: null,
        valorePartenza: d.tipo === "percentuale" ? partenzaSlider(d) : "", valoreIniziale: "",
      };
    }
    if (ultimoPassoMostrato !== passo) { dettagli[d.id].visite += 1; ultimoPassoMostrato = passo; }
    const ultimo = passo === DOMANDE.length - 1;
    const perc = Math.round((passo / DOMANDE.length) * 100);
    app.innerHTML = `
      <div class="progresso" aria-label="${t("domanda_n", passo + 1, DOMANDE.length)}">
        <div style="width:${perc}%"></div>
      </div>
      <p class="piccolo">${t("domanda_n", passo + 1, DOMANDE.length)}</p>
      <section class="scheda">
        ${tx(d.premessa) ? `<p class="premessa">${esc(tx(d.premessa))}</p>` : ""}
        <h2>${esc(tx(d.testo))}</h2>
        ${campoDomanda(d)}
        <p class="errore" id="errore" hidden></p>
      </section>
      <div class="navigazione">
        <button class="btn" id="indietro">${passo === 0 ? t("annulla") : t("indietro")}</button>
        <button class="btn primario" id="avanti">${ultimo ? t("invia") : t("avanti")}</button>
      </div>`;

    app.querySelectorAll(".tasto").forEach((b) => b.addEventListener("click", () => {
      risposte[d.id] = Number(b.dataset.v); annotaTocco(d, risposte[d.id], true); render();
    }));
    app.querySelectorAll(".opzione:not(.multi)").forEach((b) => b.addEventListener("click", () => {
      const o = d.opzioni.find((x) => String(codiceOpzione(x)) === b.dataset.v);
      risposte[d.id] = o !== undefined ? codiceOpzione(o) : b.dataset.v;
      annotaTocco(d, risposte[d.id], true); render();
    }));
    app.querySelectorAll(".opzione.multi").forEach((b) => b.addEventListener("click", () => {
      const sel = Array.isArray(risposte[d.id]) ? risposte[d.id] : [];
      const o = d.opzioni.find((x) => String(codiceOpzione(x)) === b.dataset.v);
      const v = o !== undefined ? codiceOpzione(o) : b.dataset.v;
      risposte[d.id] = sel.includes(v) ? sel.filter((x) => x !== v) : sel.concat(v);
      annotaTocco(d, risposte[d.id].join("; "), true);
      b.classList.toggle("scelto");
    }));
    const range = app.querySelector("#campo-range");
    if (range) {
      const segna = (ev) => {
        const n = Number(range.value);
        risposte[d.id] = n;
        // primo tocco: valore iniziale; ogni rilascio del dito conta come una modifica
        annotaTocco(d, n, ev && ev.type === "change");
        range.closest(".cursore").classList.remove("vuoto");
        app.querySelector("#valore").textContent = "";
        range.setAttribute("aria-valuetext", t("posizione_scelta"));
        app.querySelector("#errore").hidden = true;
      };
      ["input", "change", "click"].forEach((ev) => range.addEventListener(ev, segna));
      // percorso completo del dito: tocco -> ogni valore attraversato -> rilascio
      const x = dettagli[d.id];
      range.addEventListener("pointerdown", () => {
        x.tocchi += 1; x.giu = Date.now();
        annotaMovimento(d, "tocco", "");
      });
      range.addEventListener("input", () => {
        const n = Number(range.value);
        if (n !== x.ultimoValore) { x.ultimoValore = n; annotaMovimento(d, "spostamento", n); }
      });
      const rilascio = () => {
        if (x.giu === null) return;
        x.msTrascinamento += Date.now() - x.giu; x.giu = null;
        annotaMovimento(d, "rilascio", risposte[d.id] ?? "");
      };
      range.addEventListener("pointerup", rilascio);
      range.addEventListener("pointercancel", rilascio);
    }
    const campo = app.querySelector("#campo");
    if (campo) campo.addEventListener("input", () => (risposte[d.id] = campo.value));

    app.querySelector("#indietro").addEventListener("click", () => {
      if (passo === 0) { tDomanda = null; schermata = "home"; } else { fermaCronometro(); passo--; }
      render();
    });
    app.querySelector("#avanti").addEventListener("click", () => {
      if (!rispostaValida(d)) {
        const e = app.querySelector("#errore");
        e.textContent = d.tipo === "numero" && risposte[d.id] !== undefined && risposte[d.id] !== ""
          ? t("err_numero", d.min, d.max)
          : (d.tipo === "percentuale" ? t("err_cursore") : t("err_rispondi"));
        e.hidden = false;
        return;
      }
      fermaCronometro();
      dettagli[d.id].risposta = Date.now(); // risposta definitiva (ultimo "Avanti")
      if (d.tipo === "percentuale") annotaMovimento(d, "conferma", risposte[d.id]);
      if (ultimo) { concludi(); } else { passo++; render(); }
    });
  }

  async function concludi() {
    const ora = Date.now();
    const sec = (ms) => Math.round(ms / 100) / 10; // secondi con un decimale
    // L'ordine dei campi è l'ordine delle colonne nel foglio: l'ID per primo
    const record = {
      tipo: "risposta",
      id_partecipante: mem.get("id_partecipante") || "",
      codice: codicePartecipante(),
      da_notifica: daNotifica ? "si" : "no",
      notifica_inviata_il: oraRoma(notificaInviata),
      id_notifica: notificaInviata || "",
      latenza_dalla_notifica_secondi: notificaInviata ? Math.max(0, Math.round(((inizio || ora) - notificaInviata) / 1000)) : "",
      aperto_dalla_notifica_il: daNotifica ? oraRoma(inizio || ora) : "",
      iniziato_il: oraRoma(inizio || ora),
      inviato_il: oraRoma(ora),
      durata_totale_secondi: sec(ora - (inizio || ora)),
      data_fascia: fasciaQuestionario ? fasciaQuestionario.data : adessoRoma(inizio || ora).data,
      fascia: fasciaQuestionario ? fasciaQuestionario.etichetta : "",
      numero_fascia: fasciaQuestionario ? fasciaQuestionario.numero : "",
      sistema: sistema(),
      fuso_orario_telefono: (Intl.DateTimeFormat().resolvedOptions().timeZone || ""),
      lingua: L(),
      versione_app: VERSIONE_APP,
    };
    DOMANDE.forEach((d) => {
      const v = risposte[d.id];
      record[d.id] = Array.isArray(v) ? v.join("; ") : (v ?? "");
      // per le domande a scelta: anche l'etichetta (in italiano, uguale per tutte le lingue)
      if (d.tipo === "scelta") record[d.id + "_etichetta"] = etichettaItaliana(d, v);
      if (d.tipo === "scelta_multipla") record[d.id + "_etichetta"] = (Array.isArray(v) ? v : []).map((c) => etichettaItaliana(d, c)).join("; ");
    });
    // tempo di risposta di ogni singola domanda (secondi)
    DOMANDE.forEach((d) => { record["tempo_" + d.id] = sec(tempi[d.id] || 0); });
    // dettaglio di ogni domanda: una riga per domanda nella linguetta "Dettaglio risposte"
    record.dettaglio = DOMANDE.map((d, i) => {
      const x = dettagli[d.id] || {};
      const v = risposte[d.id];
      return {
        numero_domanda: i + 1,
        domanda: d.id,
        comparsa_il: oraRoma(x.comparsa),
        primo_tocco_il: oraRoma(x.primoTocco),
        risposta_definitiva_il: oraRoma(x.risposta),
        valore_partenza: x.valorePartenza ?? "",
        valore_iniziale: x.valoreIniziale ?? "",
        valore_finale: Array.isArray(v) ? v.join("; ") : (v ?? ""),
        numero_modifiche: x.modifiche || 0,
        traccia_modifiche: (x.traccia || []).join(" | "),
        visite_alla_domanda: x.visite || 0,
        numero_tocchi_barra: x.tocchi || 0,
        tempo_dito_sulla_barra_secondi: x.msTrascinamento ? sec(x.msTrascinamento) : (d.tipo === "percentuale" ? 0 : ""),
        da_comparsa_a_primo_tocco_secondi: x.primoTocco ? sec(x.primoTocco - x.comparsa) : "",
        da_primo_tocco_a_risposta_secondi: x.primoTocco && x.risposta ? sec(x.risposta - x.primoTocco) : "",
        durata_totale_domanda_secondi: sec(tempi[d.id] || 0),
      };
    });
    record.movimenti = movimenti.slice();
    accoda(record);
    if (fasciaQuestionario) segnaFasciaCompilata(fasciaQuestionario);
    fasciaQuestionario = null;
    risposte = {}; // non tenere le risposte in memoria oltre il necessario
    mem.set("ultima_compilazione", ora);
    mem.set("conteggio", mem.get("conteggio", 0) + 1);
    aggiornaTagCompilazione();
    daNotifica = false; notificaInviata = null; tempi = {}; dettagli = {}; movimenti = []; tDomanda = null;
    vai("grazie");
    await inviaCoda();
  }

  function vGrazie() {
    app.innerHTML = `
      <section class="scheda centro">
        <div class="grande-icona" aria-hidden="true">✓</div>
        <h1>${t("grazie")}</h1>
        <p>${t("risposte_registrate")}</p>
        <button class="btn primario" id="home">${t("torna_home")}</button>
      </section>`;
    app.querySelector("#home").addEventListener("click", () => {
      try { history.replaceState(null, "", BASE_PATH); } catch (e) {}
      vai("home");
    });
  }

  // ---------- pulsante lingua in alto ----------
  const btnLingua = document.getElementById("cambia-lingua");
  if (btnLingua) btnLingua.addEventListener("click", () => {
    if (schermata === "questionario") return;
    dopoLingua = schermata === "lingua" ? null : schermata;
    vai("lingua");
  });

  // ---------- avvio ----------
  if (mem.get("consenso") && !mem.get("revocato")) caricaOneSignal();
  if (tNotificaUrl > 0) annotaNotifica(tNotificaUrl);
  if (aperturaDaNotifica) avviaQuestionario(true); else render();
  controllaNotificheServer(true);
  // la home si aggiorna da sola: fasce che iniziano/finiscono e notifiche appena partite
  setInterval(() => {
    if (schermata === "home") { render(); controllaNotificheServer(false); }
  }, 30000);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && schermata === "home") { controllaNotificheServer(true); render(); }
  });
  inviaCoda();
  riprovaCancellazione();
})();
