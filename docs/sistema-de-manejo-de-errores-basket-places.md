---
# yaml-language-server: $schema=schemas/document.schema.json
Object type:
    - Document
Tag:
    - documentation
    - software
    - architecture
Description: ¿Qué hice y por qué importa? (máx. 12–15 palabras)
Created by:
    - peks
Creation date: "2025-11-28T06:38:21Z"
id: bafyreidl4ggl7nk4fhqjpaoodnjw4ymbvyyzmjcig5vuklbq3bce46arha
---
# Sistema de Manejo de Errores - Basket Places   
## Filosofía   
**"Throw at the boundaries, handle at the edges"**   
- **Services**: Lanzan errores específicos ( `throw`)   
- **Actions**: Convierten errores a `Result<T>` (nunca lanzan)   
- **UI**: Muestra mensajes al usuario   
 --- 
   
## Arquitectura de Carpetas   
```
lib/
├── errors/
│   ├── base.ts              # AppError clase base
│   ├── handler.ts           # handleServiceError (universal)
│   ├── common-codes.ts      # Códigos compartidos (UNAUTHORIZED, etc.)
│   └── validation.ts        # ValidationError + helpers Zod
├── types/
│   └── result.ts            # Result<T>, ok(), fail()
└── services/
    ├── ai/                  # IA - Servicio base transversal
    │   ├── aiService.ts
    │   ├── errors.ts        # AIError + AI_ERROR_CODES
    │   └── types.ts
    ├── storage/             # Storage - Servicio base transversal
    │   ├── storageService.ts
    │   ├── errors.ts        # StorageError + STORAGE_ERROR_CODES
    │   └── types.ts
    ├── community/           # Dominio: Communities
    │   ├── communityService.ts
    │   ├── errors.ts        # CommunityError + COMMUNITY_ERROR_CODES
    │   └── types.ts
    └── review/              # Dominio: Reviews
        ├── reviewService.ts
        ├── errors.ts        # ReviewError + REVIEW_ERROR_CODES
        └── types.ts
```
## Componentes del Sistema   
### 1. Errores Centralizados   
```
// lib/errors/base.ts
export abstract class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
```
```
// lib/errors/common-codes.ts
export const CommonErrorCodes = {
  // Autenticación
  UNAUTHORIZED: 'UNAUTHORIZED',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  FORBIDDEN: 'FORBIDDEN',
  
  // Validación
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  
  // Internos
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;
```
```
// lib/errors/validation.ts
export class ValidationError extends AppError {
  constructor(
    message: string,
    code: string,
    public field?: string,
    details?: unknown
  ) {
    super(message, code, details);
  }
}

export function validateOrThrow<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const firstError = result.issues[0];
    throw new ValidationError(
      firstError.message,
      CommonErrorCodes.VALIDATION_ERROR,
      firstError.path.join('.'),
      result.issues
    );
  }
  return result.data;
}
```
```
// lib/errors/handler.ts
export function handleServiceError(error: unknown): Failure {
  if (error instanceof CommunityError) {
    return fail(error.code, error.message, error.details);
  }
  if (error instanceof ReviewError) {
    return fail(error.code, error.message, error.details);
  }
  if (error instanceof StorageError) {
    return fail(error.code, error.message, error.details);
  }
  if (error instanceof AIError) {
    return fail(error.code, error.message, {
      provider: error.provider,
      ...(error.details && typeof error.details === 'object' 
        ? error.details 
        : { details: error.details }),
    });
  }
  if (error instanceof ValidationError) {
    return fail(error.code, error.message, error.details, error.field);
  }
  if (error instanceof Error) {
    console.error('Error no manejado:', error);
    return fail(
      CommonErrorCodes.INTERNAL_ERROR,
      'Ocurrió un error inesperado',
      { originalMessage: error.message }
    );
  }
  return fail(CommonErrorCodes.UNKNOWN_ERROR, 'Error desconocido', error);
}
```
### 2. Errores por Dominio/Servicio   
```
// lib/services/community/errors.ts
import { AppError } from '@/lib/errors/base';

export const CommunityErrorCodes = {
  COMMUNITY_NOT_FOUND: 'COMMUNITY_NOT_FOUND',
  COMMUNITY_ALREADY_EXISTS: 'COMMUNITY_ALREADY_EXISTS',
  LOCATION_TOO_CLOSE: 'LOCATION_TOO_CLOSE',
} as const;

export class CommunityError extends AppError {
  constructor(
    message: string,
    code: keyof typeof CommunityErrorCodes,
    details?: unknown
  ) {
    super(message, code, details);
  }
}
```
```
// lib/services/review/errors.ts
export const ReviewErrorCodes = {
  REVIEW_NOT_FOUND: 'REVIEW_NOT_FOUND',
  REVIEW_ALREADY_EXISTS: 'REVIEW_ALREADY_EXISTS',
  NOT_REVIEW_OWNER: 'NOT_REVIEW_OWNER',
} as const;

export class ReviewError extends AppError {
  constructor(
    message: string,
    code: keyof typeof ReviewErrorCodes,
    details?: unknown
  ) {
    super(message, code, details);
  }
}
```
```
// lib/services/ai/errors.ts
export const AIErrorCodes = {
  AI_UNAVAILABLE: 'AI_UNAVAILABLE',
  AI_VALIDATION_FAILED: 'AI_VALIDATION_FAILED',
  NOT_BASKETBALL_COURT: 'NOT_BASKETBALL_COURT',
  INAPPROPRIATE_CONTENT: 'INAPPROPRIATE_CONTENT',
} as const;

export class AIError extends AppError {
  constructor(
    message: string,
    code: keyof typeof AIErrorCodes,
    public provider: string,
    details?: unknown
  ) {
    super(message, code, details);
  }
}
```
### 3. Result Type   
```
// lib/types/result.ts
export type Success<T> = {
  success: true;
  data: T;
};

export type Failure = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
    field?: string;
  };
};

export type Result<T> = Success<T> | Failure;

export function ok<T>(data: T): Success<T> {
  return { success: true, data };
}

export function fail(
  code: string,
  message: string,
  details?: unknown,
  field?: string
): Failure {
  return { success: false, error: { code, message, details, field } };
}
```
 --- 
 --- 
## Flujo Completo (Ejemplo)   
### 1. Service (Lanza errores)   
```
// lib/services/review/reviewService.ts
import { ReviewError, ReviewErrorCodes } from './errors';

export async function createReview(review: ReviewInput): Promise<string> {
  // Verificar duplicados
  const exists = await hasUserReviewedCommunity(review.user_id, review.community_id);
  
  if (exists) {
    throw new ReviewError(
      'Ya has valorado esta comunidad',
      ReviewErrorCodes.REVIEW_ALREADY_EXISTS,
      { userId: review.user_id }
    );
  }

  const { data, error } = await supabase.from('reviews').insert(review).select('id').single();

  if (error) {
    throw new ReviewError(
      'No se pudo crear la valoración',
      ReviewErrorCodes.REVIEW_NOT_FOUND,
      { supabaseError: error }
    );
  }

  return data.id;
}
```
### 2. Server Action (Convierte a Result)   
```
// app/(main)/comunidad/[id]/reviews/actions.ts
'use server';
import { ok, type Result } from '@/lib/types/result';
import { handleServiceError } from '@/lib/errors/handler';
import { validateOrThrow } from '@/lib/errors/validation';
import * as reviewService from '@/lib/services/review/reviewService';

export async function createReviewAction(
  data: ReviewFormData
): Promise<Result<{ id: string; message: string }>> {
  try {
    // Validar (lanza ValidationError si falla)
    const validated = validateOrThrow(reviewSchema, data);

    // Auth
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return fail(CommonErrorCodes.UNAUTHORIZED, 'Debes iniciar sesión');
    }

    // Service (puede lanzar ReviewError)
    const reviewId = await reviewService.createReview({
      user_id: user.id,
      ...validated,
    });

    return ok({ id: reviewId, message: '¡Gracias por tu valoración!' });
  } catch (error) {
    return handleServiceError(error); // ← Convierte todo a Result
  }
}
```
### 3. Client Component (Muestra al usuario)   
```
// app/(main)/comunidad/[id]/reviews/ReviewForm.tsx
'use client';

export function ReviewForm() {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await createReviewAction(formData);

    if (!result.success) {
      toast.error(result.error.message);
      return;
    }

    toast.success(result.data.message);
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```
 --- 
## Reglas Rápidas   
### ✅ Services   
- Lanzan errores: `throw new ReviewError(...)`   
- Devuelven datos directamente: `return data`   
   
### ✅ Actions   
- Devuelven `Result<T>`: `return ok(data)` o `return fail(...)`   
- Usan `handleServiceError` en el catch   
- Nunca lanzan errores   
   
### ✅ UI   
- Checa `result.success`   
- Muestra `result.error.message` al usuario   
- Opcional: Lógica según `result.error.code`   
 --- 
   
## Checklist para Nueva Feature   
- [ ] Crear `lib/services/[feature]/errors.ts`   
- Define `[Feature]ErrorCodes`   
- Define `[Feature]Error extends AppError`   
   
- [ ] Actualizar `lib/errors/handler.ts`   
- Añadir `if (error instanceof [Feature]Error)`   
   
- [ ] En service: lanzar `[Feature]Error`   
- [ ] En action: usar `try/catch + handleServiceError`   
- [ ] En UI: manejar `Result<T>`   
 --- 
## Cuando Añadir un Nuevo Error   
### ¿Es compartido entre múltiples dominios?   
→ Añádelo a `lib/errors/common-codes.ts`   
### ¿Es específico de un dominio/servicio?   
→ Añádelo a `lib/services/[feature]/errors.ts`   
 --- 
 --- 
**Versión**: 1.0   
**Mantenedores**: Basket Places Team   
