import { ImageInfo } from '@/lib/utils/images/getImageInfo';

/**
 * Entity Types - Representan datos de base de datos
 */

export interface BaseProfileData {
  user_id: string;
  name: string;
}

export interface ProfileDbResponse extends BaseProfileData {
  updated_at: string;
  created_at: string;
  avatar_url: string | null;
}

export interface ProfileDataToInsert {
  name: string;
  avatar_url?: string;
  user_id: string;
  updated_at: string;
}

/**
 * Store Types - Para estado de la aplicación
 */

export interface ProfileStore {
  profile: ProfileDbResponse | null;
  updateProfile: (updates: Partial<ProfileDbResponse>) => void;
  clearProfile: () => void;
}

export interface EditProfileFormState {
  name: string;
  avatarFile: File | null;
  avatarPreviewUrl: string;
  avatarInfo: ImageInfo | null;
  setName: (name: string) => void;
  setAvatar: (file: File) => Promise<void>;
  clearForm: () => void;
}
