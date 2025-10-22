import { z } from 'zod';

// Form data validation (no File instance)
export const vendorApplicationSchema = z.object({
  businessName: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/),
  businessType: z.enum(['farm', 'producer', 'artisan']),
  description: z.string().min(50).max(500),
});

export type VendorApplication = z.infer<typeof vendorApplicationSchema>;

// File upload configuration
export const FILE_UPLOAD_RULES = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: new Set([
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/jpg',
  ]),
};

// Client-side file validation (browser File object)
export function validateFile(
  file: File | null
): { ok: true } | { ok: false; error: string } {
  if (!file) {
    return { ok: false, error: 'No file provided' };
  }

  if (file.size > FILE_UPLOAD_RULES.maxSize) {
    return {
      ok: false,
      error: `File must be less than ${FILE_UPLOAD_RULES.maxSize / 1024 / 1024}MB`,
    };
  }

  if (!FILE_UPLOAD_RULES.allowedTypes.has(file.type)) {
    return {
      ok: false,
      error: `File must be PDF, JPEG, or PNG`,
    };
  }

  return { ok: true };
}

// Server-side file validation (works with Blob or File)
export function validateUploadedFile(
  file: Blob | File,
  options = FILE_UPLOAD_RULES
): { ok: true } | { ok: false; error: string } {
  const size = (file as any).size ?? 0;
  const type = (file as any).type ?? '';

  if (size > options.maxSize) {
    return { ok: false, error: 'File too large' };
  }

  if (!options.allowedTypes.has(type)) {
    return { ok: false, error: 'Invalid file type' };
  }

  return { ok: true };
}
