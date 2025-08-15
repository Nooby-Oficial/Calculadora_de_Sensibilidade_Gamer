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
    },
    UI: {
      MODAL_EDUCATION_SHOWN: false // Flag para educação sobre modais restritos
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
  
  // ====== Sistema de Prevenção de Perda de Dados ======
  
  // Verifica se há dados não salvos (qualquer campo preenchido)
  function hasUnsavedData() {
    const data = snapshot();
    return data.platform || 
           data.deviceModel || 
           data.osVersion || 
           data.netSpeed || 
           data.cam || 
           data.ads || 
           data.livre || 
           data.gyro || 
           data.gyroAds;
  }
  
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
      
      // Só habilita Criar PDF se tiver campos válidos E resultado calculado
      const podeGerar = resultadoCalculado && camposValidos && showPanel;
      btnCriarPDF.disabled = !podeGerar;
      
      // Atualiza tooltip do botão baseado no estado
      if (podeGerar) {
        btnCriarPDF.title = 'Gerar PDF com os resultados calculados';
      } else {
        if (!camposValidos) {
          btnCriarPDF.title = 'Complete todos os campos de sensibilidade para gerar PDF';
        } else if (!resultadoCalculado) {
          btnCriarPDF.title = 'Calcule os resultados antes de gerar o PDF';
        } else {
          btnCriarPDF.title = 'PDF indisponível - verifique os dados';
        }
      }
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
  // Modal especializado para confirmação de sobrescrita
  const showDuplicateConfigModal = (duplicateItem, onConfirm) => {
    // Remove modal existente se houver
    const existingModal = document.querySelector('.modal-overlay');
    if (existingModal) {
      existingModal.remove();
    }

    // Formata informações da configuração duplicada
    const date = new Date(duplicateItem.date);
    const dateStr = DateFormatter.format(date).completo;
    const deviceInfo = `${duplicateItem.platform === 'android' ? '🤖' : '📱'} ${duplicateItem.deviceModel || 'Dispositivo não especificado'}`;
    const osInfo = duplicateItem.osVersion ? ` • ${duplicateItem.osVersion}` : '';
    const networkInfo = duplicateItem.netSpeed ? ` • ${duplicateItem.netSpeed}` : '';
    
    const sensibilityInfo = [
      `📷 Câmera: ${duplicateItem.cam}`,
      `🎯 ADS: ${duplicateItem.ads}`, 
      `🔄 Livre: ${duplicateItem.livre}`,
      `🌀 Gyro: ${duplicateItem.gyro}`,
      `🎯 Gyro ADS: ${duplicateItem.gyroAds}`
    ].join(' • ');

    // Cria o modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.setAttribute('role', 'dialog');
    modalOverlay.setAttribute('aria-modal', 'true');
    modalOverlay.setAttribute('aria-labelledby', 'duplicate-modal-title');
    modalOverlay.setAttribute('aria-describedby', 'duplicate-modal-description');
    
    // Cria o conteúdo do modal
    modalOverlay.innerHTML = `
      <div class="modal duplicate-config-modal">
        <div class="modal-header">
          <div class="modal-icon" aria-hidden="true">⚠️</div>
          <h3 class="modal-title" id="duplicate-modal-title">Configuração Duplicada</h3>
        </div>
        <div class="modal-body">
          <div class="duplicate-info" id="duplicate-modal-description">
            <p class="duplicate-message">
              Uma configuração <strong>idêntica</strong> já foi salva anteriormente:
            </p>
            
            <div class="saved-config-details">
              <div class="config-date">
                <span class="label">📅 Data de Salvamento:</span>
                <span class="value highlight">${dateStr}</span>
              </div>
              
              <div class="config-device">
                <span class="label">🔧 Dispositivo:</span>
                <span class="value">${deviceInfo}${osInfo}${networkInfo}</span>
              </div>
              
              <div class="config-sensitivity">
                <span class="label">⚙️ Sensibilidades:</span>
                <span class="value small">${sensibilityInfo}</span>
              </div>
            </div>
            
            <p class="duplicate-question">
              Deseja <strong>sobrescrever</strong> com a data/hora atual ou manter a configuração existente?
            </p>
          </div>
        </div>
        <div class="modal-actions duplicate-actions">
          <button class="btn overwrite-btn compact" 
                  aria-label="Sobrescrever configuração existente - única forma de decidir" 
                  role="button"
                  tabindex="0"
                  title="Clique para sobrescrever (ESC e clique fora não funcionam)">
            <span class="btn-icon" aria-hidden="true">🔄</span>
            <span class="btn-text">
              <span class="btn-primary">Sobrescrever</span>
              <span class="btn-secondary">Atualizar</span>
            </span>
          </button>
          <button class="btn keep-btn compact" 
                  aria-label="Manter configuração existente - única forma de decidir" 
                  role="button"
                  tabindex="0"
                  title="Clique para manter (ESC e clique fora não funcionam)">
            <span class="btn-icon" aria-hidden="true">✅</span>
            <span class="btn-text">
              <span class="btn-primary">Manter</span>
              <span class="btn-secondary">Preservar</span>
            </span>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modalOverlay);

    // Mostra o modal com animação
    setTimeout(() => {
      modalOverlay.classList.add('show');
    }, 10);

    // Event listeners com feedback háptico e acessibilidade
    const confirmBtn = modalOverlay.querySelector('.overwrite-btn');
    const cancelBtn = modalOverlay.querySelector('.keep-btn');

    // Função para feedback háptico (se disponível)
    function hapticFeedback(type = 'light') {
      if (navigator.vibrate) {
        // Padrões de vibração diferenciados
        const patterns = {
          light: [10],
          medium: [15],
          success: [10, 50, 10],
          warning: [20, 100, 20]
        };
        navigator.vibrate(patterns[type] || patterns.light);
      }
    }

    // Função para anunciar para leitores de tela
    function announceAction(message) {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.style.position = 'absolute';
      announcement.style.left = '-10000px';
      announcement.style.width = '1px';
      announcement.style.height = '1px';
      announcement.style.overflow = 'hidden';
      announcement.textContent = message;
      document.body.appendChild(announcement);
      
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    }

    function closeModal() {
      modalOverlay.classList.remove('show');
      setTimeout(() => {
        modalOverlay.remove();
        // Remove event listener quando modal for fechado  
        document.removeEventListener('keydown', handleEscape);
      }, 300);
    }

    // Event listeners aprimorados
    confirmBtn.addEventListener('click', () => {
      hapticFeedback('warning');
      announceAction('Configuração será sobrescrita');
      closeModal();
      if (onConfirm) onConfirm();
    });

    // Feedback visual e sonoro para botão sobrescrever
    confirmBtn.addEventListener('touchstart', () => {
      hapticFeedback('light');
    }, { passive: true });

    cancelBtn.addEventListener('click', () => {
      hapticFeedback('light');
      announceAction('Configuração mantida');
      closeModal();
    });

    // Feedback visual para botão manter
    cancelBtn.addEventListener('touchstart', () => {
      hapticFeedback('light');
    }, { passive: true });

    // Navegação por teclado melhorada
    function handleKeyboardNavigation(e) {
      if (e.key === 'Tab') {
        // Garante que o foco permaneça dentro do modal
        const focusableElements = modalOverlay.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (document.activeElement === confirmBtn) {
          confirmBtn.click();
        } else if (document.activeElement === cancelBtn) {
          cancelBtn.click();
        }
      }
    }

    modalOverlay.addEventListener('keydown', handleKeyboardNavigation);

    // Define foco inicial no botão mais seguro (Manter)
    setTimeout(() => {
      cancelBtn.focus();
    }, 100);

    // Remover event listener duplicado
    // cancelBtn.addEventListener('click', closeModal); // Já tem um acima
    
    // Clique no overlay não fecha mais - apenas feedback visual
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        // Feedback visual de que deve usar botões específicos
        const modal = modalOverlay.querySelector('.duplicate-config-modal');
        modal.style.animation = 'modal-shake 0.3s ease';
        setTimeout(() => {
          modal.style.animation = '';
        }, 300);
        
        // Feedback tátil sutil
        if (navigator.vibrate) {
          navigator.vibrate(30);
        }
        
        // Toast informativo
        toast("💡 Use SOBRESCREVER ou MANTER EXISTENTE para decidir.", "info");
      }
    });

    // Tecla ESC não fecha mais - apenas feedback visual
    function handleEscape(e) {
      if (e.key === 'Escape') {
        // Feedback visual de que deve usar botões específicos
        const modal = modalOverlay.querySelector('.duplicate-config-modal');
        modal.style.animation = 'modal-shake 0.3s ease';
        setTimeout(() => {
          modal.style.animation = '';
        }, 300);
        
        // Feedback tátil sutil
        if (navigator.vibrate) {
          navigator.vibrate(30);
        }
        
        // Toast informativo
        if (!CONFIG.UI.MODAL_EDUCATION_SHOWN) {
          toast("💡 NOVO: Use SOBRESCREVER ou MANTER EXISTENTE para decidir. ESC e clique fora foram desabilitados.", "info");
          CONFIG.UI.MODAL_EDUCATION_SHOWN = true;
        } else {
          toast("💡 Use SOBRESCREVER ou MANTER EXISTENTE para decidir.", "info");
        }
      }
    }
    document.addEventListener('keydown', handleEscape);
  };

  // Modal de confirmação
  const showConfirmModal = (title, message, onConfirm, onCancel = null) => {
    // Remove modal existente se houver
    const existingModal = document.querySelector('.modal-overlay');
    if (existingModal) {
      existingModal.remove();
    }

    // Cria o modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    
    // Cria o conteúdo do modal
    modalOverlay.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">${title}</h3>
        </div>
        <div class="modal-body">
          <p class="modal-message">${message}</p>
        </div>
        <div class="modal-actions">
          <button class="btn confirm" 
                  title="Clique SIM para confirmar (ESC e clique fora não funcionam)"
                  aria-label="Confirmar ação - única forma de decidir">Sim</button>
          <button class="btn cancel"
                  title="Clique NÃO para cancelar (ESC e clique fora não funcionam)"
                  aria-label="Cancelar ação - única forma de decidir">Não</button>
        </div>
      </div>
    `;

    document.body.appendChild(modalOverlay);

    // Mostra o modal com animação
    setTimeout(() => {
      modalOverlay.classList.add('show');
    }, 10);

    // Event listeners
    const confirmBtn = modalOverlay.querySelector('.btn.confirm');
    const cancelBtn = modalOverlay.querySelector('.btn.cancel');

    function closeModal() {
      modalOverlay.classList.remove('show');
      setTimeout(() => {
        modalOverlay.remove();
        // Remove event listener quando modal for fechado
        document.removeEventListener('keydown', handleEscape);
      }, 300);
    }

    confirmBtn.addEventListener('click', () => {
      closeModal();
      if (onConfirm) onConfirm();
    });

    cancelBtn.addEventListener('click', () => {
      closeModal();
      if (onCancel) onCancel();
    });
    
    // Clique no overlay não fecha mais - apenas feedback visual
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        // Feedback visual de que deve usar botões específicos
        const modal = modalOverlay.querySelector('.modal');
        modal.style.animation = 'modal-shake 0.3s ease';
        setTimeout(() => {
          modal.style.animation = '';
        }, 300);
        
        // Feedback tátil sutil
        if (navigator.vibrate) {
          navigator.vibrate(30);
        }
        
        // Toast informativo
        toast("💡 Use os botões SIM ou NÃO para responder.", "info");
      }
    });

    // Tecla ESC não fecha mais - apenas feedback visual
    function handleEscape(e) {
      if (e.key === 'Escape') {
        // Feedback visual de que deve usar botões específicos
        const modal = modalOverlay.querySelector('.modal');
        modal.style.animation = 'modal-shake 0.3s ease';
        setTimeout(() => {
          modal.style.animation = '';
        }, 300);
        
        // Feedback tátil sutil
        if (navigator.vibrate) {
          navigator.vibrate(30);
        }
        
        // Toast informativo
        if (!CONFIG.UI.MODAL_EDUCATION_SHOWN) {
          toast("💡 NOVO: Use os botões SIM ou NÃO para responder. ESC e clique fora foram desabilitados para melhor experiência.", "info");
          CONFIG.UI.MODAL_EDUCATION_SHOWN = true;
        } else {
          toast("💡 Use os botões SIM ou NÃO para responder.", "info");
        }
      }
    }
    document.addEventListener('keydown', handleEscape);
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
        
        // Mensagem diferenciada para sobrescrita ou novo salvamento
        const message = sobrescrever ? 
          "🔄 Configuração sobrescrita com sucesso!" : 
          "✅ Configuração salva com sucesso!";
        toast(message, "ok");
      } else {
        // Mostra modal elegante de configuração duplicada
        showDuplicateConfigModal(igual, () => {
          saveToStorage(true);
        });
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
    if (currentStep <= 1) return; // Não faz nada se já estiver na primeira tela
    
    // Define mensagens específicas para cada tela
    const stepMessages = {
      2: {
        title: "Voltar para Dispositivo",
        message: "Deseja realmente voltar para a tela anterior? As informações de conexão permanecerão salvas."
      },
      3: {
        title: "Voltar para Conexão", 
        message: "Deseja realmente voltar para a tela anterior? As sensibilidades configuradas permanecerão salvas."
      }
    };
    
    const stepConfig = stepMessages[currentStep];
    if (!stepConfig) {
      // Fallback para casos não mapeados
      setStep(currentStep - 1);
      render();
      return;
    }
    
    // Mostra modal de confirmação
    showConfirmModal(
      stepConfig.title,
      stepConfig.message,
      () => {
        // Confirmado - volta para tela anterior
        const wasOnStep3 = currentStep === 3;
        setStep(currentStep - 1);
        
        // Se estava na tela 3 (Sensibilidade), esconde o painel de resultados
        if (wasOnStep3) {
          showPanel = false;
        }
        
        render();
        toast("Retornado para tela anterior.", "ok");
      }
    );
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
      // Feedback tátil
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
      
      // Verifica se há dados preenchidos
      const platformRadios = document.querySelectorAll('input[name="platform"]');
      const deviceSelected = Array.from(platformRadios).some(radio => radio.checked);
      const deviceModelSelect = document.querySelector('#deviceModel');
      const deviceModel = deviceSelected && deviceModelSelect ? deviceModelSelect.value : null;
      const connectionRadios = document.querySelectorAll('input[name="connection"]');
      const connectionSelected = Array.from(connectionRadios).some(radio => radio.checked);
      const hasCalculatedResults = resultadoCalculado && showPanel;
      
      let statusMessage = "";
      let lossCount = 0;
      
      if (deviceSelected) {
        const selectedPlatform = Array.from(platformRadios).find(r => r.checked);
        const platformText = selectedPlatform?.nextElementSibling?.textContent || 'Selecionado';
        statusMessage += `<li>✖️ <strong>Dispositivo:</strong> ${platformText}</li>`;
        lossCount++;
      }
      
      if (deviceModel) {
        statusMessage += `<li>✖️ <strong>Modelo:</strong> ${deviceModel}</li>`;
        lossCount++;
      }
      
      if (connectionSelected) {
        const selectedConnection = Array.from(connectionRadios).find(r => r.checked);
        const connectionText = selectedConnection?.nextElementSibling?.textContent || 'Selecionada';
        statusMessage += `<li>✖️ <strong>Conexão:</strong> ${connectionText}</li>`;
        lossCount++;
      }
      
      if (hasCalculatedResults) {
        statusMessage += `<li>✖️ <strong>Sensibilidades calculadas</strong> (não salvas)</li>`;
        lossCount++;
      }
      
      const warningLevel = lossCount > 0 ? "⚠️" : "✨";
      const warningText = lossCount > 0 ? 
        `<p style="color: #f59e0b; font-weight: 600; margin-bottom: 12px;">⚠️ ${lossCount} ${lossCount === 1 ? 'item será perdido' : 'itens serão perdidos'}:</p>` :
        `<div style="background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 8px; padding: 12px; margin-bottom: 12px;">
          <p style="color: #059669; font-weight: 600; margin: 0;">✨ Pronto para começar do zero!</p>
          <p style="color: #059669; font-size: 14px; margin: 4px 0 0 0;">Nenhum dado será perdido pois nada foi preenchido ainda.</p>
        </div>`;
      
      showConfirmModal(
        "🔄 Finalizar e Reiniciar",
        `<div style="text-align: center; margin-bottom: 16px;">
          <div style="font-size: 48px; margin-bottom: 12px;">${warningLevel}</div>
          <div style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">Tem certeza que deseja finalizar?</div>
        </div>
        ${warningText}
        ${statusMessage ? `<ul style="text-align: left; margin: 12px 0; padding-left: 20px;">${statusMessage}</ul>` : ''}
        <div style="background: rgba(91, 140, 255, 0.1); border: 1px solid rgba(91, 140, 255, 0.3); border-radius: 8px; padding: 12px; margin-top: 16px;">
          <p style="margin: 0; font-size: 14px;"><strong>🔄 A página será recarregada</strong> e você retornará à <strong>Tela 1</strong> para iniciar um novo preenchimento.</p>
        </div>`,
        () => {
          // Ação confirmada - recarregar página
          toast("🔄 Finalizando e reiniciando...", "ok");
          
          // Feedback tátil de confirmação
          if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100]);
          }
          
          // Delay pequeno para mostrar o toast
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      );
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

  // Modal elegante para histórico de sensibilidades
  const showHistoryModal = (historyItems) => {
    // Remove modal existente se houver
    const existingModal = document.querySelector('.modal-overlay');
    if (existingModal) {
      existingModal.remove();
    }

    // Ordena por data, mais recente primeiro
    historyItems.sort((a, b) => (b.date || 0) - (a.date || 0));

    // Cria o modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    
    // Cria o cabeçalho com contador
    const itemCount = historyItems.length;
    const headerHTML = `
      <div class="modal-header history-header">
        <div class="header-info">
          <div class="modal-icon">📂</div>
          <div class="header-text">
            <h3 class="modal-title">Histórico de Sensibilidades</h3>
            <p class="history-count">${itemCount} configuração${itemCount !== 1 ? 'ões' : ''} salva${itemCount !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <button class="btn ghost danger clear-all-btn" data-action="clear-all"
                title="Limpar todo o histórico (modal permanece aberto)"
                aria-label="Remover todas as ${itemCount} configurações salvas - modal permanece aberto">
          🗑️ Limpar Tudo
        </button>
      </div>
    `;

    // Cria a lista de itens do histórico
    const historyListHTML = historyItems.map((item, index) => {
      const date = new Date(item.date);
      const dateStr = DateFormatter.format(date).completo;
      const deviceIcon = item.platform === 'android' ? '🤖' : '📱';
      const deviceInfo = item.deviceModel || 'Dispositivo não especificado';
      const osInfo = item.osVersion ? ` • ${item.osVersion}` : '';
      const networkInfo = item.netSpeed ? ` • ${item.netSpeed}` : '';
      
      const sensibilityData = [
        { label: '📷 Câmera', value: item.cam },
        { label: '🎯 ADS', value: item.ads },
        { label: '🔄 Livre', value: item.livre },
        { label: '🌀 Gyro', value: item.gyro },
        { label: '🎯 Gyro ADS', value: item.gyroAds }
      ];

      return `
        <div class="history-item" data-index="${index}">
          <div class="history-item-header">
            <div class="item-date">
              <span class="date-primary">${dateStr.split(' às ')[0]}</span>
              <span class="date-time">${dateStr.split(' às ')[1]}</span>
            </div>
            <div class="item-badge ${item.platform}">${deviceIcon}</div>
          </div>
          
          <div class="history-item-content">
            <div class="device-info">
              <span class="device-name">${deviceInfo}</span>
              <span class="device-details">${osInfo}${networkInfo}</span>
            </div>
            
            <div class="sensitivity-grid">
              ${sensibilityData.map(sens => `
                <div class="sens-item">
                  <span class="sens-label">${sens.label}</span>
                  <span class="sens-value">${sens.value}</span>
                </div>
              `).join('')}
            </div>
          </div>
          
          <div class="history-item-actions">
            <button class="btn primary restore-btn" data-index="${index}" 
                    title="Restaurar configuração (retorna à Tela 3 Sensibilidade)"
                    aria-label="Restaurar configuração salva em ${DateFormatter.format(new Date(item.date)).completo} - retorna à Tela 3 Sensibilidade">
              ↩️ Restaurar
            </button>
            <button class="btn ghost danger remove-btn" data-index="${index}"
                    title="Remover configuração (modal permanece aberto)"
                    aria-label="Remover configuração salva em ${DateFormatter.format(new Date(item.date)).completo} - modal permanece aberto">
              🗑️ Remover
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Monta o HTML completo do modal
    modalOverlay.innerHTML = `
      <div class="modal history-modal">
        ${headerHTML}
        <div class="modal-body">
          <div class="history-list">
            ${historyListHTML}
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn primary close-btn" 
                  aria-label="Fechar modal do histórico de sensibilidades - única forma de sair"
                  title="Clique aqui para fechar o modal (ESC e clique fora não funcionam)">
            <span aria-hidden="true">✖️</span>
            <span>FECHAR</span>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modalOverlay);

    // Mostra o modal com animação
    setTimeout(() => {
      modalOverlay.classList.add('show');
    }, 10);

    // Event listeners
    function closeModal() {
      modalOverlay.classList.remove('show');
      setTimeout(() => {
        modalOverlay.remove();
        // Remove event listener quando modal for fechado
        document.removeEventListener('keydown', handleEscape);
      }, 300);
    }

    // Botão fechar com feedback tátil e acessibilidade
    const closeBtn = modalOverlay.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
      // Feedback tátil em dispositivos móveis
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
      closeModal();
    });

    // Removido suporte automático a ESC - agora só informa que deve usar botão FECHAR

    // Botão limpar tudo
    modalOverlay.querySelector('.clear-all-btn').addEventListener('click', () => {
      // Feedback tátil
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
      
      showConfirmModal(
        "🗑️ Limpar Todo o Histórico",
        `Tem certeza que deseja remover todas as ${itemCount} configurações salvas? Esta ação não pode ser desfeita e você perderá todo o histórico.`,
        () => {
          localStorage.removeItem(CONFIG.STORAGE.HISTORY_KEY);
          // Não fecha o modal automaticamente - usuário deve usar botão FECHAR
          toast("🗑️ Histórico limpo com sucesso! Use o botão FECHAR para sair.", "ok");
          btnCarregar.disabled = true;
          
          // Atualiza o cabeçalho para mostrar 0 configurações
          const historyCount = modalOverlay.querySelector('.history-count');
          if (historyCount) {
            historyCount.textContent = '0 configurações salvas';
          }
          
          // Atualiza o conteúdo do modal para mostrar lista vazia
          const historyList = modalOverlay.querySelector('.history-list');
          historyList.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: var(--text-secondary);">
              <div style="font-size: 48px; margin-bottom: 16px;">📭</div>
              <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">Histórico Vazio</div>
              <div style="font-size: 14px;">Todas as configurações foram removidas.</div>
            </div>
          `;
          
          // Remove o botão "Limpar Tudo" já que não há mais itens
          const clearBtn = modalOverlay.querySelector('.clear-all-btn');
          if (clearBtn) {
            clearBtn.style.display = 'none';
          }
          
          // Feedback tátil de sucesso
          if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100]);
          }
          
          // Reabre o modal do histórico com estado vazio
          setTimeout(() => {
            showHistoryModal([]);
          }, 100);
        },
        // Callback de cancelamento - reabre o modal do histórico
        () => {
          setTimeout(() => {
            showHistoryModal(historyItems);
          }, 100);
        }
      );
    });

    // Botões restaurar
    modalOverlay.querySelectorAll('.restore-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Feedback tátil
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
        
        const index = parseInt(e.target.dataset.index);
        const item = historyItems[index];
        const date = new Date(item.date);
        const dateStr = DateFormatter.format(date).completo;
        const deviceInfo = item.deviceModel || item.platform;
        
        showConfirmModal(
          "↩️ Restaurar Configuração",
          `Deseja restaurar a configuração salva em <strong>${dateStr}</strong> para <strong>${deviceInfo}</strong>?<br><br>⚠️ Os valores atuais serão substituídos pela configuração selecionada.`,
          () => {
            restore(item);
            // Reseta o estado dos resultados
            showPanel = false;
            resultadoCalculado = false;
            // Desativa todos os botões de ação
            btnSalvar.disabled = true;
            // Atualiza estado dos botões
            atualizarEstadoBotoes();
            // Modal de histórico fecha automaticamente - retorna à Tela 3
            toast("↩️ Configuração restaurada com sucesso!", "ok");
            
            // Feedback tátil de sucesso
            if (navigator.vibrate) {
              navigator.vibrate([100, 50, 100]);
            }
            
            // NÃO reabre o modal do histórico - retorna à Tela 3 automaticamente
          },
          // Callback de cancelamento - reabre o modal do histórico
          () => {
            setTimeout(() => {
              showHistoryModal(historyItems);
            }, 100);
          }
        );
      });
    });

    // Botões remover
    modalOverlay.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Feedback tátil
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
        
        const index = parseInt(e.target.dataset.index);
        const item = historyItems[index];
        const date = new Date(item.date);
        const dateStr = DateFormatter.format(date).completo;
        
        showConfirmModal(
          "🗑️ Remover Configuração",
          `Tem certeza que deseja remover a configuração salva em <strong>${dateStr}</strong>?<br><br>⚠️ Esta ação não pode ser desfeita.`,
          () => {
            // Remove do array e atualiza localStorage
            historyItems.splice(index, 1);
            localStorage.setItem(CONFIG.STORAGE.HISTORY_KEY, JSON.stringify(historyItems));
            
            // Feedback visual de processamento
            const historyItem = btn.closest('.history-item');
            if (historyItem) {
              historyItem.classList.add('processing');
            }
            
            // Modal permanece aberto - atualiza conteúdo dinamicamente
            if (historyItems.length === 0) {
              btnCarregar.disabled = true;
              toast("📭 Último item removido! Use o botão FECHAR para sair.", "ok");
              
              // Atualiza o cabeçalho para mostrar 0 configurações
              const historyCount = modalOverlay.querySelector('.history-count');
              if (historyCount) {
                historyCount.textContent = '0 configurações salvas';
              }
              
              // Atualiza o conteúdo para mostrar lista vazia
              const historyList = modalOverlay.querySelector('.history-list');
              historyList.innerHTML = `
                <div style="text-align: center; padding: 40px 20px; color: var(--text-secondary);">
                  <div style="font-size: 48px; margin-bottom: 16px;">📭</div>
                  <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">Histórico Vazio</div>
                  <div style="font-size: 14px;">Não há mais configurações salvas.</div>
                </div>
              `;
              
              // Remove o botão "Limpar Tudo"
              const clearBtn = modalOverlay.querySelector('.clear-all-btn');
              if (clearBtn) {
                clearBtn.style.display = 'none';
              }
            } else {
              // Atualiza o contador no cabeçalho
              const historyCount = modalOverlay.querySelector('.history-count');
              if (historyCount) {
                historyCount.textContent = `${historyItems.length} configuração${historyItems.length !== 1 ? 'ões' : ''} salva${historyItems.length !== 1 ? 's' : ''}`;
              }
              
              toast(`🗑️ Configuração removida! ${historyItems.length} ${historyItems.length === 1 ? 'configuração restante' : 'configurações restantes'}.`, "ok");
              
              // Remove apenas o item específico do DOM
              const historyItem = btn.closest('.history-item');
              if (historyItem) {
                historyItem.style.animation = 'fade-out 0.3s ease';
                setTimeout(() => {
                  historyItem.remove();
                  
                  // Reindexar os botões restantes corretamente
                  modalOverlay.querySelectorAll('.history-item').forEach((item, newIndex) => {
                    const restoreBtn = item.querySelector('.restore-btn');
                    const removeBtn = item.querySelector('.remove-btn');
                    if (restoreBtn) restoreBtn.dataset.index = newIndex;
                    if (removeBtn) removeBtn.dataset.index = newIndex;
                  });
                  
                  // Atualiza referências do array para refletir os novos índices
                  historyItems.forEach((item, idx) => {
                    item._displayIndex = idx;
                  });
                }, 300);
              }
            }
            
            // Feedback tátil de sucesso
            if (navigator.vibrate) {
              navigator.vibrate([100, 50, 100]);
            }
            
            // Reabre o modal do histórico com dados atualizados
            setTimeout(() => {
              showHistoryModal(historyItems);
            }, 100);
          },
          // Callback de cancelamento - reabre o modal do histórico
          () => {
            setTimeout(() => {
              showHistoryModal(historyItems);
            }, 100);
          }
        );
      });
    });

    // Clique no overlay não fecha mais o modal
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        // Feedback visual de que o modal só fecha pelo botão FECHAR
        const modal = modalOverlay.querySelector('.history-modal');
        modal.style.animation = 'modal-shake 0.3s ease';
        setTimeout(() => {
          modal.style.animation = '';
        }, 300);
        
        // Feedback tátil sutil
        if (navigator.vibrate) {
          navigator.vibrate(30);
        }
        
        // Toast informativo
        toast("💡 Use o botão FECHAR para sair do histórico.", "info");
      }
    });

    // Tecla ESC não fecha mais o modal
    function handleEscape(e) {
      if (e.key === 'Escape') {
        // Feedback visual de que o modal só fecha pelo botão FECHAR
        const modal = modalOverlay.querySelector('.history-modal');
        modal.style.animation = 'modal-shake 0.3s ease';
        setTimeout(() => {
          modal.style.animation = '';
        }, 300);
        
        // Feedback tátil sutil
        if (navigator.vibrate) {
          navigator.vibrate(30);
        }
        
        // Toast informativo
        toast("💡 Use o botão FECHAR para sair do histórico.", "info");
      }
    }
    document.addEventListener('keydown', handleEscape);
  };

  btnCarregar.addEventListener("click", () => {
    let hist = [];
    try {
      hist = JSON.parse(localStorage.getItem(CONFIG.STORAGE.HISTORY_KEY)) || [];
    } catch {}

    if (!hist.length) {
      toast("📭 Nenhum histórico encontrado.", "err");
      return;
    }

    // Remove registros antigos
    const now = Date.now();
    hist = hist.filter(item => now - (item.date || 0) < CONFIG.STORAGE.HISTORY_DAYS * 24 * 60 * 60 * 1000);

    if (!hist.length) {
      toast("📭 Nenhum histórico recente encontrado.", "err");
      localStorage.removeItem(CONFIG.STORAGE.HISTORY_KEY);
      btnCarregar.disabled = true;
      return;
    }

    // Mostra o modal modernizado
    showHistoryModal(hist);
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
    
    // Atualiza estado dos botões após calcular
    atualizarEstadoBotoes();
    
    // Remove a classe de pulse após a animação
    setTimeout(() => {
      btnCalcular.classList.remove("pulse");
      painel.classList.remove("fade-update");
    }, 500);
    
    // Mostra mensagem de sucesso
    toast("✨ Resultados atualizados com sucesso!", "ok");
  });

  // Novo evento para criar PDF com impressão
  btnCriarPDF.addEventListener("click", (e) => {
    // Previne ação se botão estiver desabilitado
    if (btnCriarPDF.disabled) {
      e.preventDefault();
      e.stopPropagation();
      
      if (!camposSensibilidadeValidos()) {
        toast("❌ Complete todos os campos de sensibilidade para gerar PDF", "err");
      } else if (!resultadoCalculado || !showPanel) {
        toast("❌ Calcule os resultados antes de gerar o PDF", "err");
      } else {
        toast("❌ PDF indisponível - verifique os dados", "err");
      }
      return;
    }
    
    // Validação dupla de segurança
    if (!showPanel || !resultadoCalculado || !camposSensibilidadeValidos()) {
      toast("❌ Dados incompletos. Complete todos os campos e calcule os resultados.", "err");
      return;
    }
    
    const oldTitle = document.title;
    document.title = "Configuração de Sensibilidade";
    window.print();
    document.title = oldTitle;
    toast("�️ PDF gerado com sucesso!", "ok");
  });

  // ====== Init ======
  setStep(1);
  showPanel = false;
  btnSalvar.disabled = true;
  btnCarregar.disabled = true;
  
  // Inicializa os selects como desabilitados
  updateDeviceModels(null);
  updateSoftwareVersions(null, null);
  
  // ====== Sistema de Prevenção de Recarregamento ======
  
  // Intercepta tentativas de recarregamento/fechamento da página
  window.addEventListener('beforeunload', (event) => {
    // Só mostra aviso se há dados não salvos
    if (hasUnsavedData()) {
      const message = 'Você tem dados não salvos. Se sair da página, todos os dados serão perdidos. Deseja continuar?';
      
      // Padrão moderno - define returnValue
      event.returnValue = message;
      
      // Padrão antigo - retorna mensagem
      return message;
    }
  });
  
  atualizarEstadoBotoes();
  render();
});
