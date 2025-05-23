import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import styles from './DropzoneInput.module.css'; // optional

// Helper to generate a unique ID for each file
const getFileId = (file: File) => `${file.name}_${file.size}_${file.lastModified}`;

interface FileWithPreview extends File {
  preview: string;
  id: string;
}

type DropzoneInputProps = {
  onDrop: (files: File[]) => void;
  error?: any;
  maxFiles?: number;
  multiple?: boolean;
};

const DropzoneInput: React.FC<DropzoneInputProps> = ({
  onDrop,
  error,
  maxFiles = 5,
  multiple = true,
}) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const filesWithPreview: FileWithPreview[] = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
          id: getFileId(file),
        })
      );

      setFiles((prevFiles) => {
        const allFiles = [...prevFiles, ...filesWithPreview];
        const uniqueFiles = allFiles.filter(
          (file, idx, arr) => arr.findIndex((f) => f.id === file.id) === idx
        );
        const newFiles = uniqueFiles.slice(0, maxFiles);
        
        // Call onDrop asynchronously after state update
        setTimeout(() => onDrop(newFiles), 0);
        
        return newFiles;
      });
    },
    [maxFiles, onDrop]
  );

  const removeFile = useCallback((fileId: string) => {
    setFiles((prevFiles) => {
      const fileToRemove = prevFiles.find((f) => f.id === fileId);
      if (fileToRemove) URL.revokeObjectURL(fileToRemove.preview);

      const newFiles = prevFiles.filter((file) => file.id !== fileId);
      
      // Call onDrop asynchronously after state update
      setTimeout(() => onDrop(newFiles), 0);
      
      return newFiles;
    });
  }, [onDrop]);

  // Clean up previews when component unmounts
  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg'],
    },
    multiple,
    maxFiles,
  });

  return (
    <div className={styles.dropzoneContainer}>
      <div {...getRootProps({ className: styles.dropzone })}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the images here...</p>
        ) : (
          <p>Drag & drop up to {maxFiles} images here, or click to select</p>
        )}
      </div>

      {files.length > 0 && (
        <div className={styles.previewContainer}>
          {files.map((file) => (
            <div key={file.id} className={styles.previewThumb}>
              <img
                src={file.preview}
                alt={`preview ${file.name}`}
                className={styles.previewImage}
              />
              <div className={styles.fileName}>{file.name}</div>
              <button
                className={styles.removeButton}
                onClick={() => removeFile(file.id)}
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-danger mt-2">{error.message || error}</p>}
    </div>
  );
};

export default DropzoneInput;