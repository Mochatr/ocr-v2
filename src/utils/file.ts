export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateImageFile = (file: File): ValidationResult => {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!validTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Please upload a valid image file (JPEG, PNG, GIF, BMP)'
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'File size must be less than 10MB'
    };
  }

  return { isValid: true };
};