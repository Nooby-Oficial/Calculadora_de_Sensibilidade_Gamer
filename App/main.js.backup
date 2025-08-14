/**
 * Calculadora de Sensibilidade para PUBG Mobile
 * @description Calcula e gerencia configurações de sensibilidade com base em dispositivo,
 * software e conexão, salvando histórico e permitindo exportação em PDF.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Verifica se os módulos estão carregados
  if (!window.PDFGenerator || !window.Storage || !window.DateFormatter) {
    console.error("Erro: Módulos utilitários não carregados corretamente");
    return;
  }

  // ====== CONFIGURAÇÃO E CONSTANTES ======
  const CONFIG = {
    STORAGE: {
      KEY: "sensConfigV4",
      HISTORY_KEY: "sensConfigV4History",
      HISTORY_DAYS: 15
    },
    LIMITS: {
      STANDARD: { min: 1, max: 300 },
      GYRO: { min: 1, max: 400 }
    }
  };

  // ====== LISTAS DE DISPOSITIVOS ======
  const DEVICE_MODELS = {
    android: [
      "Samsung Galaxy S24 Ultra",
      "Samsung Galaxy S24+",
      "Samsung Galaxy S24",
      "Samsung Galaxy S23 Ultra",
      "Samsung Galaxy S23+",
      "Samsung Galaxy S23",
      "Samsung Galaxy S22 Ultra",
      "Samsung Galaxy S22+",
      "Samsung Galaxy S22",
      "Samsung Galaxy S21 Ultra",
      "Samsung Galaxy S21+",
      "Samsung Galaxy S21",
      "Samsung Galaxy S20 Ultra",
      "Samsung Galaxy S20+",
      "Samsung Galaxy S20",
      "Samsung Galaxy Note 20 Ultra",
      "Samsung Galaxy Note 20",
      "Samsung Galaxy A54",
      "Samsung Galaxy A53",
      "Samsung Galaxy A52",
      "Samsung Galaxy A51",
      "Samsung Galaxy A34",
      "Samsung Galaxy A33",
      "Samsung Galaxy A32",
      "Samsung Galaxy A31",
      "Samsung Galaxy A24",
      "Samsung Galaxy A23",
      "Samsung Galaxy A22",
      "Samsung Galaxy A21",
      "Xiaomi 14 Ultra",
      "Xiaomi 14 Pro",
      "Xiaomi 14",
      "Xiaomi 13 Ultra",
      "Xiaomi 13 Pro",
      "Xiaomi 13",
      "Xiaomi 12S Ultra",
      "Xiaomi 12 Pro",
      "Xiaomi 12",
      "Xiaomi 11T Pro",
      "Xiaomi 11T",
      "Xiaomi Mi 11 Ultra",
      "Xiaomi Mi 11 Pro",
      "Xiaomi Mi 11",
      "Xiaomi Mi 10T Pro",
      "Xiaomi Mi 10T",
      "Xiaomi Mi 10 Pro",
      "Xiaomi Mi 10",
      "Xiaomi Redmi Note 13 Pro",
      "Xiaomi Redmi Note 13",
      "Xiaomi Redmi Note 12 Pro",
      "Xiaomi Redmi Note 12",
      "Xiaomi Redmi Note 11 Pro",
      "Xiaomi Redmi Note 11",
      "Xiaomi Redmi Note 10 Pro",
      "Xiaomi Redmi Note 10",
      "Xiaomi Redmi Note 9 Pro",
      "Xiaomi Redmi Note 9",
      "Xiaomi POCO X6 Pro",
      "Xiaomi POCO X6",
      "Xiaomi POCO X5 Pro",
      "Xiaomi POCO X5",
      "Xiaomi POCO X4 Pro",
      "Xiaomi POCO X3 Pro",
      "Xiaomi POCO F5 Pro",
      "Xiaomi POCO F5",
      "Xiaomi POCO F4",
      "Xiaomi POCO F3",
      "OnePlus 12",
      "OnePlus 11",
      "OnePlus 10 Pro",
      "OnePlus 10T",
      "OnePlus 9 Pro",
      "OnePlus 9",
      "OnePlus 8T",
      "OnePlus 8 Pro",
      "OnePlus 8",
      "OnePlus Nord 3",
      "OnePlus Nord 2T",
      "OnePlus Nord 2",
      "OnePlus Nord CE 3",
      "OnePlus Nord CE 2",
      "Google Pixel 8 Pro",
      "Google Pixel 8",
      "Google Pixel 7 Pro",
      "Google Pixel 7",
      "Google Pixel 6 Pro",
      "Google Pixel 6",
      "Google Pixel 5",
      "Google Pixel 4a",
      "Huawei P60 Pro",
      "Huawei P50 Pro",
      "Huawei P40 Pro",
      "Huawei Mate 60 Pro",
      "Huawei Mate 50 Pro",
      "Huawei Mate 40 Pro",
      "Realme GT 5 Pro",
      "Realme GT 3",
      "Realme GT 2 Pro",
      "Realme GT Neo 5",
      "Realme GT Neo 3",
      "Realme 11 Pro+",
      "Realme 10 Pro+",
      "Realme 9 Pro+",
      "Motorola Edge 40 Pro",
      "Motorola Edge 30 Ultra",
      "Motorola Moto G84",
      "Motorola Moto G73",
      "Motorola Moto G62",
      "Asus ROG Phone 8 Pro",
      "Asus ROG Phone 7 Ultimate",
      "Asus ROG Phone 6 Pro",
      "Asus ROG Phone 5s Pro",
      "Asus Zenfone 10",
      "Asus Zenfone 9",
      "Sony Xperia 1 V",
      "Sony Xperia 5 V",
      "Sony Xperia 1 IV",
      "Sony Xperia 5 IV",
      "Sony Xperia 1 III",
      "Vivo X100 Pro",
      "Vivo X90 Pro",
      "Vivo X80 Pro",
      "Vivo V29 Pro",
      "Vivo V27 Pro",
      "Oppo Find X7 Ultra",
      "Oppo Find X6 Pro",
      "Oppo Find X5 Pro",
      "Oppo Reno 11 Pro",
      "Oppo Reno 10 Pro",
      "Nothing Phone (2)",
      "Nothing Phone (1)"
    ],
    ios: [
      "iPhone 15 Pro Max",
      "iPhone 15 Pro",
      "iPhone 15 Plus",
      "iPhone 15",
      "iPhone 14 Pro Max",
      "iPhone 14 Pro",
      "iPhone 14 Plus",
      "iPhone 14",
      "iPhone 13 Pro Max",
      "iPhone 13 Pro",
      "iPhone 13 mini",
      "iPhone 13",
      "iPhone 12 Pro Max",
      "iPhone 12 Pro",
      "iPhone 12 mini",
      "iPhone 12",
      "iPhone SE (3ª geração)",
      "iPhone SE (2ª geração)",
      "iPhone 11 Pro Max",
      "iPhone 11 Pro",
      "iPhone 11",
      "iPhone XS Max",
      "iPhone XS",
      "iPhone XR"
    ]
  };

  // ====== VERSÕES DE SOFTWARE ======
  const SOFTWARE_VERSIONS = {
    android: {
      // Versões suportadas por dispositivos desde 2020
      default: ["15", "14", "13", "12", "11", "10", "9"],
      specific: {
        // Samsung Galaxy S24 series
        "Samsung Galaxy S24 Ultra": ["15", "14"],
        "Samsung Galaxy S24+": ["15", "14"],
        "Samsung Galaxy S24": ["15", "14"],
        
        // Samsung Galaxy S23 series
        "Samsung Galaxy S23 Ultra": ["15", "14", "13"],
        "Samsung Galaxy S23+": ["15", "14", "13"],
        "Samsung Galaxy S23": ["15", "14", "13"],
        
        // Samsung Galaxy S22 series
        "Samsung Galaxy S22 Ultra": ["15", "14", "13", "12"],
        "Samsung Galaxy S22+": ["15", "14", "13", "12"],
        "Samsung Galaxy S22": ["15", "14", "13", "12"],
        
        // Samsung Galaxy S21 series
        "Samsung Galaxy S21 Ultra": ["15", "14", "13", "12", "11"],
        "Samsung Galaxy S21+": ["15", "14", "13", "12", "11"],
        "Samsung Galaxy S21": ["15", "14", "13", "12", "11"],
        
        // Samsung Galaxy S20 series
        "Samsung Galaxy S20 Ultra": ["14", "13", "12", "11", "10"],
        "Samsung Galaxy S20+": ["14", "13", "12", "11", "10"],
        "Samsung Galaxy S20": ["14", "13", "12", "11", "10"],
        
        // Samsung Galaxy Note 20 series
        "Samsung Galaxy Note 20 Ultra": ["14", "13", "12", "11", "10"],
        "Samsung Galaxy Note 20": ["14", "13", "12", "11", "10"],
        
        // Google Pixel 8 series
        "Google Pixel 8 Pro": ["15", "14"],
        "Google Pixel 8": ["15", "14"],
        
        // Google Pixel 7 series
        "Google Pixel 7 Pro": ["15", "14", "13"],
        "Google Pixel 7": ["15", "14", "13"],
        
        // Google Pixel 6 series
        "Google Pixel 6 Pro": ["15", "14", "13", "12"],
        "Google Pixel 6": ["15", "14", "13", "12"],
        
        // Google Pixel 5
        "Google Pixel 5": ["14", "13", "12", "11"],
        
        // OnePlus dispositivos
        "OnePlus 12": ["15", "14"],
        "OnePlus 11": ["15", "14", "13"],
        "OnePlus 10 Pro": ["15", "14", "13", "12"],
        "OnePlus 10T": ["15", "14", "13", "12"],
        "OnePlus 9 Pro": ["15", "14", "13", "12", "11"],
        "OnePlus 9": ["15", "14", "13", "12", "11"],
        "OnePlus 8T": ["14", "13", "12", "11"],
        "OnePlus 8 Pro": ["14", "13", "12", "11", "10"],
        "OnePlus 8": ["14", "13", "12", "11", "10"],
        
        // Xiaomi dispositivos recentes
        "Xiaomi 14 Ultra": ["15", "14"],
        "Xiaomi 14 Pro": ["15", "14"],
        "Xiaomi 14": ["15", "14"],
        "Xiaomi 13 Ultra": ["15", "14", "13"],
        "Xiaomi 13 Pro": ["15", "14", "13"],
        "Xiaomi 13": ["15", "14", "13"],
        
        // Dispositivos mais antigos com versões limitadas
        "iPhone XR": ["13", "12", "11", "10"], // Placeholder para Android (não aplicável)
        "iPhone XS": ["13", "12", "11", "10"],
        "iPhone XS Max": ["13", "12", "11", "10"]
      }
    },
    ios: {
      // Versões iOS suportadas por dispositivos desde 2020
      default: ["18", "17", "16", "15", "14", "13"],
      specific: {
        // iPhone 15 series (2023)
        "iPhone 15 Pro Max": ["18", "17"],
        "iPhone 15 Pro": ["18", "17"],
        "iPhone 15 Plus": ["18", "17"],
        "iPhone 15": ["18", "17"],
        
        // iPhone 14 series (2022)
        "iPhone 14 Pro Max": ["18", "17", "16"],
        "iPhone 14 Pro": ["18", "17", "16"],
        "iPhone 14 Plus": ["18", "17", "16"],
        "iPhone 14": ["18", "17", "16"],
        
        // iPhone 13 series (2021)
        "iPhone 13 Pro Max": ["18", "17", "16", "15"],
        "iPhone 13 Pro": ["18", "17", "16", "15"],
        "iPhone 13 mini": ["18", "17", "16", "15"],
        "iPhone 13": ["18", "17", "16", "15"],
        
        // iPhone 12 series (2020)
        "iPhone 12 Pro Max": ["18", "17", "16", "15", "14"],
        "iPhone 12 Pro": ["18", "17", "16", "15", "14"],
        "iPhone 12 mini": ["18", "17", "16", "15", "14"],
        "iPhone 12": ["18", "17", "16", "15", "14"],
        
        // iPhone SE 3ª geração (2022)
        "iPhone SE (3ª geração)": ["18", "17", "16", "15"],
        
        // iPhone SE 2ª geração (2020)
        "iPhone SE (2ª geração)": ["18", "17", "16", "15", "14", "13"],
        
        // iPhone 11 series (2019)
        "iPhone 11 Pro Max": ["17", "16", "15", "14", "13"],
        "iPhone 11 Pro": ["17", "16", "15", "14", "13"],
        "iPhone 11": ["17", "16", "15", "14", "13"],
        
        // iPhone XS series (2018)
        "iPhone XS Max": ["16", "15", "14", "13"],
        "iPhone XS": ["16", "15", "14", "13"],
        
        // iPhone XR (2018)
        "iPhone XR": ["16", "15", "14", "13"]
      }
    }
  };

  // ====== UTILITÁRIOS ======
  /**
   * Seletores DOM otimizados
   */
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

  // ====== FUNÇÕES DE DISPOSITIVOS ======
  /**
   * Atualiza a lista de modelos de dispositivos baseada na plataforma selecionada
   */
  const updateDeviceModels = (platform) => {
    const deviceSelect = $("#deviceModel");
    
    // Limpa as opções atuais
    deviceSelect.innerHTML = "";
    
    if (!platform) {
      // Se nenhuma plataforma selecionada, desabilita o select
      deviceSelect.disabled = true;
      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.textContent = "Selecione primeiro a plataforma";
      deviceSelect.appendChild(defaultOption);
      
      // Também reseta as versões de software
      updateSoftwareVersions(null, null);
      return;
    }
    
    // Habilita o select e adiciona opção padrão
    deviceSelect.disabled = false;
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Selecione o modelo do dispositivo";
    deviceSelect.appendChild(defaultOption);
    
    // Adiciona os modelos da plataforma selecionada
    const models = DEVICE_MODELS[platform] || [];
    models.forEach(model => {
      const option = document.createElement("option");
      option.value = model;
      option.textContent = model;
      deviceSelect.appendChild(option);
    });
    
    // Adiciona opção "Outro" no final
    const otherOption = document.createElement("option");
    otherOption.value = "outro";
    otherOption.textContent = "Outro (não listado)";
    deviceSelect.appendChild(otherOption);
    
    // Reseta as versões de software quando a plataforma muda
    updateSoftwareVersions(platform, "");
  };

  /**
   * Atualiza a lista de versões de software baseada na plataforma e modelo selecionado
   */
  const updateSoftwareVersions = (platform, deviceModel) => {
    const versionSelect = $("#osVersion");
    
    // Limpa as opções atuais
    versionSelect.innerHTML = "";
    
    if (!platform || !deviceModel || deviceModel === "" || deviceModel === "outro") {
      // Se nenhuma plataforma/modelo selecionado ou "Outro", desabilita o select
      versionSelect.disabled = true;
      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      
      if (!platform) {
        defaultOption.textContent = "Selecione primeiro a plataforma e modelo";
      } else if (!deviceModel || deviceModel === "") {
        defaultOption.textContent = "Selecione primeiro o modelo do dispositivo";
      } else if (deviceModel === "outro") {
        defaultOption.textContent = "Modelo personalizado - digite a versão manualmente";
        // Para modelos personalizados, podemos habilitar e mostrar versões padrão
        versionSelect.disabled = false;
        versionSelect.appendChild(defaultOption);
        
        // Adiciona versões padrão para a plataforma
        const defaultVersions = SOFTWARE_VERSIONS[platform]?.default || [];
        defaultVersions.forEach(version => {
          const option = document.createElement("option");
          option.value = version;
          option.textContent = platform === "ios" ? `iOS ${version}` : `Android ${version}`;
          versionSelect.appendChild(option);
        });
        return;
      }
      
      versionSelect.appendChild(defaultOption);
      return;
    }
    
    // Habilita o select e adiciona opção padrão
    versionSelect.disabled = false;
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Selecione a versão do sistema";
    versionSelect.appendChild(defaultOption);
    
    // Busca versões específicas para o modelo ou usa as padrão
    const platformVersions = SOFTWARE_VERSIONS[platform];
    if (!platformVersions) return;
    
    const specificVersions = platformVersions.specific[deviceModel];
    const versions = specificVersions || platformVersions.default;
    
    // Adiciona as versões disponíveis
    versions.forEach(version => {
      const option = document.createElement("option");
      option.value = version;
      option.textContent = platform === "ios" ? `iOS ${version}` : `Android ${version}`;
      versionSelect.appendChild(option);
    });
  };

  const toast = (() => {
    let el = $(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      el.style.zIndex = "9999";
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

  // Passo 3 - Base
  const inCam = $("#cam");
  const inAds = $("#ads");
  const inLivre = $("#livre");
  const inGyro = $("#gyro");
  const inGyroAds = $("#gyro-ads");

  // Ações
  const btnSalvar = $("#btnSalvar");
  const btnCarregar = $("#btnCarregar");
  const btnCriarPDF = $("#btnCriarPDF");
  const btnCalcular = $("#btnCalcular");

  const painel = $("#painel");

  // ====== Estado ======
  let currentStep = 1;
  let showPanel = false;
  let resultadoCalculado = false;
  
  // ====== Validações de campos e estado ======
  function camposSensibilidadeValidos() {
    const campos = [inCam, inAds, inLivre, inGyro, inGyroAds];
    return campos.every(el => {
      const v = num(el.value);
      if (el === inGyro || el === inGyroAds) {
        return Number.isFinite(v) && v >= 1 && v <= 400;
      }
      return Number.isFinite(v) && v >= 1 && v <= 300;
    });
  }

  function atualizarEstadoBotoes() {
    if (currentStep === 3) {
      const camposValidos = camposSensibilidadeValidos();
      btnCalcular.disabled = !camposValidos;
      
      // Só habilita Salvar se tiver calculado E campos válidos
      const podeExecutar = resultadoCalculado && camposValidos;
      btnSalvar.disabled = !podeExecutar;
    }
    if (btnNext) {
      btnNext.disabled = !canGoNext();
    }
  }

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
  // Modal de confirmação
  const showConfirmModal = (title, message, onConfirm) => {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100vw";
    modal.style.height = "100vh";
    modal.style.background = "rgba(0,0,0,0.75)";
    modal.style.display = "flex";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";
    modal.style.zIndex = "10000"; // Maior que o modal de histórico

    const box = document.createElement("div");
    box.className = "modal-content";
    box.style.background = "var(--surface)";
    box.style.padding = "24px";
    box.style.borderRadius = "12px";
    box.style.maxWidth = "90vw";
    box.style.width = "400px";
    box.style.boxShadow = "var(--shadow)";

    const titleEl = document.createElement("h3");
    titleEl.textContent = title;
    titleEl.style.margin = "0 0 16px";
    titleEl.style.color = "#dbe6ff";
    box.appendChild(titleEl);

    const messageEl = document.createElement("p");
    messageEl.style.margin = "0 0 24px";
    messageEl.style.lineHeight = "1.5";
    messageEl.textContent = message;
    box.appendChild(messageEl);

    const actions = document.createElement("div");
    actions.style.display = "flex";
    actions.style.gap = "12px";
    actions.style.justifyContent = "flex-end";

    const btnConfirm = document.createElement("button");
    btnConfirm.className = "btn danger";
    btnConfirm.textContent = "Sim, confirmar";
    btnConfirm.onclick = () => {
      document.body.removeChild(modal);
      onConfirm();
    };
    actions.appendChild(btnConfirm);

    const btnCancel = document.createElement("button");
    btnCancel.className = "btn ghost";
    btnCancel.textContent = "Não, cancelar";
    btnCancel.onclick = () => document.body.removeChild(modal);
    actions.appendChild(btnCancel);

    box.appendChild(actions);
    modal.appendChild(box);
    document.body.appendChild(modal);
  };

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
    
    // Atualiza estado dos botões
    atualizarEstadoBotoes();
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
    // Para select, o valor já é o número da versão
    if (v === "") return null;
    const m = num(v);
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
    // Só mostra resultados após "Calcular"
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
    
    // Adiciona linhas
    const addRow = (label, value) => {
      const item = document.createElement("div");
      item.className = "item";
      const left = document.createElement("div");
      left.className = "left";
      left.textContent = label;
      const right = document.createElement("div");
      right.className = "right";
      right.textContent = value ?? "—";
      item.appendChild(left);
      item.appendChild(right);
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
      ["2x", cam?.x2],
      ["3x", cam?.x3],
      ["4x (ACOG) / VSS", cam?.x4],
      ["6x", cam?.x6],
      ["8x", cam?.x8]
    ]);

    addGrupo("Lente — Sensibilidade ao Mirar (ADS)", [
      ["3ª pessoa — Sem mira", ads?.tppNo],
      ["1ª pessoa — Sem mira", ads?.fppNo],
      ["Ponto vermelho / Holográfica / Assistida", ads?.redDot],
      ["2x", ads?.x2],
      ["3x", ads?.x3],
      ["4x (ACOG) / VSS", ads?.x4],
      ["6x", ads?.x6],
      ["8x", ads?.x8]
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
      ["2x", gy?.x2],
      ["3x", gy?.x3],
      ["4x (ACOG) / VSS", gy?.x4],
      ["6x", gy?.x6],
      ["8x", gy?.x8]
    ]);

    addGrupo("Giroscópio — Sensibilidade ao Mirar (ADS)", [
      ["3ª pessoa — Sem mira", gyA?.tppNo],
      ["1ª pessoa — Sem mira", gyA?.fppNo],
      ["Ponto vermelho / Holográfica / Assistida", gyA?.redDot],
      ["2x", gyA?.x2],
      ["3x", gyA?.x3],
      ["4x (ACOG) / VSS", gyA?.x4],
      ["6x", gyA?.x6],
      ["8x", gyA?.x8]
    ]);
  };

  // ====== Persistência ======
  const snapshot = () => ({
    platform: rIOS.checked ? "ios" : (rAndroid.checked ? "android" : ""),
    deviceModel: inDeviceModel.value || "",
    osVersion: inOSVersion.value || "",
    netSpeed: inNetSpeed.value || "",
    cam: inCam.value || "",
    ads: inAds.value || "",
    livre: inLivre.value || "",
    gyro: inGyro.value || "",
    gyroAds: inGyroAds.value || ""
  });

  const restore = (data) => {
    if (!data) return;
    // Restaura os valores dos campos
    rAndroid.checked = data.platform === "android";
    rIOS.checked = data.platform === "ios";
    
    // Atualiza a lista de dispositivos baseada na plataforma restaurada
    const platform = data.platform === "android" ? "android" : (data.platform === "ios" ? "ios" : null);
    updateDeviceModels(platform);
    
    // Restaura o modelo do dispositivo após atualizar a lista
    setTimeout(() => {
      inDeviceModel.value = data.deviceModel || "";
      
      // Atualiza as versões de software baseada no modelo restaurado
      updateSoftwareVersions(platform, data.deviceModel || "");
      
      // Restaura a versão do software após atualizar a lista
      setTimeout(() => {
        inOSVersion.value = data.osVersion || "";
      }, 50);
    }, 50);
    inNetSpeed.value = data.netSpeed || "";
    inCam.value = data.cam || "";
    inAds.value = data.ads || "";
    inLivre.value = data.livre || "";
    inGyro.value = data.gyro || "";
    inGyroAds.value = data.gyroAds || "";
    
    // Reset dos estados
    showPanel = false;
    resultadoCalculado = false;
    
    // Atualiza estado dos botões
    btnSalvar.disabled = true;
    atualizarEstadoBotoes();
    
    // Limpa o painel de resultados
    render();
  };

  const saveToStorage = (sobrescrever = false) => {
    try {
      const snap = snapshot();
      const now = Date.now();
      
      // Salva configuração atual
      localStorage.setItem(CONFIG.STORAGE.KEY, JSON.stringify(snap));

      // Carrega histórico
      let hist = [];
      try {
        hist = JSON.parse(localStorage.getItem(CONFIG.STORAGE.HISTORY_KEY)) || [];
      } catch {}

      // Remove antigos (>15 dias)
      hist = hist.filter(item => now - (item.date || 0) < CONFIG.STORAGE.HISTORY_DAYS * 24 * 60 * 60 * 1000);

      // Verifica se já existe igual
      const igual = hist.find(item =>
        item.cam === snap.cam &&
        item.ads === snap.ads &&
        item.livre === snap.livre &&
        item.gyro === snap.gyro &&
        item.gyroAds === snap.gyroAds &&
        item.platform === snap.platform &&
        item.deviceModel === snap.deviceModel &&
        item.osVersion === snap.osVersion &&
        item.netSpeed === snap.netSpeed
      );

      if (!igual || sobrescrever) {
        // Remove o antigo se for sobrescrita
        if (igual && sobrescrever) {
          hist = hist.filter(item => item !== igual);
        }
        // Adiciona ao histórico
        hist.push({ ...snap, date: now });
        localStorage.setItem(CONFIG.STORAGE.HISTORY_KEY, JSON.stringify(hist));
        toast("Configuração salva com sucesso!", "ok");
      } else {
        // Mostra modal de confirmação
        const modal = document.createElement("div");
        modal.className = "modal";
        modal.style.position = "fixed";
        modal.style.top = "0";
        modal.style.left = "0";
        modal.style.width = "100vw";
        modal.style.height = "100vh";
        modal.style.background = "rgba(0,0,0,0.75)";
        modal.style.display = "flex";
        modal.style.alignItems = "center";
        modal.style.justifyContent = "center";
        modal.style.zIndex = "9999";

        const box = document.createElement("div");
        box.className = "modal-content";
        box.style.background = "var(--surface)";
        box.style.padding = "24px";
        box.style.borderRadius = "12px";
        box.style.maxWidth = "90vw";
        box.style.width = "460px";
        box.style.boxShadow = "var(--shadow)";

        const title = document.createElement("h3");
        title.textContent = "Configuração já existe";
        title.style.margin = "0 0 12px";
        title.style.color = "#dbe6ff";
        box.appendChild(title);

        const message = document.createElement("p");
        message.style.margin = "0 0 20px";
        message.style.lineHeight = "1.5";
        message.innerHTML = `
          Uma configuração idêntica foi salva em <br>
          <strong style="color: var(--accent)">${DateFormatter.format(igual.date).completo}</strong>
          <br><br>
          Deseja sobrescrever com o horário atual?
        `;
        box.appendChild(message);

        const actions = document.createElement("div");
        actions.style.display = "flex";
        actions.style.gap = "12px";
        actions.style.justifyContent = "flex-end";

        const btnSobrescrever = document.createElement("button");
        btnSobrescrever.className = "btn";
        btnSobrescrever.textContent = "Sobrescrever";
        btnSobrescrever.onclick = () => {
          document.body.removeChild(modal);
          saveToStorage(true);
        };
        actions.appendChild(btnSobrescrever);

        const btnCancelar = document.createElement("button");
        btnCancelar.className = "btn ghost";
        btnCancelar.textContent = "Cancelar";
        btnCancelar.onclick = () => document.body.removeChild(modal);
        actions.appendChild(btnCancelar);

        box.appendChild(actions);
        modal.appendChild(box);
        document.body.appendChild(modal);
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast("Erro ao salvar configuração.", "err");
    }
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
    if (currentStep === 3) {
      return camposSensibilidadeValidos();
    }
    return true;
  };

  const goNext = () => {
    if (!canGoNext()) {
      // Validação específica para cada passo
      if (currentStep === 1) {
        const platformOk = rAndroid.checked || rIOS.checked;
        const osOk = parseOSMajor() != null;
        
        let mensagem = "Complete os campos obrigatórios:";
        let camposFaltando = [];
        
        if (!platformOk) {
          camposFaltando.push("Plataforma (Android ou iOS)");
          // Destaca visualmente o campo de plataforma
          document.querySelector('.radio-row').classList.add('error');
        } else {
          // Remove o destaque se estiver preenchido
          document.querySelector('.radio-row').classList.remove('error');
        }
        
        if (!osOk) {
          camposFaltando.push("Versão do software");
          // Destaca visualmente o campo de versão
          inOSVersion.classList.add('error');
        } else {
          // Remove o destaque se estiver preenchido
          inOSVersion.classList.remove('error');
        }
        
        if (camposFaltando.length > 0) {
          mensagem += "\n• " + camposFaltando.join("\n• ");
          toast(mensagem, "err", 3000);
          return;
        }
      } else if (currentStep === 2) {
        toast("Informe a velocidade da conexão em Mbps.", "err");
        inNetSpeed.classList.add('error');
        return;
      } else if (currentStep === 3) {
        toast("Preencha todos os campos de sensibilidade corretamente.", "err");
        return;
      }
      
      toast("Complete os campos obrigatórios deste passo.", "err");
      return;
    }
    
    // Remove destaques de erro quando avança com sucesso
    if (currentStep === 1) {
      document.querySelector('.radio-row').classList.remove('error');
      inOSVersion.classList.remove('error');
    } else if (currentStep === 2) {
      inNetSpeed.classList.remove('error');
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
  // Sempre que qualquer campo for alterado, desativa o botão Salvar e esconde resultado
  const desativarSalvar = () => {
    btnSalvar.disabled = true;
    showPanel = false;
    resultadoCalculado = false;
    atualizarEstadoBotoes();
    render();
  };
  
  // Event listeners para remover destaques de erro quando usuário interage
  const removeErrorHighlight = (element, isRadioGroup = false) => {
    if (isRadioGroup) {
      document.querySelector('.radio-row').classList.remove('error');
    } else {
      element.classList.remove('error');
    }
  };

  // Campos da Tela 1 - Dispositivo
  [rAndroid, rIOS].forEach(el => {
    el && el.addEventListener("change", () => {
      removeErrorHighlight(null, true);
      
      // Atualiza a lista de dispositivos baseada na plataforma selecionada
      const platform = rAndroid.checked ? "android" : (rIOS.checked ? "ios" : null);
      updateDeviceModels(platform);
      
      desativarSalvar();
    });
  });
  
  inOSVersion.addEventListener("change", () => {
    removeErrorHighlight(inOSVersion);
    desativarSalvar();
  });
  
  // Atualiza o event listener para o select de dispositivos
  inDeviceModel.addEventListener("change", () => {
    // Atualiza as versões de software baseada no modelo selecionado
    const platform = rAndroid.checked ? "android" : (rIOS.checked ? "ios" : null);
    const deviceModel = inDeviceModel.value;
    updateSoftwareVersions(platform, deviceModel);
    
    desativarSalvar();
  });
  
  // Campo da Tela 2 - Conexão
  inNetSpeed.addEventListener("input", () => {
    removeErrorHighlight(inNetSpeed);
    desativarSalvar();
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
      desativarSalvar();
      atualizarEstadoBotoes();
    });
  });

  btnPrev.addEventListener("click", goPrev);
  btnNext.addEventListener("click", () => {
    goNext();
    if (currentStep === 3) {
      btnNext.hidden = true;
      btnFinalizar.hidden = false;
    }
  });

  if (btnFinalizar) {
    btnFinalizar.addEventListener("click", () => {
      window.location.reload();
    });
  }

  // Botões principais
  btnSalvar.addEventListener("click", () => {
    if (!showPanel || !resultadoCalculado) {
      toast("Calcule o resultado antes de salvar.", "err");
      return;
    }
    saveToStorage();
  });

  btnCarregar.addEventListener("click", () => {
    let hist = [];
    try {
      hist = JSON.parse(localStorage.getItem(CONFIG.STORAGE.HISTORY_KEY)) || [];
    } catch {}

    if (!hist.length) {
      toast("Nenhum histórico salvo.", "err");
      return;
    }

    // Remove registros antigos
    const now = Date.now();
    hist = hist.filter(item => now - (item.date || 0) < CONFIG.STORAGE.HISTORY_DAYS * 24 * 60 * 60 * 1000);

    if (!hist.length) {
      toast("Nenhum histórico encontrado.", "err");
      return;
    }

    // Ordena por data, mais recente primeiro
    hist.sort((a, b) => (b.date || 0) - (a.date || 0));

    // Abre modal com histórico
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100vw";
    modal.style.height = "100vh";
    modal.style.background = "rgba(0,0,0,0.75)";
    modal.style.display = "flex";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";
    modal.style.zIndex = "9999";

    const box = document.createElement("div");
    box.className = "modal-content";
    box.style.background = "var(--surface)";
    box.style.padding = "20px";
    box.style.borderRadius = "12px";
    box.style.maxWidth = "90vw";
    box.style.width = "500px";
    box.style.maxHeight = "80vh";
    box.style.overflowY = "auto";

    const titleBar = document.createElement("div");
    titleBar.style.display = "flex";
    titleBar.style.justifyContent = "space-between";
    titleBar.style.alignItems = "center";
    titleBar.style.marginBottom = "16px";

    const title = document.createElement("h3");
    title.textContent = "Histórico de Sensibilidades";
    title.style.margin = "0";
    titleBar.appendChild(title);

    const btnLimparTodos = document.createElement("button");
    btnLimparTodos.className = "btn ghost danger";
    btnLimparTodos.textContent = "Limpar Histórico";
    btnLimparTodos.onclick = () => {
      showConfirmModal(
        "Limpar Todo o Histórico",
        "Tem certeza que deseja limpar todo o histórico de sensibilidades? Esta ação não pode ser desfeita.",
        () => {
          localStorage.removeItem(CONFIG.STORAGE.HISTORY_KEY);
          document.body.removeChild(modal);
          toast("Histórico limpo com sucesso!", "ok");
          btnCarregar.disabled = true;
        }
      );
    };
    titleBar.appendChild(btnLimparTodos);
    box.appendChild(titleBar);

    hist.forEach(item => {
      const row = document.createElement("div");
      row.style.display = "flex";
      row.style.alignItems = "center";
      row.style.padding = "8px 0";
      row.style.borderBottom = "1px solid var(--border)";

      const info = document.createElement("div");
      info.style.flex = "1";
      const date = new Date(item.date);
      info.textContent = `${DateFormatter.format(date).completo} - ${item.deviceModel || item.platform}`;
      row.appendChild(info);

      const actions = document.createElement("div");
      actions.style.display = "flex";
      actions.style.gap = "8px";

      const btnRestore = document.createElement("button");
      btnRestore.className = "btn";
      btnRestore.textContent = "Restaurar";
      btnRestore.onclick = () => {
        const date = new Date(item.date);
        const dateStr = DateFormatter.format(date).completo;
        const deviceInfo = item.deviceModel || item.platform;
        
        showConfirmModal(
          "Restaurar Configuração",
          `Deseja restaurar a configuração salva em ${dateStr} para ${deviceInfo}? Os valores atuais serão substituídos.`,
          () => {
            restore(item);
            // Reseta o estado dos resultados
            showPanel = false;
            resultadoCalculado = false;
            // Desativa todos os botões de ação
            btnSalvar.disabled = true;
            document.body.removeChild(modal);
            toast("Configuração restaurada! Calcule novamente para gerar PDF.", "ok");
          }
        );
      };
      actions.appendChild(btnRestore);

      const btnRemover = document.createElement("button");
      btnRemover.className = "btn ghost danger";
      btnRemover.textContent = "Remover";
      btnRemover.onclick = () => {
        const date = new Date(item.date);
        const dateStr = DateFormatter.format(date).completo;
        showConfirmModal(
          "Remover do Histórico",
          `Tem certeza que deseja remover a configuração salva em ${dateStr}? Esta ação não pode ser desfeita.`,
          () => {
            hist = hist.filter(h => h !== item);
            localStorage.setItem(CONFIG.STORAGE.HISTORY_KEY, JSON.stringify(hist));
            row.remove();
            if (hist.length === 0) {
              document.body.removeChild(modal);
              btnCarregar.disabled = true;
              toast("Histórico vazio!", "ok");
            } else {
              toast("Item removido!", "ok");
            }
          }
        );
      };
      actions.appendChild(btnRemover);

      row.appendChild(actions);
      box.appendChild(row);
    });

    const btnClose = document.createElement("button");
    btnClose.className = "btn ghost";
    btnClose.textContent = "Fechar";
    btnClose.style.marginTop = "16px";
    btnClose.onclick = () => document.body.removeChild(modal);
    box.appendChild(btnClose);

    modal.appendChild(box);
    document.body.appendChild(modal);
  });

  btnCalcular.addEventListener("click", () => {
    if (!camposSensibilidadeValidos()) {
      toast("Preencha todos os campos de sensibilidade corretamente.", "err");
      return;
    }

    // Adiciona efeito visual de atualização
    btnCalcular.classList.add("pulse");
    painel.classList.add("fade-update");
    
    // Atualiza o estado
    showPanel = true;
    resultadoCalculado = true;
    btnSalvar.disabled = false;
    btnCarregar.disabled = false;
    
    // Renderiza os resultados
    render();
    
    // Remove a classe de pulse após a animação
    setTimeout(() => {
      btnCalcular.classList.remove("pulse");
      painel.classList.remove("fade-update");
    }, 500);
    
    // Mostra mensagem de sucesso
    toast("✨ Resultados atualizados com sucesso!", "ok");
  });

  // Novo evento para criar PDF com impressão
  btnCriarPDF.addEventListener("click", () => {
    if (!showPanel) {
      toast("Calcule o resultado antes de gerar o PDF.", "err");
      return;
    }
    const oldTitle = document.title;
    document.title = "Configuração de Sensibilidade";
    window.print();
    document.title = oldTitle;
    toast("PDF gerado com sucesso.", "ok");
  });

  // ====== Init ======
  setStep(1);
  showPanel = false;
  btnSalvar.disabled = true;
  btnCarregar.disabled = true;
  
  // Inicializa os selects como desabilitados
  updateDeviceModels(null);
  updateSoftwareVersions(null, null);
  
  atualizarEstadoBotoes();
  render();
});
