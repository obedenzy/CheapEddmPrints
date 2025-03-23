import { useState, useRef } from 'react';

interface DesignUploaderProps {
  side: 'front' | 'back';
  onFileSelect: (file: File) => void;
}

const DesignUploader = ({ side, onFileSelect }: DesignUploaderProps) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Handle file upload
  const handleFile = (file: File) => {
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (validTypes.includes(file.type)) {
        onFileSelect(file);
      } else {
        alert('Please upload a JPG, PNG, or PDF file.');
      }
    }
  };
  
  // Handle click to open file selector
  const handleClick = () => {
    inputRef.current?.click();
  };
  
  // Handle file input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };
  
  // Handle drag events
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  // Handle drop event
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  
  return (
    <div 
      className={`border-2 border-dashed ${dragActive ? 'border-primary bg-gray-50' : 'border-gray-300'} rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer`}
      onClick={handleClick}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        ref={inputRef}
        onChange={handleChange}
        className="hidden"
        accept=".jpg,.jpeg,.png,.pdf"
      />
      <i className="fas fa-cloud-upload-alt text-gray-400 text-3xl mb-3"></i>
      <p className="font-medium mb-1">{side === 'front' ? 'Front Side Design' : 'Back Side Design'}</p>
      <p className="text-sm text-gray-500">Drag & drop or click to upload</p>
      <p className="mt-2 text-xs text-gray-400">Supported formats: JPG, PNG, PDF</p>
    </div>
  );
};

export default DesignUploader;
