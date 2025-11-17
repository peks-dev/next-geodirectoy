import { ImageInfo } from '@/lib/utils/images/getImageInfo';

export interface EditProfileFormState {
  name: string;
  avatarFile: File | null;
  avatarPreviewUrl: string;
  avatarInfo: ImageInfo | null;
  setName: (name: string) => void;
  setAvatar: (file: File) => Promise<void>;
  clearForm: () => void;
}

export interface BaseProfileData {
  user_id: string;
  name: string;
}

export interface ProfileDbResponse extends BaseProfileData {
  updated_at: string;
  created_at: string;
  avatar_url: string | null;
}

export interface UpdateProfileAction {
  avatar_file: File | null;
  name: string | null;
}

export interface ProfileStore {
  profile: ProfileDbResponse | null;
  updateProfile: (updates: Partial<ProfileDbResponse>) => void;
  clearProfile: () => void;
}

export interface ProfileDataToInsert {
  name: string;
  avatar_url?: string;
  user_id: string;
  updated_at: string;
}

export interface UpdateProfileResult {
  success: boolean;
  data: {
    name: string;
    avatar_url: string | null;
    user_id: string;
  } | null;
  message?: string;
}
