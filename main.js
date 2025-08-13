// main.js — Wizard 3 passos + cálculo com fatores de dispositivo/OS/conexão
// Atualizações: Salvar => PDF; Carregar => revela painel; Finalizar => recarrega a página.
document.addEventListener("DOMContentLoaded", () => {
  // ====== Helpers ======
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const num = (v) => {
    if (v == null) return null;
    const s = String(v).trim().replace(",", ".");
    const n = parseFloat(s);
    return Number.isFinite(n) ? n : null;
  };
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const round = (v) => Math.round(v);

  const toast = (() => {
    let el = $(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      document.body.appendChild(el);
    }
    let t;
    return (msg, type = "ok", ms = 1600) => {
      el.textContent = msg;
      el.classList.remove("ok", "err");
      el.classList.add(type);
      el.classList.add("show");
      clearTimeout(t);
      t = setTimeout(() => el.classList.remove("show"), ms);
    };
  })();

  // ====== DOM refs ======
  const steps = $$(".stepper .step");
  const stepViews = $$("[data-step-content]");
  const btnPrev = $("#btnPrev");
  const btnNext = $("#btnNext");
  const btnFinalizar = $("#btnFinalizar");

  // Passo 1
  const rAndroid = $("#platform-android");
  const rIOS = $("#platform-ios");
  const inDeviceModel = $("#deviceModel");
  const inOSVersion = $("#osVersion");

  // Passo 2
  const inNetSpeed = $("#netSpeed");

  // Passo 3
  const inCam = $("#cam");
  const inAds = $("#ads");
  const inLivre = $("#livre");
  const inGyro = $("#gyro");
  const inGyroAds = $("#gyro-ads");

  // Ações
  const btnSalvar = $("#btnSalvar");
  const btnCarregar = $("#btnCarregar");
  const btnLimpar = $("#btnLimpar");

  const painel = $("#painel");

  // ====== Estado ======
  let currentStep = 1;
  let showPanel = false; // resultado só aparece após "Carregar"
  const STORAGE_KEY = "sensConfigV4";

  // Faixas por campo
  const FIELD_CFG = {
    cam: { min: 1, max: 300 },
    ads: { min: 1, max: 300 },
    livre: { min: 1, max: 300 },
    gyro: { min: 1, max: 400 },
    gyroAds: { min: 1, max: 400 }
  };

  // ====== Perfis base ======
  const CAMERA_PROFILE = {
    tppNo: 1.00, fppNo: 0.95, redDot: 0.80, x2: 0.55, x3: 0.40, x4: 0.32, x6: 0.24, x8: 0.20
  };
  const ADS_PROFILE = {
    tppNo: 0.95, fppNo: 0.90, redDot: 0.70, x2: 0.50, x3: 0.36, x4: 0.28, x6: 0.22, x8: 0.18
  };
  const GYRO_PROFILE = {
    tppNo: 1.05, fppNo: 1.00, redDot: 0.85, x2: 0.60, x3: 0.45, x4: 0.36, x6: 0.28, x8: 0.24
  };
  const GYRO_ADS_PROFILE = {
    tppNo: 1.00, fppNo: 0.95, redDot: 0.75, x2: 0.54, x3: 0.40, x4: 0.32, x6: 0.25, x8: 0.20
  };

  // ====== Fatores de ambiente ======
  const platformFactors = (platform) => {
    if (platform === "ios") {
      return { cam: 0.99, ads: 0.98, gyro: 0.99 };
    }
    return { cam: 1.00, ads: 1.00, gyro: 1.00 }; // Android
  };

  const osFactors = (platform, osMajor) => {
    if (!Number.isFinite(osMajor)) return { cam: 1.00, ads: 1.00, gyro: 1.00 };
    if (platform === "android") {
      if (osMajor <= 9) return { cam: 0.98, ads: 0.98, gyro: 0.99 };
      if (osMajor >= 13) return { cam: 1.02, ads: 1.01, gyro: 1.01 };
      return { cam: 1.00, ads: 1.00, gyro: 1.00 };
    } else {
      if (osMajor <= 13) return { cam: 0.97, ads: 0.97, gyro: 0.99 };
      if (osMajor >= 17) return { cam: 1.00, ads: 1.00, gyro: 1.00 };
      return { cam: 0.99, ads: 0.99, gyro: 1.00 };
    }
  };

  const netFactors = (mbps) => {
    if (!Number.isFinite(mbps)) return { cam: 1.00, ads: 1.00, gyro: 1.00 };
    if (mbps <= 5) return { cam: 0.98, ads: 0.95, gyro: 0.97 };
    if (mbps <= 20) return { cam: 1.00, ads: 0.98, gyro: 0.99 };
    return { cam: 1.01, ads: 1.02, gyro: 1.00 };
  };

  const combine = (...objs) => objs.reduce((acc, o) => {
    const r = { ...acc };
    for (const k of Object.keys(o)) r[k] = (acc[k] ?? 1) * o[k];
    return r;
  }, {});

  // ====== Funções de cálculo ======
  const applyProfile = (base, profile, factor) => {
    if (base == null) return null;
    const out = {};
    for (const [k, f] of Object.entries(profile)) {
      const v = base * f * (factor ?? 1);
      out[k] = round(clamp(v, 1, 400));
    }
    return out;
  };

  const computeFreeLook = (base, factor) => {
    if (base == null) return null;
    return {
      third: round(clamp(base * (factor ?? 1), 1, 300)),
      camera: round(clamp(base * 0.85 * (factor ?? 1), 1, 300)),
      first: round(clamp(base * 0.92 * (factor ?? 1), 1, 300))
    };
  };

  // ====== UI helpers ======
  const setStep = (n) => {
    currentStep = n;
    // Toggle views
    stepViews.forEach(el => {
      el.hidden = String(n) !== el.getAttribute("data-step-content");
    });
    // Stepper state
    steps.forEach((s, idx) => {
      const stepNum = idx + 1;
      s.classList.toggle("active", stepNum <= n);
    });
    // Nav buttons
    btnPrev.disabled = n === 1;
    // Alterna Next/Finalizar
    btnNext.hidden = n === 3;
    btnFinalizar.hidden = n !== 3;
    btnNext.textContent = n === 3 ? "Próximo →" : "Próximo →";
  };

  const styleBar = (el, valor, max = 100) => {
    const pct = Math.max(0, Math.min(100, (valor / max) * 100));
    const cs = getComputedStyle(document.documentElement);
    const color = cs.getPropertyValue("--accent").trim() || "#5b8cff";
    const bg = cs.getPropertyValue("--surface-2").trim() || "#0e1527";
    el.style.background = `linear-gradient(90deg, ${color} ${pct}%, ${bg} ${pct}%)`;
  };

  const addGrupo = (titulo, pares) => {
    const box = document.createElement("div");
    box.className = "grupo";
    const h = document.createElement("h3");
    h.textContent = titulo;
    box.appendChild(h);

    const lista = document.createElement("div");
    lista.className = "lista";

    pares.forEach(([nome, valor]) => {
      const item = document.createElement("div");
      item.className = "item";
      const left = document.createElement("div");
      left.className = "left";
      left.textContent = nome;
      const right = document.createElement("div");
      right.className = "right";
      right.textContent = valor == null ? "—" : `${valor}%`;
      if (valor != null) styleBar(right, valor, 100);
      item.appendChild(left);
      item.appendChild(right);
      lista.appendChild(item);
    });

    box.appendChild(lista);
    painel.appendChild(box);
  };

  // ====== Sanitização e leitura ======
  const parseOSMajor = () => {
    const v = (inOSVersion.value || "").trim();
    const digits = v.replace(/[^\d]/g, "");
    const m = num(digits);
    return Number.isFinite(m) ? m : null;
  };

  const clampInput = (input, cfg) => {
    const n0 = num(input.value);
    if (n0 == null) { input.value = ""; return null; }
    const n1 = clamp(n0, cfg.min, cfg.max);
    if (n1 !== n0) input.value = String(n1);
    return n1;
  };

  // ====== Render ======
  const render = () => {
    // Respeita a regra: só mostra resultados após "Carregar"
    painel.style.display = showPanel ? "block" : "none";
    if (!showPanel) return;

    painel.innerHTML = "";

    // Ambiente
    const platform = rIOS.checked ? "ios" : (rAndroid.checked ? "android" : null);
    const osMajor = parseOSMajor();
    const speed = num(inNetSpeed.value);

    const pf = platformFactors(platform);
    const of = osFactors(platform, osMajor);
    const nf = netFactors(speed);

    const camFactor = combine(pf ? { cam: pf.cam } : {}, of ? { cam: of.cam } : {}, nf ? { cam: nf.cam } : {}).cam ?? 1;
    const adsFactor = combine(pf ? { ads: pf.ads } : {}, of ? { ads: of.ads } : {}, nf ? { ads: nf.ads } : {}).ads ?? 1;
    const gyroFactor = combine(pf ? { gyro: pf.gyro } : {}, of ? { gyro: of.gyro } : {}, nf ? { gyro: nf.gyro } : {}).gyro ?? 1;

    // Bases (com clamp por campo)
    const camBase = clampInput(inCam, FIELD_CFG.cam);
    const adsBase = clampInput(inAds, FIELD_CFG.ads);
    const livreBase = clampInput(inLivre, FIELD_CFG.livre);
    const gyroBase = clampInput(inGyro, FIELD_CFG.gyro);
    const gyroAdsBase = clampInput(inGyroAds, FIELD_CFG.gyroAds);

    // Cálculos
    const cam = applyProfile(camBase, CAMERA_PROFILE, camFactor);
    const ads = applyProfile(adsBase, ADS_PROFILE, adsFactor);
    const livre = computeFreeLook(livreBase, camFactor);
    const gy = applyProfile(gyroBase, GYRO_PROFILE, gyroFactor);
    const gyA = applyProfile(gyroAdsBase, GYRO_ADS_PROFILE, gyroFactor * 0.995);

    // Resumo do ambiente
    const resumo = document.createElement("div");
    resumo.className = "grupo";
    const h = document.createElement("h3");
    h.textContent = "Ambiente de cálculo";
    resumo.appendChild(h);
    const lista = document.createElement("div");
    lista.className = "lista";
    const addRow = (label, value) => {
      const item = document.createElement("div");
      item.className = "item";
      const left = document.createElement("div");
      left.className = "left";
      left.textContent = label;
      const right = document.createElement("div");
      right.className = "right";
      right.textContent = value ?? "—";
      item.appendChild(left); item.appendChild(right);
      lista.appendChild(item);
    };
    const platformLabel = platform === "ios" ? "iPhone (iOS)" : (platform === "android" ? "Android" : "—");
    addRow("Plataforma", platformLabel);
    addRow("Modelo", (inDeviceModel.value || "").trim() || "—");
    addRow("Versão do software", osMajor != null ? String(osMajor) : "—");
    addRow("Velocidade (Mbps)", speed != null ? String(speed) : "—");
    addRow("Fator — Câmera", `${(camFactor * 100).toFixed(0)}%`);
    addRow("Fator — ADS", `${(adsFactor * 100).toFixed(0)}%`);
    addRow("Fator — Giroscópio", `${(gyroFactor * 100).toFixed(0)}%`);
    resumo.appendChild(lista);
    painel.appendChild(resumo);

    // Grupos
    addGrupo("Lente — Sensibilidade da Câmera", [
      ["3ª pessoa — Sem mira", cam?.tppNo],
      ["1ª pessoa — Sem mira", cam?.fppNo],
      ["Ponto vermelho / Holográfica / Assistida", cam?.redDot],
      ["2x", cam?.x2], ["3x", cam?.x3], ["4x (ACOG) / VSS", cam?.x4], ["6x", cam?.x6], ["8x", cam?.x8]
    ]);

    addGrupo("Lente — Sensibilidade ao Mirar (ADS)", [
      ["3ª pessoa — Sem mira", ads?.tppNo],
      ["1ª pessoa — Sem mira", ads?.fppNo],
      ["Ponto vermelho / Holográfica / Assistida", ads?.redDot],
      ["2x", ads?.x2], ["3x", ads?.x3], ["4x (ACOG) / VSS", ads?.x4], ["6x", ads?.x6], ["8x", ads?.x8]
    ]);

    addGrupo("Lente — Sensibilidade de Câmera (Visão livre)", [
      ["3ª pessoa (Free look)", livre?.third],
      ["Câmera (Geral)", livre?.camera],
      ["1ª pessoa (Free look)", livre?.first]
    ]);

    addGrupo("Giroscópio — Sensibilidade (modo livre)", [
      ["3ª pessoa — Sem mira", gy?.tppNo],
      ["1ª pessoa — Sem mira", gy?.fppNo],
      ["Ponto vermelho / Holográfica / Assistida", gy?.redDot],
      ["2x", gy?.x2], ["3x", gy?.x3], ["4x (ACOG) / VSS", gy?.x4], ["6x", gy?.x6], ["8x", gy?.x8]
    ]);

    addGrupo("Giroscópio — Sensibilidade ao Mirar (ADS)", [
      ["3ª pessoa — Sem mira", gyA?.tppNo],
      ["1ª pessoa — Sem mira", gyA?.fppNo],
      ["Ponto vermelho / Holográfica / Assistida", gyA?.redDot],
      ["2x", gyA?.x2], ["3x", gyA?.x3], ["4x (ACOG) / VSS", gyA?.x4], ["6x", gyA?.x6], ["8x", gyA?.x8]
    ]);
  };

  // ====== Persistência ======
  const snapshot = () => ({
    platform: rIOS.checked ? "ios" : (rAndroid.checked ? "android" : ""),
    deviceModel: inDeviceModel.value || "",
    osVersion: inOSVersion.value || "",
    netSpeed: inNetSpeed.value || "",
    cam: inCam.value || "", ads: inAds.value || "", livre: inLivre.value || "",
    gyro: inGyro.value || "", gyroAds: inGyroAds.value || ""
  });

  const restore = (data) => {
    if (!data) return;
    rAndroid.checked = data.platform === "android";
    rIOS.checked = data.platform === "ios";
    inDeviceModel.value = data.deviceModel || "";
    inOSVersion.value = data.osVersion || "";
    inNetSpeed.value = data.netSpeed || "";
    inCam.value = data.cam || "";
    inAds.value = data.ads || "";
    inLivre.value = data.livre || "";
    inGyro.value = data.gyro || "";
    inGyroAds.value = data.gyroAds || "";
  };

  const saveToStorage = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot()));
      toast("Configurações salvas localmente.", "ok");
    } catch {
      toast("Não foi possível salvar localmente.", "err");
    }
  };

  // ====== Salvar como PDF ======
  const gerarPDF = () => {
    // Garante que o painel esteja visível no PDF
    const prev = painel.style.display;
    const prevShow = showPanel;
    showPanel = true;
    painel.style.display = "block";
    render();

    const prevTitle = document.title;
    document.title = "Configuração de Sensibilidade";
    window.print();
    document.title = prevTitle;

    // Restaura estado de visibilidade
    showPanel = prevShow;
    painel.style.display = prev;

    toast("Abra o diálogo para salvar como PDF.", "ok");
  };

  // ====== Regras de navegação ======
  const canGoNext = () => {
    if (currentStep === 1) {
      const platformOk = rAndroid.checked || rIOS.checked;
      const osOk = parseOSMajor() != null;
      return platformOk && osOk;
    }
    if (currentStep === 2) {
      const spd = num(inNetSpeed.value);
      return Number.isFinite(spd) && spd > 0;
    }
    return true;
  };

  const goNext = () => {
    if (!canGoNext()) {
      toast("Complete os campos obrigatórios deste passo.", "err");
      return;
    }
    if (currentStep < 3) {
      setStep(currentStep + 1);
    }
    render();
  };

  const goPrev = () => {
    if (currentStep > 1) setStep(currentStep - 1);
    render();
  };

  // ====== Eventos ======
  [rAndroid, rIOS, inDeviceModel, inOSVersion].forEach(el => {
    el && el.addEventListener("input", () => {
      render();
    });
  });
  inNetSpeed.addEventListener("input", () => {
    render();
  });

  const FIELD_MAP = { cam: "cam", ads: "ads", livre: "livre", "gyro": "gyro", "gyro-ads": "gyroAds" };
  [inCam, inAds, inLivre, inGyro, inGyroAds].forEach(el => {
    el.addEventListener("input", () => {
      const id = el.id;
      const key = FIELD_MAP[id];
      if (key && FIELD_CFG[key]) {
        const v = num(el.value);
        if (v != null) {
          const lim = clamp(v, FIELD_CFG[key].min, FIELD_CFG[key].max);
          if (lim !== v) el.value = String(lim);
        }
      }
      render();
    });
  });

  btnPrev.addEventListener("click", goPrev);
  btnNext.addEventListener("click", () => {
    // se for avançar ao passo 3, alterna visibilidade dos botões (feito em setStep)
    goNext();
    if (currentStep === 3) {
      // Mostra o botão Finalizar
      btnNext.hidden = true;
      btnFinalizar.hidden = false;
    }
  });

  if (btnFinalizar) {
    btnFinalizar.addEventListener("click", () => {
      // Recarrega a página para novo preenchimento
      window.location.reload();
    });
  }

  // Botões principais

  //Antes--Salvar antes de carregar o resultado.
  btnSalvar.addEventListener("click", () => {
    saveToStorage(); // mantém compatibilidade com "Carregar"
    gerarPDF();      // gera PDF para salvar offline
  });

  //Depois--Salvar depois de carregar o resultado. 
  //Adicionado: verificação if (!showPanel) 
  //Isso impede que o usuário gere PDF sem ter carregado os dados
  btnSalvar.addEventListener("click", () => {
    if (!showPanel) return toast("Carregue o resultado antes de salvar.", "err");
    saveToStorage();
    gerarPDF();
  });


  //Antes--Carregar o resultado depois de salvar.
  //btnCarregar.addEventListener("click", () => {
    //try {
      //const raw = localStorage.getItem(STORAGE_KEY);
      //if (!raw) { toast("Nada para carregar.", "err"); return; }
      //restore(JSON.parse(raw));
      //showPanel = true;           // painel só aparece após clicar "Carregar"
      //toast("Configurações carregadas.", "ok");
      //render();
    //} catch {
      //toast("Falha ao carregar.", "err");
    //}
  //});

  //Depois--Carregar o resultado antes de salvar 
  //(Adicionado: btnSalvar.disabled = false; 
  //Isso garante que o botão Salvar só fique ativo após o painel ser exibido).
  btnCarregar.addEventListener("click", () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) { toast("Nada para carregar.", "err"); return; }
      restore(JSON.parse(raw));
      showPanel = true;
      btnSalvar.disabled = false; // ✅ habilita botão Salvar após carregar
      toast("Configurações carregadas.", "ok");
      render();
    } catch {
      toast("Falha ao carregar.", "err");
    }
  });

  btnLimpar.addEventListener("click", () => {
    restore({
      platform: "", deviceModel: "", osVersion: "", netSpeed: "",
      cam: "", ads: "", livre: "", gyro: "", gyroAds: ""
    });
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    showPanel = false; // esconde painel até carregar novamente
    toast("Campos limpos.", "ok");
    render();
  });

  // ====== Init ======
  setStep(1);
  showPanel = false;       // oculta o painel até o clique em "Carregar"
  render();
});
