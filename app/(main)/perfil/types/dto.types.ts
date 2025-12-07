/**
 * DTO Types - Para transferencia de datos entre capas
 */

export interface UpdateProfileActionInput {
  userId: string;
  name?: string;
  compressedAvatar?: {
    data: string;
    name: string;
    type: string;
  };
}
