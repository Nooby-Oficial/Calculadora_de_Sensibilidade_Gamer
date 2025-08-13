/**
 * Módulo de Utilitários Independentes
 * Implementações próprias sem dependências externas
 */

// ====== PDF Generator ======
/**
 * Gerador de PDF próprio
 * Não depende de bibliotecas externas
 */
const PDFGenerator = {
  /**
   * Converte elemento HTML para PDF
   */
  elementToPDF: (data, title = 'Configuração de Sensibilidade') => {
    try {
      // Cria um documento PDF usando a estrutura básica
      const pdfContent = [];
      
      // Adiciona cabeçalho
      pdfContent.push(
        '%PDF-1.7',
        '1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj',
        '2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj',
        '3 0 obj<</Type/Page/Parent 2 0 R/Resources<</Font<</F1<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>/F2<</Type/Font/Subtype/Type1/BaseFont/Helvetica-Bold>>>>>>/Contents 4 0 R/MediaBox[0 0 595 842]>>endobj'
      );

      // Prepara o conteúdo
      let content = `
        BT
        /F2 18 Tf
        50 800 Td
        (${title}) Tj
        /F1 12 Tf
        0 -40 Td
      `;

      // Função para escapar texto para PDF
      const escapePDFText = (text) => {
        return text.replace(/[()\\]/g, '\\$&');
      };

      // Função para adicionar uma seção
      const addSection = (title, items) => {
        let text = '';
        // Título da seção em negrito
        text += '0 -30 Td\n';
        text += '/F2 14 Tf\n';
        text += `(${escapePDFText(title)}) Tj\n`;
        text += '/F1 12 Tf\n';
        text += '0 -20 Td\n';

        // Itens da seção
        items.forEach(([label, value]) => {
          if (value != null && value !== '') {
            text += '0 -20 Td\n';
            text += `(${escapePDFText(label)}: ${escapePDFText(String(value))}) Tj\n`;
          }
        });
        
        return text;
      };

      // Adiciona informações do dispositivo
      const deviceInfo = [
        ['Plataforma', data.configDevice.plataforma],
        ['Modelo', data.configDevice.modelo],
        ['Versão do Sistema', data.configDevice.versaoSO],
        ['Velocidade da Internet', `${data.configDevice.velocidadeNet} Mbps`]
      ];
      content += addSection('Informações do Dispositivo', deviceInfo);

      // Adiciona configurações base
      const baseConfig = [
        ['Câmera', data.configSensibilidade.camera.tppNo],
        ['ADS', data.configSensibilidade.ads.tppNo],
        ['Visão Livre', data.configSensibilidade.livre.third],
        ['Giroscópio', data.configSensibilidade.gyro?.tppNo || 'Desativado'],
        ['Giroscópio (ADS)', data.configSensibilidade.gyroAds?.tppNo || 'Desativado']
      ];
      content += addSection('Configurações Base', baseConfig);

      // Adiciona sensibilidades da câmera
      const camConfig = [
        ['3ª pessoa — Sem mira', data.configSensibilidade.camera.tppNo],
        ['1ª pessoa — Sem mira', data.configSensibilidade.camera.fppNo],
        ['Ponto vermelho / Holográfica', data.configSensibilidade.camera.redDot],
        ['2x', data.configSensibilidade.camera.x2],
        ['3x', data.configSensibilidade.camera.x3],
        ['4x (ACOG) / VSS', data.configSensibilidade.camera.x4],
        ['6x', data.configSensibilidade.camera.x6],
        ['8x', data.configSensibilidade.camera.x8]
      ];
      content += addSection('Sensibilidade de Câmera', camConfig);

      // Adiciona sensibilidades ADS
      const adsConfig = [
        ['3ª pessoa — Sem mira', data.configSensibilidade.ads.tppNo],
        ['1ª pessoa — Sem mira', data.configSensibilidade.ads.fppNo],
        ['Ponto vermelho / Holográfica', data.configSensibilidade.ads.redDot],
        ['2x', data.configSensibilidade.ads.x2],
        ['3x', data.configSensibilidade.ads.x3],
        ['4x (ACOG) / VSS', data.configSensibilidade.ads.x4],
        ['6x', data.configSensibilidade.ads.x6],
        ['8x', data.configSensibilidade.ads.x8]
      ];
      content += addSection('Sensibilidade ao Mirar (ADS)', adsConfig);

      // Adiciona sensibilidades de visão livre
      const livreConfig = [
        ['3ª pessoa (Free look)', data.configSensibilidade.livre.third],
        ['Câmera (Geral)', data.configSensibilidade.livre.camera],
        ['1ª pessoa (Free look)', data.configSensibilidade.livre.first]
      ];
      content += addSection('Sensibilidade de Visão Livre', livreConfig);

      // Adiciona sensibilidades do giroscópio se estiver ativo
      if (data.configSensibilidade.gyro) {
        const gyroConfig = [
          ['3ª pessoa — Sem mira', data.configSensibilidade.gyro.tppNo],
          ['1ª pessoa — Sem mira', data.configSensibilidade.gyro.fppNo],
          ['Ponto vermelho / Holográfica', data.configSensibilidade.gyro.redDot],
          ['2x', data.configSensibilidade.gyro.x2],
          ['3x', data.configSensibilidade.gyro.x3],
          ['4x (ACOG) / VSS', data.configSensibilidade.gyro.x4],
          ['6x', data.configSensibilidade.gyro.x6],
          ['8x', data.configSensibilidade.gyro.x8]
        ];
        content += addSection('Sensibilidade do Giroscópio', gyroConfig);

        const gyroAdsConfig = [
          ['3ª pessoa — Sem mira', data.configSensibilidade.gyroAds.tppNo],
          ['1ª pessoa — Sem mira', data.configSensibilidade.gyroAds.fppNo],
          ['Ponto vermelho / Holográfica', data.configSensibilidade.gyroAds.redDot],
          ['2x', data.configSensibilidade.gyroAds.x2],
          ['3x', data.configSensibilidade.gyroAds.x3],
          ['4x (ACOG) / VSS', data.configSensibilidade.gyroAds.x4],
          ['6x', data.configSensibilidade.gyroAds.x6],
          ['8x', data.configSensibilidade.gyroAds.x8]
        ];
        content += addSection('Sensibilidade do Giroscópio ao Mirar (ADS)', gyroAdsConfig);
      }

      content += '0 -40 Td\n';
      content += '/F2 12 Tf\n';
      content += '(Data e hora da geração: ' + new Date().toLocaleString() + ') Tj\n';
      content += 'ET';

      // Adiciona o conteúdo ao PDF
      const contentBytes = content.split('').map(c => c.charCodeAt(0));
      pdfContent.push(
        `4 0 obj<</Length ${contentBytes.length}>>\nstream\n${content}\nendstream\nendobj`,
        'xref',
        '0 5',
        '0000000000 65535 f',
        '0000000010 00000 n',
        '0000000044 00000 n',
        '0000000095 00000 n',
        '0000000250 00000 n',
        'trailer<</Size 5/Root 1 0 R>>',
        'startxref',
        '408',
        '%%EOF'
      );

      // Cria o blob e link de download
      const blob = new Blob([pdfContent.join('\n')], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const date = new Date().toISOString().split('T')[0];
      const time = new Date().toTimeString().split(' ')[0].replace(/:/g, '-');
      link.download = `sensibilidade-config-${date}-${time}.pdf`;
      link.href = url;
      link.click();
      
      // Limpa URL
      setTimeout(() => URL.revokeObjectURL(url), 100);

    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      throw error;
    }
  },

  /**
   * Para compatibilidade com código existente
   */
  generatePDF: function(data) {
    const date = new Date();
    const title = `Configuração de Sensibilidade - ${date.toLocaleDateString()}`;
    return this.elementToPDF(data, title);
  }
};

// ====== Data Storage ======
/**
 * Sistema de armazenamento próprio
 * Wrapper sobre localStorage com compressão básica
 */
const Storage = {
  /**
   * Compressão básica para strings
   */
  compress: (str) => {
    try {
      if (typeof str !== 'string') {
        throw new Error('Input deve ser uma string');
      }
      return btoa(encodeURIComponent(str));
    } catch (error) {
      console.error('Erro na compressão:', error);
      return null;
    }
  },

  /**
   * Descompressão
   */
  decompress: (str) => {
    try {
      if (typeof str !== 'string') {
        throw new Error('Input deve ser uma string');
      }
      return decodeURIComponent(atob(str));
    } catch (error) {
      console.error('Erro na descompressão:', error);
      return null;
    }
  },

  /**
   * Salva com compressão
   */
  save: (key, data) => {
    try {
      if (!key || typeof key !== 'string') {
        throw new Error('Chave inválida');
      }
      const compressed = Storage.compress(JSON.stringify(data));
      if (!compressed) {
        throw new Error('Falha na compressão dos dados');
      }
      localStorage.setItem(key, compressed);
      return true;
    } catch (error) {
      console.error('Erro ao salvar:', error);
      return false;
    }
  },

  /**
   * Carrega com descompressão
   */
  load: (key) => {
    try {
      if (!key || typeof key !== 'string') {
        throw new Error('Chave inválida');
      }
      const compressed = localStorage.getItem(key);
      if (!compressed) return null;
      const str = Storage.decompress(compressed);
      if (!str) return null;
      return JSON.parse(str);
    } catch (error) {
      console.error('Erro ao carregar:', error);
      return null;
    }
  },

  /**
   * Remove item
   */
  remove: (key) => {
    try {
      if (!key || typeof key !== 'string') {
        throw new Error('Chave inválida');
      }
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Erro ao remover:', error);
      return false;
    }
  }
};

// ====== Date Formatter ======
/**
 * Formatador de datas próprio
 * Não depende de bibliotecas de data
 */
const DateFormatter = {
  /**
   * Formata data para pt-BR
   */
  format: (date) => {
    try {
      if (!(date instanceof Date)) {
        date = new Date(date);
      }
      
      if (isNaN(date.getTime())) {
        throw new Error('Data inválida');
      }
      
      const dia = String(date.getDate()).padStart(2, '0');
      const mes = String(date.getMonth() + 1).padStart(2, '0');
      const ano = date.getFullYear();
      const hora = String(date.getHours()).padStart(2, '0');
      const minuto = String(date.getMinutes()).padStart(2, '0');
      
      return {
        data: `${dia}/${mes}/${ano}`,
        hora: `${hora}:${minuto}`,
        completo: `${dia}/${mes}/${ano} ${hora}:${minuto}`
      };
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return {
        data: '--/--/----',
        hora: '--:--',
        completo: '--/--/---- --:--'
      };
    }
  },

  /**
   * Calcula diferença em dias
   */
  daysDiff: (date1, date2) => {
    try {
      const d1 = new Date(date1);
      const d2 = new Date(date2);
      
      if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
        throw new Error('Data(s) inválida(s)');
      }
      
      const diff = Math.abs(d2 - d1);
      return Math.floor(diff / (1000 * 60 * 60 * 24));
    } catch (error) {
      console.error('Erro ao calcular diferença:', error);
      return 0;
    }
  }
};

// Exporta utilitários
window.PDFGenerator = PDFGenerator;
window.Storage = Storage;
window.DateFormatter = DateFormatter;
