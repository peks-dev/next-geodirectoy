// lib/errors/codes.ts
export const ErrorCodes = {
  // ============================================
  // VALIDACIÓN (400)
  // ============================================
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_FIELD: 'MISSING_FIELD',
  INVALID_COORDINATES: 'INVALID_COORDINATES',
  INVALID_IMAGE_FORMAT: 'INVALID_IMAGE_FORMAT',
  INVALID_FILE_SIZE: 'INVALID_FILE_SIZE',

  // ============================================
  // AUTORIZACIÓN (403)
  // ============================================
  FORBIDDEN: 'FORBIDDEN',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  NOT_OWNER: 'NOT_OWNER',

  // ============================================
  // NOT FOUND (404)
  // ============================================
  NOT_FOUND: 'NOT_FOUND',
  COMMUNITY_NOT_FOUND: 'COMMUNITY_NOT_FOUND',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  IMAGE_NOT_FOUND: 'IMAGE_NOT_FOUND',

  // ============================================
  // CONFLICTOS (409)
  // ============================================
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  PENDING_CONTRIBUTION: 'PENDING_CONTRIBUTION',
  REVIEW_ALREADY_EXISTS: 'REVIEW_ALREADY_EXISTS',

  // ============================================
  // REGLAS DE NEGOCIO (422)
  // ============================================
  BUSINESS_RULE_VIOLATION: 'BUSINESS_RULE_VIOLATION',
  LOCATION_TOO_CLOSE: 'LOCATION_TOO_CLOSE',
  INSUFFICIENT_IMAGES: 'INSUFFICIENT_IMAGES',
  TOO_MANY_IMAGES: 'TOO_MANY_IMAGES',

  // ============================================
  // STORAGE (Supabase Storage)
  // ============================================
  STORAGE_ERROR: 'STORAGE_ERROR',
  UPLOAD_FAILED: 'UPLOAD_FAILED',
  DELETE_FAILED: 'DELETE_FAILED',
  DOWNLOAD_FAILED: 'DOWNLOAD_FAILED',
  BUCKET_NOT_FOUND: 'BUCKET_NOT_FOUND',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',

  // ============================================
  // BASE DE DATOS
  // ============================================
  DATABASE_ERROR: 'DATABASE_ERROR',
  QUERY_FAILED: 'QUERY_FAILED',
  CONNECTION_ERROR: 'CONNECTION_ERROR',
  CONSTRAINT_VIOLATION: 'CONSTRAINT_VIOLATION',

  // ============================================
  // ERRORES INTERNOS (500)
  // ============================================
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];
