import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import styles from './DropzoneInput.module.css'; // optional

interface FileWithPreview extends File {
  preview: string;
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
  maxFiles = 5, // Set max files to 5
  multiple = true,
}) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const filesWithPreview: FileWithPreview[] = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      const newFiles = [...files, ...filesWithPreview].slice(0, maxFiles); // Limit to maxFiles
      setFiles(newFiles);
      onDrop(newFiles);
    },
    [files, maxFiles, onDrop]
  );

  const removeFile = (fileToRemove: FileWithPreview) => {
    const newFiles = files.filter((file) => file !== fileToRemove);
    setFiles(newFiles);
    onDrop(newFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg'],
    },
    multiple,
    maxFiles,
  });

  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

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
          {files.slice(0, 5).map((file, idx) => (
            <div key={idx} className={styles.previewThumb}>
              <img
                src={file.preview}
                alt={`preview ${idx}`}
                className={styles.previewImage}
              />
              <div className={styles.fileName}>{file.name}</div>
              <button
                className={styles.removeButton}
                onClick={() => removeFile(file)}
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
