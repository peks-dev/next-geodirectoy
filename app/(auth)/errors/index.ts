// app/(auth)/errors/index.ts
export { AuthErrorCodes, type AuthErrorCode } from './codes';
export {
  AuthError,
  AuthConnectionError,
  AuthSessionError,
  AuthValidationError,
  fromSupabaseAuthError,
} from './custom';
export { AUTH_ERROR_MESSAGES, getAuthErrorMessage } from './messages';
