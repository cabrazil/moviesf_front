#!/usr/bin/env node

/**
 * Script para otimizar imagens do blog para Vercel
 * Uso: node scripts/optimize-images.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Verifica se sharp está instalado
function checkSharp() {
  try {
    require('sharp');
    return true;
  } catch (e) {
    console.log('📦 Instalando sharp...');
    execSync('npm install sharp --save-dev', { stdio: 'inherit' });
    return true;
  }
}

// Otimiza uma imagem
async function optimizeImage(inputPath, outputPath, options = {}) {
  const sharp = require('sharp');
  
  const {
    width = 1200,
    height = 630,
    quality = 85,
    format = 'webp'
  } = options;

  try {
    await sharp(inputPath)
      .resize(width, height, { 
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality })
      .toFile(outputPath);
    
    const originalSize = fs.statSync(inputPath).size;
    const optimizedSize = fs.statSync(outputPath).size;
    const reduction = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
    
    console.log(`✅ ${path.basename(inputPath)} → ${path.basename(outputPath)} (${reduction}% menor)`);
    
  } catch (error) {
    console.error(`❌ Erro ao otimizar ${inputPath}:`, error.message);
  }
}

// Processa todas as imagens do blog
async function processBlogImages() {
  console.log('🚀 Iniciando otimização de imagens...\n');
  
  if (!checkSharp()) {
    console.log('❌ Erro: Sharp não pôde ser instalado');
    return;
  }

  const blogDir = path.join(__dirname, '../public/images/blog');
  
  if (!fs.existsSync(blogDir)) {
    console.log('❌ Diretório do blog não encontrado');
    return;
  }

  // Configurações para diferentes tipos de imagem
  const configs = [
    {
      name: 'featured',
      width: 1200,
      height: 630,
      quality: 85
    },
    {
      name: 'content',
      width: 800,
      height: 450,
      quality: 85
    },
    {
      name: 'thumbnail',
      width: 400,
      height: 225,
      quality: 80
    }
  ];

  // Encontra todas as imagens
  const findImages = (dir) => {
    const images = [];
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        images.push(...findImages(fullPath));
      } else if (/\.(jpg|jpeg|png)$/i.test(item)) {
        images.push(fullPath);
      }
    }
    
    return images;
  };

  const images = findImages(blogDir);
  
  if (images.length === 0) {
    console.log('📁 Nenhuma imagem encontrada para otimizar');
    return;
  }

  console.log(`📸 Encontradas ${images.length} imagens para otimizar\n`);

  // Processa cada imagem
  for (const imagePath of images) {
    const dir = path.dirname(imagePath);
    const name = path.basename(imagePath, path.extname(imagePath));
    
    console.log(`🔄 Processando: ${path.relative(blogDir, imagePath)}`);
    
    // Cria versões otimizadas
    for (const config of configs) {
      const outputPath = path.join(dir, `${name}_${config.name}.webp`);
      
      // Só cria se não existir
      if (!fs.existsSync(outputPath)) {
        await optimizeImage(imagePath, outputPath, config);
      } else {
        console.log(`⏭️  ${path.basename(outputPath)} já existe`);
      }
    }
    
    console.log(''); // Linha em branco
  }

  console.log('🎉 Otimização concluída!');
  console.log('\n📋 Próximos passos:');
  console.log('1. Teste as imagens otimizadas localmente');
  console.log('2. Faça commit das novas imagens');
  console.log('3. Deploy na Vercel');
}

// Executa o script
if (require.main === module) {
  processBlogImages().catch(console.error);
}

module.exports = { optimizeImage, processBlogImages };
