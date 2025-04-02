export const validateImage = (files: FileList, maxFileSize: number, imageTypes: string[]) => {
    if (files.length !== 1) return "Only one file is allowed";
    const [file] = files;
  
    // Join image types into a string, replace commas before the last type with 'or'
    const allowedTypes = imageTypes.join(", ").replace(/,([^,]*)$/, ' or $1');
    
    if (!imageTypes.includes(file.type)) return `Only ${allowedTypes} images are allowed`;
    if (file.size > maxFileSize) return "File size must be less than 5MB";
    return true;
  };
  