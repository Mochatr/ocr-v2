export const validateImageFile = (file) => {
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB 
  const ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/bmp'
  ];

  if (!file) {
    return 'No file provided';
  }

  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return 'Invalid file type. Only JPEG, PNG, GIF, and BMP files are allowed';
  }

  if (file.size > MAX_FILE_SIZE) {
    return 'File size exceeds 10MB limit';
  }

  return null;
};