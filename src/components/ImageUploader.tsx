import React, { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    // Check if file is an image
    if (!file.type.match('image.*')) {
      alert('Please upload an image file');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    // Pass file to parent component
    onImageUpload(file);
  };

  const clearImage = () => {
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      {!preview ? (
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm font-medium text-gray-900">
            Drag and drop an image, or click to browse
          </p>
          <p className="mt-1 text-xs text-gray-500">
            PNG, JPG, GIF up to 10MB
          </p>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleChange}
          />
        </div>
      ) : (
        <div className="relative">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-auto rounded-lg object-contain max-h-[400px]" 
          />
          <button 
            onClick={clearImage}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;