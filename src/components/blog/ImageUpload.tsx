import React, { useState, useRef } from 'react';
import { validateBlogImage, optimizeImageForWeb, generateBlogImagePath } from '../../utils/blogImages';

interface ImageUploadProps {
  onImageSelect: (imagePath: string, optimizedFile: File) => void;
  articleSlug: string;
  currentImage?: string;
  className?: string;
}

export function ImageUpload({ 
  onImageSelect, 
  articleSlug, 
  currentImage,
  className = '' 
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    setError(null);
    setIsProcessing(true);

    try {
      // Valida arquivo
      const validation = validateBlogImage(file);
      if (!validation.valid) {
        setError(validation.error || 'Arquivo inválido');
        return;
      }

      // Otimiza imagem
      const optimizedBlob = await optimizeImageForWeb(file);
      const optimizedFile = new File([optimizedBlob], file.name.replace(/\.[^/.]+$/, '.webp'), {
        type: 'image/webp'
      });

      // Gera preview
      const previewUrl = URL.createObjectURL(optimizedBlob);
      setPreview(previewUrl);

      // Gera caminho organizado
      const imagePath = generateBlogImagePath(articleSlug, file.name);
      
      // Chama callback
      onImageSelect(imagePath, optimizedFile);

    } catch (err) {
      setError('Erro ao processar imagem');
      console.error('Erro no upload:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`image-upload-container ${className}`}>
      <div
        className={`image-upload-area ${
          isDragging ? 'dragging' : ''
        } ${preview ? 'has-preview' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        style={{
          border: '2px dashed #2EC4B6',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          backgroundColor: isDragging ? 'rgba(46, 196, 182, 0.1)' : 'transparent',
          minHeight: preview ? 'auto' : '200px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {preview ? (
          <div style={{ position: 'relative', width: '100%' }}>
            <img
              src={preview}
              alt="Preview"
              style={{
                maxWidth: '100%',
                maxHeight: '300px',
                borderRadius: '8px',
                objectFit: 'cover'
              }}
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeImage();
              }}
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                background: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📸</div>
            <p style={{ margin: '0 0 8px 0', color: '#FDFFFC' }}>
              {isDragging ? 'Solte a imagem aqui' : 'Clique ou arraste uma imagem'}
            </p>
            <p style={{ margin: '0', fontSize: '14px', color: '#888' }}>
              JPG, PNG, WebP ou GIF (máx. 5MB)
            </p>
          </div>
        )}

        {isProcessing && (
          <div style={{ marginTop: '16px' }}>
            <div style={{ 
              display: 'inline-block',
              width: '20px',
              height: '20px',
              border: '2px solid #2EC4B6',
              borderTop: '2px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
              Otimizando imagem...
            </p>
          </div>
        )}

        {error && (
          <div style={{
            marginTop: '16px',
            padding: '8px 12px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #ef4444',
            borderRadius: '4px',
            color: '#ef4444',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
      />

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
