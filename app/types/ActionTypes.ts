export interface ActionResponse<T> {
  success: boolean;
  data: T | null;
  message: string | null;
}
